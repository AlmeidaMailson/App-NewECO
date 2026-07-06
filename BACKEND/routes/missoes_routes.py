from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal 
from Service.missoes_automacao_service import missoes_automacao_service

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/missoes", tags=["Missões"])

# Função auxiliar para gerir a sessão do banco
def obter_banco():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/gerar-automatica")
def disparar_gerador_de_missoes(
    db: Session = Depends(obter_banco),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    """
    Rota que funciona como o 'gatilho' do robô. 
    Quando chamada, escolhe um dos 70 pontos de Brasília e cria uma missão nova.
    """
    # Mantém exatamente a mesma execução de antes, as funcionalidades não mudam!
    return missoes_automacao_service.rodar_gerador_automatico(db)