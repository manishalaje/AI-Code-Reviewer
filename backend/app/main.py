import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
import re

# Load environment variables
load_dotenv()

app = FastAPI(title="🚀 AI Code Review Assistant")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq config
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("❌ GROQ_API_KEY missing in .env")

# ---- FIXED HERE ----
client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama-3.3-70b-versatile"


def redact_secrets(text: str) -> str:
    text = re.sub(r"sk-[A-Za-z0-9\-_]{16,}", "[REDACTED_KEY]", text)
    text = re.sub(r"[A-Fa-f0-9]{40,}", "[REDACTED_HEX]", text)
    text = re.sub(r"AKIA[0-9A-Z]{16}", "[REDACTED_AWS_KEY]", text)
    return text


@app.get("/")
def root():
    return {"message": "🚀 Backend running!"}


@app.post("/upload")
async def upload_code_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        code_text = contents.decode("utf-8", errors="ignore")
        safe_code = redact_secrets(code_text)

        prompt = f"""
You are an expert AI code reviewer.

Analyze this code and provide:
1. Summary
2. Issues with explanations
3. Suggestions for improvement
4. Code quality score /10

Code:
{safe_code}
"""

        completion = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1200,
        )

        review_output = completion.choices[0].message.content

        return {"feedback": review_output or "No feedback from model."}

    except Exception as e:
        print("❌ Backend Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
