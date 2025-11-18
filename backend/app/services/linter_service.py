# backend/app/services/linter_service.py
import subprocess
import json
from typing import List, Dict


def parse_flake8_output(output: str) -> List[Dict]:
    """
    Flake8 outputs lines like:
    /path/to/file.py:12:5: F401 'x' imported but unused
    """
    issues = []
    for line in output.splitlines():
        if not line.strip():
            continue
        # Attempt to split into file, line, col, message
        parts = line.split(":", 3)
        if len(parts) >= 4:
            file_path, line_no, col, msg = parts
            issues.append({
                "file": file_path,
                "line": int(line_no) if line_no.isdigit() else None,
                "severity": "medium",
                "title": "Style / Lint issue (flake8)",
                "explanation": msg.strip(),
                "suggestion": None
            })
    return issues


def parse_bandit_json(output: str) -> List[Dict]:
    """
    bandit -r -f json returns JSON. We'll extract findings.
    """
    issues = []
    try:
        data = json.loads(output)
        results = data.get("results", [])
        for r in results:
            issues.append({
                "file": r.get("filename"),
                "line": r.get("line_number"),
                "severity": "high" if r.get("issue_severity", "").lower() in ("high", "medium") else "medium",
                "title": f"Security: {r.get('issue_text')[:80]}",
                "explanation": r.get("issue_text"),
                "suggestion": r.get("confidence", None)
            })
    except Exception:
        # If JSON parse fails, skip bandit results
        pass
    return issues


def run_linter(file_path: str) -> List[Dict]:
    """
    Run flake8 and bandit on the given file_path and return normalized issue dicts.
    """
    results = []

    # Run flake8 (if installed)
    try:
        completed = subprocess.run(["flake8", file_path], capture_output=True, text=True, check=False)
        if completed.stdout:
            results += parse_flake8_output(completed.stdout)
    except FileNotFoundError:
        # flake8 not installed — caller should ensure requirements installed
        pass

    # Run bandit (for security)
    try:
        completed = subprocess.run(["bandit", "-r", file_path, "-f", "json"], capture_output=True, text=True, check=False)
        if completed.stdout:
            results += parse_bandit_json(completed.stdout)
    except FileNotFoundError:
        pass

    # If no results, return a clean result
    if not results:
        results.append({
            "file": file_path,
            "line": None,
            "severity": "none",
            "title": "No static issues found",
            "explanation": "Linters did not report issues.",
            "suggestion": None
        })

    return results
