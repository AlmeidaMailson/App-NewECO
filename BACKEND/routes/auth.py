from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.depedencies import get_db
from core.deps import obter_usuario_atual
from core.security import criar_token_acesso, gerar_senha_criptografada, verificar_senha
from models.configuracao_privacidade import ConfiguracaoPrivacidade
from models.configuracao_seguranca import ConfiguracaoSeguranca
from models.user import User as Usuario

router = APIRouter(prefix="/auth", tags=["Autenticacao"])


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()

    if not usuario or not verificar_senha(form_data.password, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )

    token_acesso = criar_token_acesso(dados={"sub": str(usuario.id)})

    return {
        "access_token": token_acesso,
        "token_type": "bearer",
        "usuario_id": usuario.id,
    }


@router.put("/users/update")
def atualizar_usuario_compatibilidade(
    dados: dict,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual),
):
    campos_usuario = {"nome", "email", "telefone", "estado", "cidade", "bio", "avatar_url"}
    campos_privacidade = {"perfil_privado", "ocultar_localizacao", "status_invisivel"}
    campos_seguranca = {
        "dois_fatores",
        "autenticacao_duas_etapas",
        "alertas_login",
        "filtro_mensagens",
    }

    for campo, valor in dados.items():
        if campo in campos_usuario:
            setattr(usuario_logado, campo, valor)

    if campos_privacidade.intersection(dados):
        privacidade = db.query(ConfiguracaoPrivacidade).filter(
            ConfiguracaoPrivacidade.usuario_id == usuario_logado.id
        ).first()
        if not privacidade:
            privacidade = ConfiguracaoPrivacidade(usuario_id=usuario_logado.id)
            db.add(privacidade)

        for campo in campos_privacidade:
            if campo in dados:
                setattr(privacidade, campo, dados[campo])

    if campos_seguranca.intersection(dados):
        seguranca = db.query(ConfiguracaoSeguranca).filter(
            ConfiguracaoSeguranca.usuario_id == usuario_logado.id
        ).first()
        if not seguranca:
            seguranca = ConfiguracaoSeguranca(usuario_id=usuario_logado.id)
            db.add(seguranca)

        if "dois_fatores" in dados:
            seguranca.autenticacao_duas_etapas = dados["dois_fatores"]
        if "autenticacao_duas_etapas" in dados:
            seguranca.autenticacao_duas_etapas = dados["autenticacao_duas_etapas"]

        for campo in ("alertas_login", "filtro_mensagens"):
            if campo in dados:
                setattr(seguranca, campo, dados[campo])

    db.commit()
    db.refresh(usuario_logado)

    resposta = {
        "id": usuario_logado.id,
        "nome": usuario_logado.nome,
        "email": usuario_logado.email,
        "telefone": usuario_logado.telefone,
        "estado": usuario_logado.estado,
        "cidade": usuario_logado.cidade,
        "bio": usuario_logado.bio,
        "avatar_url": usuario_logado.avatar_url,
        "eco_beneficios": usuario_logado.eco_beneficios,
        "ecoBeneficios": usuario_logado.eco_beneficios,
    }
    resposta.update(dados)
    return resposta


@router.post("/verificar-email")
def verificar_email(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado")
    return {"existe": True}


@router.put("/redefinir-senha")
def redefinir_senha(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    nova_senha = payload.get("nova_senha")

    if not email or not nova_senha:
        raise HTTPException(status_code=400, detail="Email e nova senha sao obrigatorios")

    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado")

    usuario.senha = gerar_senha_criptografada(nova_senha)
    db.commit()
    return {"message": "Senha redefinida com sucesso!"}
