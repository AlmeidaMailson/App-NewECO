from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.depedencies import get_db
from schemas.seguidores_schema import SeguidorCreate
from Service.seguidores_service import create_seguir, delete_seguir, verificar_segue

router = APIRouter(prefix="/seguidores")

@router.get("/{seguindo_id}/status")
def verificar_status_seguidor(
    seguindo_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return verificar_segue(
        db,
        seguindo_id=seguindo_id,
        usuario_id=usuario_id
    )

@router.post("/")
def seguir_usuario(
    seguidor: SeguidorCreate,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return create_seguir(
        db,
        seguidor_id=seguidor.seguidor_id,
        seguindo_id=seguidor.seguindo_id,
        usuario_id=usuario_id
    )

@router.delete("/{seguindo_id}")
def deixar_de_seguir(
    seguindo_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return delete_seguir(
        db,
        seguindo_id=seguindo_id,
        usuario_id=usuario_id
    )
