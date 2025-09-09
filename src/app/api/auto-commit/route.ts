import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Auto-commit API for GitHub integration

export async function POST(request: NextRequest) {
  try {
    // Verify authentication with detailed logging
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = AuthService.extractTokenFromHeader(request.headers.get('authorization'))
    const authToken = cookieToken || headerToken

    console.log('Auto-commit authentication check:')
    console.log('  - Cookie token:', cookieToken ? 'present' : 'missing')
    console.log('  - Header token:', headerToken ? 'present' : 'missing')
    console.log('  - Final token:', authToken ? 'present' : 'missing')

    if (!authToken) {
      console.log('  ❌ No authentication token found')
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 })
    }

    const isValidAdmin = AuthService.verifyAdminToken(authToken)
    console.log('  - Token verification:', isValidAdmin ? 'valid' : 'invalid')

    if (!isValidAdmin) {
      console.log('  ❌ Invalid or non-admin token')
      return NextResponse.json({ error: 'Invalid or insufficient permissions' }, { status: 401 })
    }

    console.log('  ✅ Authentication successful')

    const { menuData } = await request.json()

    if (!menuData) {
      return NextResponse.json({ error: 'Menu data is required' }, { status: 400 })
    }

    // Prepare the GitHub API request
    const githubToken = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPO || 'XandarSword3/Port-San-Antonio'
    const branch = process.env.GITHUB_BRANCH || 'main'
    const path = 'public/menu-data.json'

    if (!githubToken) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    // Get current file SHA
    let sha: string | undefined
    try {
      const currentFileResponse = await fetch(
        `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Port-San-Antonio-Admin'
          }
        }
      )

      if (currentFileResponse.ok) {
        const currentFile = await currentFileResponse.json()
        sha = currentFile.sha
      }
    } catch (error) {
      console.log('File might not exist yet, will create new one')
    }

    // Update the file
    const content = JSON.stringify(menuData, null, 2)
    const message = `🍽️ Admin: Update menu data - ${new Date().toLocaleString()}`

    const updateResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Port-San-Antonio-Admin'
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(content, 'utf-8').toString('base64'),
          branch: branch,
          ...(sha && { sha })
        })
      }
    )

    if (!updateResponse.ok) {
      const error = await updateResponse.text()
      console.error('GitHub API Error:', error)
      return NextResponse.json({ 
        error: 'Failed to update GitHub repository',
        details: error 
      }, { status: 500 })
    }

    const result = await updateResponse.json()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu data committed to GitHub successfully!',
      commit: result.commit?.html_url
    })

  } catch (error) {
    console.error('Error in auto-commit API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
