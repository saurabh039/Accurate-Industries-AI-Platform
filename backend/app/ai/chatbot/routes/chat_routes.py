from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.chatbot.services.chat_service import get_response


router = APIRouter(
    prefix="/api/chat",
    tags=["AI Chatbot"]
)


class ChatRequest(BaseModel):
    message: str
    session_id: str
    history: list = []


@router.post("/")
def chat(request: ChatRequest):

    answer = get_response(
        request.message,
        request.history,
        request.session_id
    )

    return {
        "response": answer
    }