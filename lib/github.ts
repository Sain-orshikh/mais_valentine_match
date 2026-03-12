export interface GitHubFileResponse {
  content: string;
  sha: string;
  name: string;
  path: string;
}

export class GitHubClient {
  private token: string;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    // These should be set in .env.local:
    // GITHUB_TOKEN=your_personal_access_token
    // GITHUB_OWNER=your_github_username
    // GITHUB_REPO=repository_name
    // GITHUB_BRANCH=main (or your default branch)
    this.token = process.env.GITHUB_TOKEN!;
    this.owner = process.env.GITHUB_OWNER!;
    this.repo = process.env.GITHUB_REPO!;
    this.branch = process.env.GITHUB_BRANCH || 'main';
  }

  private get headers() {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  async getFile(path: string): Promise<GitHubFileResponse> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;
    
    const response = await fetch(url, {
      headers: this.headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async updateFile(
    path: string,
    content: string,
    message: string,
    sha: string,
  ): Promise<void> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;
    
    // Encode content to base64
    const encodedContent = Buffer.from(content).toString('base64');

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        message,
        content: encodedContent,
        sha,
        branch: this.branch,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update file: ${error}`);
    }
  }

  async createFile(
    path: string,
    content: string,
    message: string,
  ): Promise<void> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;
    
    // Encode content to base64
    const encodedContent = Buffer.from(content).toString('base64');

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        message,
        content: encodedContent,
        branch: this.branch,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create file: ${error}`);
    }
  }
}
