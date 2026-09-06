from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    content: str
    extra: Optional[str] = None

class MessageCreate(MessageBase):
    conversation_id: int

class MessageResponse(MessageBase):
    id: int
    conversation_id: int
    timestamp: datetime

    model_config = {"from_attributes": True}

class ConversationBase(BaseModel):
    title: Optional[str] = None

class ConversationCreate(ConversationBase):
    user_id: int
    title: Optional[str] = None

class ConversationResponse(ConversationBase):
    id: int
    user_id: int
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[MessageResponse]] = None

    model_config = {"from_attributes": True}
