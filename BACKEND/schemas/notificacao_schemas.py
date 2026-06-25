from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificacaoCriarSchema(BaseModel):
    usuario_id: int
    remetente_id: Optional[int] = None
    post_id: Optional[int] = None
    comentario_id: Optional[int] = None
    mensagem_id: Optional[int] = None
    missao_id: Optional[int] = None
    titulo: Optional[str] = None
    mensagem: str
    tipo: str

class NotificacaoResponse(BaseModel):
    id: int
    usuario_id: int
    remetente_id: Optional[int]
    post_id: Optional[int]
    comentario_id: Optional[int]
    mensagem_id: Optional[int]
    missao_id: Optional[int]
    titulo: Optional[str]
    mensagem: str
    tipo: str
    lida: bool
    criado_em: datetime

    class Config:
        from_attributes = True