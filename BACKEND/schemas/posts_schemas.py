from pydantic import BaseModel

# Esquema Para crição de um post

class PostCreate (BaseModel):
    titulo: str
    legenda: str
    midia: str
    tipo_midia: str

class PostResponse(BaseModel):
    id: int
    usuario_id: int
    titulo: str
    legenda: str
    midia: str
    tipo_midia: str

class Config: 
    from_attributes = True
