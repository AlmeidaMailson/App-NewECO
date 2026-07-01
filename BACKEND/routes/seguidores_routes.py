from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.depedencies import get_db
from schemas.seguidores_schema import SeguidorCreate
from Service.seguidores_service import (
    create_seguir,
    delete_seguir,
    get_estatisticas_seguidores,
    verificar_segue,
    listar_ids_seguindo
)

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/seguidores", tags=["Seguidores / Conexões"])

@router.get("/stats/{usuario_id}")
def estatisticas_seguidores(
    usuario_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # Mantém exatamente o comportamento anterior
    return get_estatisticas_seguidores(db, usuario_id)

@router.get("/{seguindo_id}/status")
def verificar_status_seguidor(
    seguindo_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual)
):
    return verificar_segue(
        db, 
        seguindo_id=seguindo_id,
        usuario_id=usuario_logado.id
    )

@router.post("/")
def seguir_usuario(
    seguidor: SeguidorCreate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual)
):
    return create_seguir(
        db=db,
        seguidor_id=seguidor.seguidor_id,
        seguindo_id=seguidor.seguindo_id,
        usuario_id=usuario_logado.id
    )
@router.delete("/{seguindo_id}")
def deixar_de_seguir(
    seguindo_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # Passa exatamente os mesmos parâmetros para o seu Service
    return delete_seguir(
        db,
        seguindo_id=seguindo_id,
        usuario_id=usuario_logado.id # Garante que a ação usa o ID validado pelo Token
    )

@router.get("/seguindo")
def listar_seguindo(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual)
):
    return listar_ids_seguindo(
        db,
        usuario_logado.id
    )