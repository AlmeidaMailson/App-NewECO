from pydantic import BaseModel, Field
from datetime import datetime


class MensagemCreate(BaseModel):
    remetente_id: int
    conversa_id: int = Field(..., description="O número da caixinha da conversa")
    mensagem: str = Field(..., min_length=1, description="O texto que o usuário digitou")
  


class MensagemResponse(BaseModel):
    id: int
    conversa_id: int
    remetente_id: int
    mensagem: str
    lida: bool
    criado_em: datetime

    class Config:
        from_attributes = True