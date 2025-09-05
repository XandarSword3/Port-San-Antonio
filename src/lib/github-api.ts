interface GitHubCommitRequest {
  message: string
  content: string
  path: string
  branch?: string
}

class GitHubAPI {
  private token: string
  private repo: string
  private branch: string

  constructor() {
    this.token = process.env.GITHUB_TOKEN || ''
    this.repo = process.env.GITHUB_REPO || 'XandarSword3/Port-San-Antonio'
    this.branch = process.env.GITHUB_BRANCH || 'main'
  }

  async updateFile(path: string, content: string, message: string): Promise<boolean> {
    try {
      // First, get the current file to get its SHA
      const currentFileResponse = await fetch(
        `https://api.github.com/repos/${this.repo}/contents/${path}?ref=${this.branch}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Port-San-Antonio-Admin'
          }
        }
      )

      let sha: string | undefined

      if (currentFileResponse.ok) {
        const currentFile = await currentFileResponse.json()
        sha = currentFile.sha
      }

      // Update or create the file
      const updateResponse = await fetch(
        `https://api.github.com/repos/${this.repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Port-San-Antonio-Admin'
          },
          body: JSON.stringify({
            message,
            content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
            branch: this.branch,
            ...(sha && { sha })
          })
        }
      )

      if (!updateResponse.ok) {
        const error = await updateResponse.text()
        console.error('GitHub API Error:', error)
        throw new Error(`GitHub API Error: ${updateResponse.status} ${error}`)
      }

      console.log('Successfully updated file on GitHub:', path)
      return true
    } catch (error) {
      console.error('Error updating GitHub file:', error)
      throw error
    }
  }

  async commitMenuData(menuData: any): Promise<boolean> {
    const content = JSON.stringify(menuData, null, 2)
    const message = `🍽️ Admin: Update menu data - ${new Date().toLocaleString()}`
    
    return this.updateFile('public/menu-data.json', content, message)
  }
}

export const githubAPI = new GitHubAPI()
