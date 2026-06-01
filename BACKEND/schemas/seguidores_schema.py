from pydantic import BaseModel

#esquema para criação de um post

class SeguidorCreate (BaseModel):
    seguidor_id: int
    seguindo_id: int

class SeguidorResponse(BaseModel):
    id: int
    seguidor_id: int
    seguindo_id: int
    
    
    class config:
        from_attributes = True
