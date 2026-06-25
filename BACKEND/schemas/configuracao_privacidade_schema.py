from pydantic import BaseModel
from typing import Optional

class ConfiguracaoPrivacidadeUpdateSchema(BaseModel):
    perfil_privado: Optional[bool] = None
    ocultar_localizacao: Optional[bool] = None
    status_invisivel: Optional[bool] = None

class ConfiguracaoPrivacidadeResponse(BaseModel):
    id: int
    usuario_id: int
    perfil_privado: bool
    ocultar_localizacao: bool
    status_invisivel: bool

    class Config:
        from_attributes = True
        