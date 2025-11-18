import requests
import os

GITHUB_API_URL = "https://api.github.com"

class GitHubService:
    def __init__(self):
        self.token = os.getenv("GITHUB_TOKEN")
        if not self.token:
            raise ValueError("❌ GITHUB_TOKEN not found in environment variables")
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def get_user_repos(self):
        """Fetch authenticated user's repositories"""
        url = f"{GITHUB_API_URL}/user/repos"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_pull_requests(self, owner, repo):
        """Fetch open pull requests for a repo"""
        url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/pulls"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def get_pull_request_files(self, owner, repo, pr_number):
        """Fetch files from a PR"""
        url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/pulls/{pr_number}/files"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
