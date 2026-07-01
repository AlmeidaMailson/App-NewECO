from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.depedencies import get_db
from core.deps import obter_usuario_atual
from core.security import criar_token_acesso
from models.user import User as Usuario
from schemas.user_schema import (
    RedefinirSenhaSchema,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    VerificarEmailSchema,
)
from Service.eco_beneficio_historico import EcoBeneficioHistoricoService
from Service.user_service import create_user, login_user

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

router = APIRouter(prefix="/users", tags=["Usuarios / Autenticacao"])


def montar_usuario_response(usuario: Usuario):
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "telefone": usuario.telefone,
        "estado": usuario.estado,
        "cidade": usuario.cidade,
        "bio": usuario.bio,
        "avatar_url": usuario.avatar_url,
        "eco_beneficios": usuario.eco_beneficios,
        "ecoBeneficios": usuario.eco_beneficios,
    }


@router.get("/me")
def obter_meu_perfil(
    usuario_logado: Usuario = Depends(obter_usuario_atual),
):
    return montar_usuario_response(usuario_logado)


@router.put("/me")
def atualizar_meu_perfil(
    dados: UserUpdate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual),
):
    update_data = dados.model_dump(exclude_unset=True)

    for campo in ("nome", "email", "telefone", "estado", "cidade", "bio", "avatar_url"):
        if campo in update_data:
            setattr(usuario_logado, campo, update_data[campo])

    db.commit()
    db.refresh(usuario_logado)
    return montar_usuario_response(usuario_logado)


@router.get("/me/extrato-pontos")
def obter_meu_extrato_pontos(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual),
):
    service = EcoBeneficioHistoricoService(db)
    return service.calcular_saldo_e_extrato(usuario_logado.id)


@router.get("", response_model=list[UserResponse])
@router.get("/", response_model=list[UserResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual),
):
    return db.query(Usuario).all()


@router.post("")
@router.post("/")
def criar_usuario(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return create_user(db, user)


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    usuario = login_user(
        db,
        email=user.email,
        senha=user.senha,
    )

    if not usuario:
        raise HTTPException(
            status_code=400,
            detail="Email ou senha invalidos",
        )

    token_acesso = criar_token_acesso(dados={"sub": str(usuario.id)})

    return {
        "message": "Login realizado com sucesso",
        "access_token": token_acesso,
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
        },
    }


@router.post("/verificar-email")
def verificar_email(payload: VerificarEmailSchema, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado")
    return {"existe": True}


@router.put("/redefinir-senha")
def redefinir_senha(payload: RedefinirSenhaSchema, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado")

    try:
        usuario.senha = pwd_context.hash(payload.nova_senha)
        db.commit()
        return {"message": "Senha redefinida com sucesso!"}
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar a senha no banco de dados.",
        ) from exc


    