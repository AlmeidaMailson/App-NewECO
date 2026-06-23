from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# 🟢 Mudamos aqui para importar direto a SessionLocal do seu database
from app.database import SessionLocal  
from schemas.mapa_verde_schema import MapaVerdeResponse, MapaVerdeCreate
from Service.mapa_verde_service import mapa_verde_service

router = APIRouter(prefix="/mapa-verde", tags=["Mapa Verde"])

# 🟢 Função auxiliar para abrir e fechar o banco de forma limpa nas rotas
def obter_banco():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/pontos", response_model=list[MapaVerdeResponse])
def listar_pontos_ecologicos(db: Session = Depends(obter_banco)): # 👈 Trocado para obter_banco
    return mapa_verde_service.listar_todos_os_pontos(db)

@router.get("/pontos/{ponto_id}", response_model=MapaVerdeResponse)
def buscar_ponto_por_id(ponto_id: int, db: Session = Depends(obter_banco)): # 👈 Trocado para obter_banco
    ponto = mapa_verde_service.buscar_ponto_por_id(db, ponto_id)
    if not ponto:
        raise HTTPException(status_code=404, detail="Ponto ecológico não encontrado.")
    return ponto

@router.post("/pontos", response_model=MapaVerdeResponse, status_code=201)
def criar_ponto_manual(esquema: MapaVerdeCreate, db: Session = Depends(obter_banco)): # 👈 Trocado para obter_banco
    return mapa_verde_service.criar_ponto_manual(db, esquema)