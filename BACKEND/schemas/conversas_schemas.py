from pydantic import BaseModel

#Esquema para criação da tela principal de conversas

class ConversaCreate(BaseModel):
    usuario_1_id: int
    usuario_2_id: int

class ConversaResponse(BaseModel):
    id: int 
    usuario_1_id: int
    usuario_2_id: int 
    criado_em: str

    class config:
        from_attributes = True