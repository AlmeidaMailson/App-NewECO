from fastapi import HTTPException
from Repository.seguidores_repository import (
    create_seguir_repository,
    delete_seguir_repository,
    get_seguir_repository,
    list_seguidores_repository,
    list_seguindo_repository,
    list_ids_seguindo_repository
)

from Service.notificacao_service import NotificacaoService
from schemas.notificacao_schemas import NotificacaoCriarSchema

from models.seguidores import Seguidor
from models.user import User

def create_seguir(db, seguidor_id, seguindo_id, usuario_id):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario logado nao encontrado no banco"
        )

    if seguidor_id != usuario_id:
        raise HTTPException(
            status_code=403,
            detail="Voce nao pode seguir por outro usuario"
        )

    if seguindo_id == usuario_id:
        raise HTTPException(
            status_code=400,
            detail="Voce nao pode seguir a si mesmo"
        )

    usuario_seguindo = db.query(User).filter(User.id == seguindo_id).first()

    if not usuario_seguindo:
        raise HTTPException(
            status_code=404,
            detail="O usuario seguido nao existe"
        )

    seguir = get_seguir_repository(
        db,
        seguidor_id=seguidor_id,
        seguindo_id=seguindo_id
    )

    if seguir:
        raise HTTPException(
            status_code=409,
            detail="Voce ja segue esse usuario"
        )

    novo_seguir = Seguidor(
        seguidor_id=seguidor_id,
        seguindo_id=seguindo_id
    )

    seguir = create_seguir_repository(db, novo_seguir)

    NotificacaoService(db).disparar_notificacao(
        NotificacaoCriarSchema(
            usuario_id= seguindo_id,
            remetente_id=seguidor_id,
            titulo="Novo Seguidor",
            mensagem=f"{usuario.nome} começou a seguir você.",
            tipo= "SEGUIDOR"
        )
    )

    return seguir


def delete_seguir(db, seguindo_id, usuario_id):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario logado nao encontrado no banco"
        )

    seguir = get_seguir_repository(
        db,
        seguidor_id=usuario_id,
        seguindo_id=seguindo_id
    )

    if not seguir:
        raise HTTPException(
            status_code=404,
            detail="Voce nao segue esse usuario"
        )

    delete_seguir_repository(db, seguir)

    return {
        "message": "Usuario deixou de ser seguido com sucesso"
    }

def verificar_segue(db, seguindo_id, usuario_id):
    seguir = get_seguir_repository(
        db,
        seguidor_id=usuario_id,
        seguindo_id=seguindo_id
    )

    return {
        "following": seguir is not None
    }

def get_estatisticas_seguidores(db, usuario_id):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario nao encontrado"
        )

    seguidores = list_seguidores_repository(db, usuario_id)
    seguindo = list_seguindo_repository(db, usuario_id)

    return {
        "usuario_id": usuario_id,
        "seguidores": len(seguidores),
        "seguindo": len(seguindo)
    }

def listar_ids_seguindo(db, usuario_id):
    seguindo = list_ids_seguindo_repository(db, usuario_id)

    return [
        {
            "seguindo_id": item.seguindo_id
        }
        for item in seguindo
    ]

