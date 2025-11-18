# GitHub App / Token Setup (quick)

### Personal Access Token (quick test)
1. Go to https://github.com/settings/tokens
2. Generate new token with scope: repo (or repo:status, repo_deployment, public_repo)
3. Put token in backend/.env as GITHUB_TOKEN

### GitHub App (recommended for production)
1. Create a GitHub App at https://github.com/settings/apps/new
2. Configure permissions (Repository: Issues, Pull requests, etc.)
3. Generate a private key and note App ID and installation ID
4. Use JWT to exchange for installation token (see GitHub App docs)
