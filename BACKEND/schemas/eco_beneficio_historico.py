from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EcoBeneficioResponse(BaseModel):
    id: int
    usuario_id: int
    missao_id: Optional[int]
    post_id: Optional[int]
    descricao: str
    pontos: int
    tipo: str
    criado_em: datetime

    class Config:
        from_attributes = True

class ExtratoPontosResponse(BaseModel):
    saldo_total: int
    historico: list[EcoBeneficioResponse]
    