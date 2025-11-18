import random

SEVERITIES = ["low", "medium", "high"]

def analyze_code(filename: str, code: str):
    lines = code.split('\n')
    if not code.strip():
        return [{"file": filename, "severity": "info", "message": "File is empty", "line": None}]

    results = []
    for i, line in enumerate(lines):
        if 'print(' in line:
            results.append({
                "file": filename,
                "line": i + 1,
                "severity": random.choice(SEVERITIES),
                "title": "Debug statement found",
                "explanation": "Consider removing print statements in production code.",
                "suggestion": "Use the logging module instead of print()."
            })
        if 'TODO' in line:
            results.append({
                "file": filename,
                "line": i + 1,
                "severity": "low",
                "title": "TODO comment detected",
                "explanation": "There is a TODO marker left in code.",
                "suggestion": "Complete or remove TODO items before merging."
            })
        if 'exec(' in line or 'eval(' in line:
            results.append({
                "file": filename,
                "line": i + 1,
                "severity": "high",
                "title": "Use of exec/eval",
                "explanation": "Using exec/eval can lead to code injection vulnerabilities.",
                "suggestion": "Avoid exec/eval; parse or safer alternatives instead."
            })
    if not results:
        results.append({
            "file": filename,
            "severity": "none",
            "title": "No issues found!",
            "explanation": "Code looks clean.",
            "suggestion": None
        })
    return results
