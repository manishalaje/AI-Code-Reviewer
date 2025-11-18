from fastapi import APIRouter, HTTPException
from app.services.github_service import GitHubService

router = APIRouter()
github = GitHubService()

@router.get("/repos")
def list_repos():
    try:
        return github.get_user_repos()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/repos/{owner}/{repo}/pulls")
def list_pull_requests(owner: str, repo: str):
    try:
        return github.get_pull_requests(owner, repo)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/repos/{owner}/{repo}/pulls/{pr_number}/files")
def list_pr_files(owner: str, repo: str, pr_number: int):
    try:
        return github.get_pull_request_files(owner, repo, pr_number)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
