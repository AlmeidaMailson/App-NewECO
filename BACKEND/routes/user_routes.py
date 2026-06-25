from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.depedencies import get_db

from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserResponse
)

from Service.user_service import (
    create_user,
    login_user
)

#  Imports corretos e do JWT para amarrar o login
from models.user import User as Usuario
from core.deps import obter_usuario_atual
from core.security import criar_token_acesso

router = APIRouter(prefix="/users", tags=["Usuários / Autenticação"])


@router.get("/", response_model=list[UserResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Protegido por Token!
):
    users = db.query(Usuario).all()
    return users


@router.post("/")
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

    #  GERANDO O TOKEN REAL: Passamos o ID do usuário como o 'sub' do JWT
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