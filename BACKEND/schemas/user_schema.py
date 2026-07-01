from pydantic import BaseModel, EmailStr, Field
from typing import Optional

#  cadastro do usuário para criação de conta

class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str = Field(min_length=11, max_length=11)
    estado: str
    cidade: str
    senha: str
    avatar_url: str | None = None

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


class UserUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    estado: Optional[str] = None
    cidade: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    perfil_privado: Optional[bool] = None
    ocultar_localizacao: Optional[bool] = None
    status_invisivel: Optional[bool] = None
    dois_fatores: Optional[bool] = None  # Adicionado
    alertas_login: Optional[bool] = None  # dicionado
    filtro_mensagens: Optional[bool] = None  # Adicionado