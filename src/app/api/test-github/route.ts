import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPO || 'XandarSword3/Port-San-Antonio'
    
    console.log('🔧 Testing GitHub connection...')
    console.log('📂 Repository:', githubRepo)
    console.log('🔑 Token present:', !!githubToken)
    
    if (!githubToken) {
      return NextResponse.json({ 
        error: 'GitHub token not configured',
        config: {
          repo: githubRepo,
          tokenPresent: false
        }
      }, { status: 500 })
    }

    const octokit = new Octokit({
      auth: githubToken,
    })

    // Test repository access
    const { data: repo } = await octokit.rest.repos.get({
      owner: githubRepo.split('/')[0],
      repo: githubRepo.split('/')[1],
    })

    // Test if we can access the menu file
    let menuFileExists = false
    try {
      await octokit.rest.repos.getContent({
        owner: githubRepo.split('/')[0],
        repo: githubRepo.split('/')[1],
        path: 'data/dishes.json',
      })
      menuFileExists = true
    } catch (error) {
      console.log('Menu file does not exist yet, will be created on first commit')
    }

    return NextResponse.json({
      success: true,
      repository: {
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        permissions: repo.permissions
      },
      menuFileExists,
      message: 'GitHub connection successful'
    })

  } catch (error: any) {
    console.error('❌ GitHub test failed:', error)
    return NextResponse.json({
      error: 'GitHub connection failed',
      details: error.message,
      status: error.status
    }, { status: 500 })
  }
}
