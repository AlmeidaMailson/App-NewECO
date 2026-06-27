from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

from app.depedencies import get_db

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserResponse,
    VerificarEmailSchema,
    RedefinirSenhaSchema
)

from Service.user_service import (
    create_user,
    login_user
)

# Imports corretos e do JWT para amarrar o login
from models.user import User as Usuario
from core.deps import obter_usuario_atual
from core.security import criar_token_acesso

router = APIRouter(prefix="/users", tags=["Usuários / Autenticação"])


@router.get("/users", response_model=list[UserResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Protegido por Token!
):
    users = db.query(Usuario).all()
    return users


@router.post("/users")
def criar_usuario(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Continua pública para permitir novos cadastros
    return create_user(db, user)


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    usuario = login_user(
        db,
        email=user.email,
        senha=user.senha
    )

    if not usuario:
        raise HTTPException(
            status_code=400,
            detail="Email ou senha inválidos"
        )

    # GERANDO O TOKEN REAL: Passamos o ID do usuário como o 'sub' do JWT
    token_acesso = criar_token_acesso(dados={"sub": str(usuario.id)})

    # Retorna as mesmas informações de antes, incluindo o token necessário para o Front-end
    return {
        "message": "Login realizado com sucesso",
        "access_token": token_acesso,
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    }


# Rota acessada pelo React Native para validar o e-mail
@router.post("/verificar-email")
def verificar_email(payload: VerificarEmailSchema, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"existe": True}


# Rota acessada pelo React Native para persistir a nova senha criptografada
@router.put("/redefinir-senha")
def redefinir_senha(payload: RedefinirSenhaSchema, db: Session = Depends(get_db)):
    # 1. Verifica se o usuário de fato existe no banco
    usuario = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
    try:
        # 2. 🟢 CORREÇÃO: Faz o hash correto da 'nova_senha' contida no payload recebido
        senha_criptografada = pwd_context.hash(payload.nova_senha)

        # 3. Aplica a senha hasheada no modelo do banco de dados
        usuario.senha = senha_criptografada 

        db.commit()
        return {"message": "Senha redefinida com sucesso!"}
        
    except Exception as e:
        db.rollback()
        print(f"Erro interno de redefinição: {str(e)}") # Log detalhado no seu terminal do backend
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Erro ao atualizar a senha no banco de dados."
        )