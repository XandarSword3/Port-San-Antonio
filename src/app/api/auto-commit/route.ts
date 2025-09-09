import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Auto-commit request received')
    
    // Get authentication token from header or cookie
    const authHeader = request.headers.get('authorization')
    const authToken = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
    
    console.log('🔐 Auth token present:', !!authToken)
    
    if (!authToken) {
      console.log('❌ No authentication token provided')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify authentication
    const authResult = verifyToken(authToken)
    console.log('🔍 Auth verification result:', authResult.success)
    
    if (!authResult.success || !authResult.payload) {
      console.log('❌ Authentication failed:', authResult.error)
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Check if user has admin or owner permissions
    const userRole = authResult.payload.role
    console.log('👤 User role:', userRole)
    
    if (!['admin', 'owner'].includes(userRole)) {
      console.log('❌ Insufficient permissions for role:', userRole)
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    console.log('✅ Authentication successful for user:', authResult.payload.username)

    // Get menu data from request
    const { menuData } = await request.json()
    console.log('📊 Menu data received, size:', JSON.stringify(menuData).length, 'bytes')

    if (!menuData) {
      return NextResponse.json({ error: 'Menu data is required' }, { status: 400 })
    }

    // GitHub configuration
    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPO || 'XandarSword3/Port-San-Antonio'
    const githubBranch = process.env.GITHUB_BRANCH || 'main'
    
    console.log('🔧 GitHub config - Repo:', githubRepo, 'Branch:', githubBranch, 'Token present:', !!githubToken)

    if (!githubToken) {
      console.log('⚠️ GitHub token not configured - auto-commit disabled')
      return NextResponse.json({ 
        error: 'GitHub token not configured. Please set GITHUB_TOKEN in your Vercel environment variables.',
        instructions: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add GITHUB_TOKEN'
      }, { status: 503 })
    }

    // Initialize Octokit
    const { Octokit } = await import('@octokit/rest')
    const octokit = new Octokit({
      auth: githubToken,
    })

    console.log('🔗 Octokit initialized, attempting commit...')

    // Get current file to get its SHA
    const filePath = 'data/dishes.json'
    let fileSha: string | undefined

    try {
      const { data: currentFile } = await octokit.rest.repos.getContent({
        owner: githubRepo.split('/')[0],
        repo: githubRepo.split('/')[1],
        path: filePath,
        ref: githubBranch,
      })

      if ('sha' in currentFile) {
        fileSha = currentFile.sha
        console.log('📄 Current file SHA:', fileSha)
      }
    } catch (error: any) {
      console.log('⚠️ File might not exist yet, will create new:', error.message)
    }

    // Create or update the file
    const commitMessage = `🍽️ Admin: Update menu data - ${new Date().toLocaleString()}`
    const contentBase64 = Buffer.from(JSON.stringify(menuData, null, 2)).toString('base64')

    console.log('💾 Committing to GitHub...')
    console.log('📝 Commit message:', commitMessage)
    console.log('📁 File path:', filePath)

    const commitResponse = await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubRepo.split('/')[0],
      repo: githubRepo.split('/')[1],
      path: filePath,
      message: commitMessage,
      content: contentBase64,
      branch: githubBranch,
      ...(fileSha && { sha: fileSha }),
    })

    console.log('✅ Commit successful!')
    console.log('🔗 Commit URL:', commitResponse.data.commit.html_url)

    return NextResponse.json({ 
      success: true, 
      message: 'Menu data committed successfully',
      commitUrl: commitResponse.data.commit.html_url,
      sha: commitResponse.data.commit.sha
    })

  } catch (error: any) {
    console.error('❌ Auto-commit error:', error)
    return NextResponse.json({ 
      error: 'Failed to commit changes', 
      details: error.message 
    }, { status: 500 })
  }
}
