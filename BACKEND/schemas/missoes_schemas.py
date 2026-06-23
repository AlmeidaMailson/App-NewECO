from pydantic import BaseModel

class MissoesCreate (BaseModel):
    titulo: str
    descricao: str
    recompensa: int
    total_acoes: int
    local: int
    ativo: bool
    tema:str
    mapa_verde_ponto_id: int


class MissoesResponse(BaseModel):
    id:int
    descricao: str | None=None
    recompensa: int
    total_acoes: int
    local: int | None = None
    ativo: bool
    tema:str
    mapa_verde_ponto_id: int

    class Config: 
        from_attributes = True
