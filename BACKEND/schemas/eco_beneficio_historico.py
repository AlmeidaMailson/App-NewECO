from pydantic import BaseModel
from datetime import datetime


class HistoricoItemResponse(BaseModel):
    id: int
    descricao: str
    pontos: int
    criado_em: datetime

    class Config:
        from_attributes = True


class ExtratoPontosResponse(BaseModel):
    saldo_total: int
    historico: list[HistoricoItemResponse]

    class Config:
        from_attributes = True