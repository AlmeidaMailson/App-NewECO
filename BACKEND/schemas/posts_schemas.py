from pydantic import BaseModel

# Esquema Para crição de um post

class PostCreate (BaseModel):
    titulo: str
    legenda: str
    midia_url: str
    tipo_midia: str

class PostResponse(BaseModel):
    id: int
    usuario_id: int
    titulo: str
    legenda: str
    midia_url: str
    tipo_midia: str

    class Config: 
        from_attributes = True

class ComentarioCreate(BaseModel):
    texto: str

class ComentarioResponse(BaseModel):
    id: int
    post_id: int
    usuario_id: int
    texto: str
    usuario_nome: str | None = None

class UsuarioPostResponse(BaseModel):
    id: int
    nome: str
    email: str
    bio: str | None = None
    avatar_url: str | None = None
    cidade: str | None = None
    estado: str | None = None

class FeedPostResponse(BaseModel):
    id: int
    usuario_id: int
    titulo: str | None = None
    legenda: str | None = None
    midia_url: str | None = None
    tipo_midia: str
    usuario: UsuarioPostResponse
    curtidas_count: int
    comentarios_count: int
    compartilhamentos_count: int
    curtido: bool
    salvo: bool
    seguindo_autor: bool
    comentarios: list[ComentarioResponse]
