#!/usr/bin/env node

/**
 * fix-easings.js
 * 
 * This script scans the codebase for hardcoded animation easing values and suggests
 * replacing them with centralized constants from lib/animation.ts.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the animation constants file
const animationFilePath = path.join(process.cwd(), 'src', 'lib', 'animation.ts');

// Regex patterns for finding hardcoded easings
const EASING_PATTERNS = [
  /ease-in/g,
  /ease-out/g,
  /ease-in-out/g,
  /cubic-bezier\([\d\., ]+\)/g,
  /\[\s*[\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+\s*\]/g, // Array format [0.25, 0.1, 0.25, 1]
  /transition:\s*.*?ease/g,
];

// Files to exclude from scanning
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'public',
];

// File extensions to scan
const INCLUDE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
];

// Load the animation constants
function loadAnimationConstants() {
  try {
    const content = fs.readFileSync(animationFilePath, 'utf8');
    console.log('✅ Found animation constants file');
    
    // Extract the EASING object definition
    const easingMatch = content.match(/export\s+const\s+EASING\s*=\s*{[\s\S]*?}/m);
    if (!easingMatch) {
      console.warn('⚠️ Could not find EASING object in animation.ts');
      return null;
    }
    
    // Parse the EASING object to get available constants
    const easingBlock = easingMatch[0];
    const easingEntries = {};
    
    // Extract each easing entry
    const entryRegex = /([\w]+):\s*\[([\d\., ]+)\]/g;
    let match;
    while ((match = entryRegex.exec(easingBlock)) !== null) {
      const name = match[1];
      const values = match[2].split(',').map(v => parseFloat(v.trim()));
      easingEntries[name] = values;
    }
    
    return easingEntries;
  } catch (error) {
    console.error(`❌ Error loading animation constants: ${error.message}`);
    return null;
  }
}

// Find all relevant files in the project
function findFiles() {
  try {
    // Use git ls-files if available for better performance
    try {
      const gitFiles = execSync('git ls-files', { encoding: 'utf8' })
        .split('\n')
        .filter(file => 
          INCLUDE_EXTENSIONS.some(ext => file.endsWith(ext)) &&
          !EXCLUDE_DIRS.some(dir => file.startsWith(dir))
        );
      return gitFiles;
    } catch (e) {
      // Fallback to manual traversal if git command fails
      console.log('⚠️ Git command failed, falling back to manual file traversal');
    }
    
    const result = [];
    
    function traverseDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!EXCLUDE_DIRS.includes(entry.name)) {
            traverseDir(fullPath);
          }
        } else if (INCLUDE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
          result.push(fullPath);
        }
      }
    }
    
    traverseDir(process.cwd());
    return result;
  } catch (error) {
    console.error(`❌ Error finding files: ${error.message}`);
    return [];
  }
}

// Find the best matching easing constant for a given value
function findBestMatch(value, easingEntries) {
  // For cubic-bezier format
  if (value.startsWith('cubic-bezier')) {
    const numbers = value.match(/[\d\.]+/g).map(v => parseFloat(v));
    if (numbers.length === 4) {
      return findArrayMatch(numbers, easingEntries);
    }
  }
  
  // For array format
  if (value.startsWith('[')) {
    const numbers = value.match(/[\d\.]+/g).map(v => parseFloat(v));
    if (numbers.length === 4) {
      return findArrayMatch(numbers, easingEntries);
    }
  }
  
  // For named easings
  if (value === 'ease-in') return 'EASING.easeIn';
  if (value === 'ease-out') return 'EASING.easeOut';
  if (value === 'ease-in-out') return 'EASING.easeInOut';
  if (value === 'linear') return 'EASING.linear';
  
  return null;
}

// Find the closest matching array
function findArrayMatch(numbers, easingEntries) {
  let bestMatch = null;
  let smallestDiff = Infinity;
  
  for (const [name, values] of Object.entries(easingEntries)) {
    if (values.length === numbers.length) {
      const diff = values.reduce((sum, val, i) => sum + Math.abs(val - numbers[i]), 0);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestMatch = name;
      }
    }
  }
  
  // Only suggest if it's a reasonably close match
  return smallestDiff < 0.5 ? `EASING.${bestMatch}` : null;
}

// Scan a file for hardcoded easings
function scanFile(filePath, easingEntries) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = [];
    
    for (const pattern of EASING_PATTERNS) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const value = match[0];
        const bestMatch = findBestMatch(value, easingEntries);
        
        if (bestMatch) {
          findings.push({
            line: content.substring(0, match.index).split('\n').length,
            value,
            suggestion: bestMatch,
            context: content.substring(
              Math.max(0, match.index - 40),
              Math.min(content.length, match.index + value.length + 40)
            )
          });
        }
      }
    }
    
    return findings;
  } catch (error) {
    console.error(`❌ Error scanning ${filePath}: ${error.message}`);
    return [];
  }
}

// Main function
async function main() {
  console.log('🔍 Scanning for hardcoded animation easings...');
  
  // Load animation constants
  const easingEntries = loadAnimationConstants();
  if (!easingEntries) {
    console.error('❌ Could not load animation constants. Exiting.');
    process.exit(1);
  }
  
  console.log(`📊 Found ${Object.keys(easingEntries).length} easing constants in animation.ts`);
  
  // Find files to scan
  const files = findFiles();
  console.log(`🔎 Scanning ${files.length} files...`);
  
  // Scan each file
  let totalFindings = 0;
  const fileFindings = {};
  
  for (const file of files) {
    const findings = scanFile(file, easingEntries);
    if (findings.length > 0) {
      fileFindings[file] = findings;
      totalFindings += findings.length;
    }
  }
  
  // Report findings
  if (totalFindings === 0) {
    console.log('✅ No hardcoded easings found! Your codebase is using centralized constants.');
  } else {
    console.log(`⚠️ Found ${totalFindings} hardcoded easings in ${Object.keys(fileFindings).length} files:`);
    
    for (const [file, findings] of Object.entries(fileFindings)) {
      console.log(`\n📄 ${file} (${findings.length} findings):`);
      
      for (const finding of findings) {
        console.log(`   Line ${finding.line}: Replace "${finding.value}" with "${finding.suggestion}"`);
        console.log(`   Context: "${finding.context.trim()}"`);
        console.log('');
      }
    }
    
    console.log('\n💡 To fix these issues, import the EASING object from @/lib/animation and use the suggested constants.');
  }
}

// Run the script
main().catch(error => {
  console.error(`❌ Unhandled error: ${error.message}`);
  process.exit(1);
});