import subprocess
from typing import List, Dict

def run_linter(filename: str, code: str) -> List[Dict]:
    # Save file temporarily
    with open(filename, "w") as f:
        f.write(code)

    results = []

    # Run flake8
    try:
        output = subprocess.check_output(["flake8", filename]).decode()
        for line in output.strip().split("\n"):
            if line:
                file, lnum, col, msg = line.split(":", 3)
                results.append({
                    "file": file,
                    "line": int(lnum),
                    "severity": "medium",
                    "title": "Flake8 Issue",
                    "explanation": msg,
                    "suggestion": None
                })
    except subprocess.CalledProcessError:
        pass

    # Run bandit for security checks (optional)
    try:
        output = subprocess.check_output(["bandit", "-r", filename, "-f", "json"]).decode()
        # parse json if needed
    except:
        pass

    return results
