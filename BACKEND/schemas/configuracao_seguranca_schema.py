from pydantic import BaseModel
from typing import Optional

class ConfiguracaoSegurancaUpdateSchema(BaseModel):
    autenticacao_duas_etapas: Optional[bool] = None
    alertas_login: Optional[bool] = None
    filtro_mensagens: Optional[bool] = None

class ConfiguracaoSegurancaResponse(BaseModel):
    id: int
    usuario_id: int
    autenticacao_duas_etapas: bool
    alertas_login: bool
    filtro_mensagens: bool

    class Config:
        from_attributes = True