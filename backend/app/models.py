# backend/app/models.py
from pydantic import BaseModel
from typing import Optional, List, Any


class Issue(BaseModel):
    file: str
    line: Optional[int] = None
    severity: str
    title: str
    explanation: str
    suggestion: Optional[str] = None
    extra: Optional[Any] = None


class ReviewResponse(BaseModel):
    filename: str
    issues: List[Issue]
