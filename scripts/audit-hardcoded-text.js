/**
 * Language Audit Script
 * Finds all hardcoded English text that should use t() translation function
 */

const fs = require('fs');
const path = require('path');

// Patterns to detect hardcoded text that should be translated
const patterns = [
  // JSX text content
  /<[^>]+>([A-Z][a-zA-Z\s]{3,})<\//g,
  // String literals in button/link text
  /(?:aria-label|placeholder|title|alt)=["']([A-Z][a-zA-Z\s]{3,})["']/g,
  // Hardcoded strings in variables
  /const\s+\w+\s*=\s*["']([A-Z][a-zA-Z\s]{10,})["']/g,
];

// Files to skip
const skipFiles = [
  'node_modules',
  '.next',
  '.git',
  'scripts',
  'tests',
  '__tests__',
  'translations.ts', // Skip translation file itself
];

// Directories to check
const checkDirs = [
  'src/components',
  'src/app',
  'src/contexts',
];

function shouldSkipFile(filePath) {
  return skipFiles.some(skip => filePath.includes(skip)) ||
         !filePath.match(/\.(tsx?|jsx?)$/);
}

function findHardcodedText(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Skip if line contains t( - already translated
    if (line.includes('t(') || line.includes('t(\'') || line.includes('t("')) {
      return;
    }

    // Skip imports and comments
    if (line.trim().startsWith('import ') || 
        line.trim().startsWith('//') || 
        line.trim().startsWith('/*') ||
        line.trim().startsWith('*')) {
      return;
    }

    // Check for common hardcoded patterns
    const commonWords = [
      'Welcome', 'Menu', 'About', 'Contact', 'Order', 'Cart', 'Checkout',
      'Sign in', 'Sign up', 'Login', 'Logout', 'Profile', 'Settings',
      'Search', 'Filter', 'Sort', 'View', 'Edit', 'Delete', 'Save', 'Cancel',
      'Submit', 'Back', 'Next', 'Previous', 'Home', 'Dashboard',
      'Experience luxury', 'Premier', 'Discover', 'Explore', 'Learn more',
      'Get started', 'Read more', 'View all', 'Show more', 'Load more',
      'Add to cart', 'Buy now', 'Place order', 'Confirm', 'Continue',
      'Email', 'Password', 'Username', 'Phone', 'Address', 'City', 'Country',
      'First name', 'Last name', 'Full name', 'Date', 'Time', 'Price',
      'Total', 'Subtotal', 'Discount', 'Tax', 'Shipping', 'Payment',
    ];

    commonWords.forEach(word => {
      const regex = new RegExp(`["'\`]${word}["'\`]|>[^<]*${word}[^<]*<`, 'i');
      if (regex.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          content: line.trim(),
          suggestion: `Should use t('${word.toLowerCase().replace(/\s+/g, '')}')`,
        });
      }
    });

    // Check for multi-word English phrases in quotes
    const phraseMatch = line.match(/["']([A-Z][a-z]+(?:\s+[a-z]+){2,})["']/);
    if (phraseMatch && !line.includes('http') && !line.includes('className')) {
      issues.push({
        file: filePath,
        line: index + 1,
        content: line.trim(),
        suggestion: `Phrase "${phraseMatch[1]}" should be translated`,
      });
    }
  });

  return issues;
}

function scanDirectory(dir) {
  const issues = [];

  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);

    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !shouldSkipFile(filePath)) {
        scan(filePath);
      } else if (stat.isFile() && !shouldSkipFile(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileIssues = findHardcodedText(content, filePath);
        issues.push(...fileIssues);
      }
    });
  }

  scan(dir);
  return issues;
}

// Run audit
console.log('🔍 Scanning for hardcoded text that needs translation...\n');

const allIssues = [];
checkDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    const issues = scanDirectory(dirPath);
    allIssues.push(...issues);
  }
});

// Group by file
const byFile = {};
allIssues.forEach(issue => {
  if (!byFile[issue.file]) {
    byFile[issue.file] = [];
  }
  byFile[issue.file].push(issue);
});

// Print results
if (Object.keys(byFile).length === 0) {
  console.log('✅ No hardcoded text found! All strings appear to use translations.');
} else {
  console.log(`⚠️  Found ${allIssues.length} potential hardcoded strings in ${Object.keys(byFile).length} files:\n`);
  
  Object.keys(byFile).forEach(file => {
    console.log(`\n📄 ${file.replace(process.cwd(), '')}`);
    byFile[file].forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.suggestion}`);
      console.log(`   → ${issue.content.substring(0, 100)}`);
    });
  });

  console.log(`\n\n📊 Summary: ${allIssues.length} issues found in ${Object.keys(byFile).length} files`);
}

// Create report file
const reportPath = path.join(process.cwd(), 'TRANSLATION_AUDIT.md');
let report = '# Translation Audit Report\n\n';
report += `Generated: ${new Date().toISOString()}\n\n`;
report += `## Summary\n\n`;
report += `- **Total Issues:** ${allIssues.length}\n`;
report += `- **Files Affected:** ${Object.keys(byFile).length}\n\n`;
report += `## Issues by File\n\n`;

Object.keys(byFile).forEach(file => {
  report += `### ${file.replace(process.cwd(), '')}\n\n`;
  byFile[file].forEach(issue => {
    report += `- **Line ${issue.line}:** ${issue.suggestion}\n`;
    report += `  \`\`\`\n  ${issue.content}\n  \`\`\`\n\n`;
  });
});

fs.writeFileSync(reportPath, report);
console.log(`\n📝 Full report saved to: TRANSLATION_AUDIT.md`);
