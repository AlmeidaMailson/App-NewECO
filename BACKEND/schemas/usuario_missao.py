from pydantic import BaseModel
from datetime import datetime

class RegistrarProgressoSchema(BaseModel):
    usuario_id: int
    missao_id: int

class UsuarioMissaoResponse(BaseModel):
    id: int
    usuario_id: int
    missao_id: int
    progresso: int
    concluida: bool
    atualizado_em: datetime

    class Config:
        from_attributes = True