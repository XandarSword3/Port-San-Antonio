import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with proper authentication
    const adminSession = request.headers.get('admin-session')
    if (!adminSession && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { menuData } = await request.json()

    if (!menuData) {
      return NextResponse.json({ error: 'Menu data is required' }, { status: 400 })
    }

    // Prepare the GitHub API request
    const token = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPO || 'XandarSword3/Port-San-Antonio'
    const branch = process.env.GITHUB_BRANCH || 'main'
    const path = 'public/menu-data.json'

    if (!token) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    // Get current file SHA
    let sha: string | undefined
    try {
      const currentFileResponse = await fetch(
        `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${token}`,
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
