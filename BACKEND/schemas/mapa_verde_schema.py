from pydantic import BaseModel
from typing import Optional

# O que a API precisa receber quando alguém for cadastrar um ponto manualmente
class MapaVerdeCreate(BaseModel):
    nome: str
    tipo: str
    descricao: Optional[str] = None
    latitude: float
    longitude: float
    recompensa: int = 0

# O que a API vai devolver (Resposta para o celular do usuário)
class MapaVerdeResponse(BaseModel):
    id: int
    nome: str
    tipo: str
    descricao: Optional[str] = None
    latitude: float
    longitude: float
    recompensa: int
    ativo: bool

    class Config:
        from_attributes = True  # Permite que o Pydantic leia o objeto do SQLAlchemy