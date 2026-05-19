from fastapi import APIRouter, Depends, HTTPException
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

from models.user import User

router = APIRouter(prefix="/users")


@router.get("/", response_model=list[UserResponse])
def listar_usuarios(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users


@router.post("/")
def criar_usuario(
    user: UserCreate,
    db: Session = Depends(get_db)
):

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

    return {
        "message": "Login realizado com sucesso",
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    }