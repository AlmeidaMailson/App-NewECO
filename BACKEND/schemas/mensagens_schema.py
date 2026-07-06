from pydantic import BaseModel
from datetime import datetime

class ConversaResponse(BaseModel):
    contato_id: int
    contato_nome: str
    ultima_mensagem: str
    horario: datetime

    class Config:
        from_attributes = True