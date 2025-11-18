# backend/app/services/llm_service.py
import os
import json
import re
from typing import List, Dict, Any

# openai library (official)
try:
    import openai
except Exception:
    openai = None

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def _redact_secrets(code: str) -> str:
    """
    Simple redactor: remove things that look like keys/tokens.
    This is a best-effort step — not a security guarantee.
    """
    # remove likely API keys (sk-....)
    code = re.sub(r"sk-[A-Za-z0-9\-_]{16,}", "[REDACTED_KEY]", code)
    # remove long hex strings
    code = re.sub(r"[A-Fa-f0-9]{40,}", "[REDACTED_HEX]", code)
    return code


def _extract_json_from_text(text: str) -> Any:
    """
    Try to find a JSON array/object inside text and parse it.
    """
    # common approach: find first { or [ and last matching bracket
    start = None
    for i, ch in enumerate(text):
        if ch in ("[", "{"):
            start = i
            break
    if start is None:
        return None
    substring = text[start:]
    # Try to balance braces/brackets heuristically
    # Attempt progressively larger substrings and JSON-parse them
    for end in range(len(substring), 0, -1):
        candidate = substring[:end]
        try:
            return json.loads(candidate)
        except Exception:
            continue
    return None


def generate_ai_review(file_path: str, code: str, linter_results: List[Dict]) -> List[Dict]:
    """
    If OPENAI_API_KEY is set and openai package is available, call OpenAI to get suggestions.
    Returns a list of issue dicts (same shape as linter outputs).
    """
    if not OPENAI_API_KEY or openai is None:
        return []  # graceful fallback: no AI issues

    openai.api_key = OPENAI_API_KEY

    safe_code = _redact_secrets(code)

    prompt = f"""
You are an expert senior software engineer. Given the contents of a single source file, return a JSON array of issue objects.
Each issue object must include:
- file: file path or filename
- line: integer line number (or null)
- severity: one of "low", "medium", "high"
- title: short title
- explanation: short explanation of the issue
- suggestion: (optional) suggested fix or code snippet

Here is the file contents:

```{safe_code}```

Also consider the following `linter_results` context (do not repeat identical issues):
{json.dumps(linter_results)}


Return ONLY valid JSON (an array). Do not include any extra text.
"""

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # change model if needed
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=1000,
        )
        # Get assistant text
        text = resp["choices"][0]["message"]["content"]
        parsed = _extract_json_from_text(text)
        ai_issues = []
        if isinstance(parsed, list):
            for item in parsed:
                # Normalize keys to expected shape
                ai_issues.append({
                    "file": item.get("file", file_path),
                    "line": item.get("line"),
                    "severity": item.get("severity", "low"),
                    "title": item.get("title", "AI suggestion"),
                    "explanation": item.get("explanation", ""),
                    "suggestion": item.get("suggestion")
                })
        return ai_issues
    except Exception:
        # On any failure, return empty so API remains available
        return []
