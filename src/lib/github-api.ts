import { Octokit } from '@octokit/rest'

interface CommitResult {
  success: boolean
  commitUrl?: string
  sha?: string
  error?: string
}

export class GitHubAPI {
  private octokit: Octokit
  private owner: string
  private repo: string
  private branch: string

  constructor(token: string, repository = 'XandarSword3/Port-San-Antonio', branch = 'main') {
    this.octokit = new Octokit({ auth: token })
    const [owner, repoName] = repository.split('/')
    this.owner = owner
    this.repo = repoName
    this.branch = branch
    
    console.log('🔧 GitHubAPI initialized:', { owner, repo: repoName, branch })
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo,
      })
      
      console.log('✅ GitHub connection successful:', data.full_name)
      return { success: true }
    } catch (error: any) {
      console.error('❌ GitHub connection failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  async commitMenuData(menuData: any): Promise<CommitResult> {
    try {
      console.log('📝 Starting menu data commit...')
      
      const filePath = 'data/dishes.json'
      let fileSha: string | undefined

      // Get current file SHA if it exists
      try {
        const { data: currentFile } = await this.octokit.rest.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: filePath,
          ref: this.branch,
        })

        if ('sha' in currentFile) {
          fileSha = currentFile.sha
          console.log('📄 Found existing file with SHA:', fileSha)
        }
      } catch (error: any) {
        console.log('📄 File does not exist, will create new file')
      }

      // Prepare commit
      const commitMessage = `🍽️ Admin: Update menu data - ${new Date().toLocaleString()}`
      const content = JSON.stringify(menuData, null, 2)
      const contentBase64 = Buffer.from(content).toString('base64')

      console.log('💾 Committing file:', filePath)
      console.log('📝 Commit message:', commitMessage)
      console.log('📊 Content size:', content.length, 'characters')

      // Create or update file
      const { data: commitData } = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        message: commitMessage,
        content: contentBase64,
        branch: this.branch,
        ...(fileSha && { sha: fileSha }),
      })

      console.log('✅ Commit successful!')
      console.log('🔗 Commit URL:', commitData.commit.html_url)
      console.log('🆔 Commit SHA:', commitData.commit.sha)

      return {
        success: true,
        commitUrl: commitData.commit.html_url,
        sha: commitData.commit.sha
      }

    } catch (error: any) {
      console.error('❌ Commit failed:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Legacy function for backward compatibility
export async function commitMenuToGitHub(menuData: any, githubToken: string): Promise<CommitResult> {
  const api = new GitHubAPI(githubToken)
  return await api.commitMenuData(menuData)
}
