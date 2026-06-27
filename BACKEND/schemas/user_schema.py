from pydantic import BaseModel, EmailStr, Field

#  cadastro do usuário para criação de conta

class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str = Field(min_length=11, max_length=11)
    estado: str
    cidade: str
    senha: str

class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str
    estado: str
    cidade: str
    bio: str | None = None
    avatar_url: str | None = None
    eco_beneficios: int

    class Config:
        from_attributes = True

    #  Login do usuário para autenticação
    
class UserLogin(BaseModel):
    email: EmailStr
    senha: str

class UserLoginResponse(BaseModel):
    id: int
    nome: str
    email: str
    class Config:
        from_attributes = True


class VerificarEmailSchema(BaseModel):
    email: EmailStr

class RedefinirSenhaSchema(BaseModel):
    email: EmailStr
    nova_senha: str