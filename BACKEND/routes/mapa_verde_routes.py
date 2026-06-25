from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal  
from schemas.mapa_verde_schema import MapaVerdeResponse, MapaVerdeCreate
from Service.mapa_verde_service import mapa_verde_service

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/mapa-verde", tags=["Mapa Verde"])

def obter_banco():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/pontos", response_model=list[MapaVerdeResponse])
def listar_pontos_ecologicos(db: Session = Depends(obter_banco)): 
    return mapa_verde_service.listar_todos_os_pontos(db)

@router.get("/pontos/{ponto_id}", response_model=MapaVerdeResponse)
def buscar_ponto_por_id(ponto_id: int, db: Session = Depends(obter_banco)): 
    ponto = mapa_verde_service.buscar_ponto_por_id(db, ponto_id)
    if not ponto:
        raise HTTPException(status_code=404, detail="Ponto ecológico não encontrado.")
    return ponto

@router.post("/pontos", response_model=MapaVerdeResponse, status_code=status.HTTP_201_CREATED)
def criar_ponto_manual(
    esquema: MapaVerdeCreate, 
    db: Session = Depends(obter_banco),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
): 
    # Se o service precisar registrar quem criou o ponto, você pode injetar o `usuario_logado.id` aqui dentro:
    # return mapa_verde_service.criar_ponto_manual(db, esquema, usuario_id=usuario_logado.id)
    return mapa_verde_service.criar_ponto_manual(db, esquema)