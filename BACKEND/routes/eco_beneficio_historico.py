from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.eco_beneficio_historico import ExtratoPontosResponse
from Service.eco_beneficio_historico import EcoBeneficioHistoricoService

router = APIRouter(prefix="/carteira", tags=["Carteira EcoPontos"])

@router.get("/extrato/{usuario_id}", response_model=ExtratoPontosResponse)
def obter_extrato(usuario_id: int, db: Session = Depends(get_db)):
    service = EcoBeneficioHistoricoService(db)
    return service.calcular_saldo_e_extrato(usuario_id)