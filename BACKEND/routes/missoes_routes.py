from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal  # Import oficial que usámos
from Service.missoes_automacao_service import missoes_automacao_service

router = APIRouter(prefix="/missoes", tags=["Missões"])

# Função auxiliar para gerir a sessão do banco
def obter_banco():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/gerar-automatica")
def disparar_gerador_de_missoes(db: Session = Depends(obter_banco)):
    """
    Rota que funciona como o 'gatilho' do robô. 
    Quando chamada, escolhe um dos 70 pontos de Brasília e cria uma missão nova.
    """
    return missoes_automacao_service.rodar_gerador_automatico(db)