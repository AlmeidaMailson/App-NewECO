from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.depedencies import get_db
from schemas.eco_beneficio_historico import ExtratoPontosResponse
from Service.eco_beneficio_historico import EcoBeneficioHistoricoService

from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(
    prefix="/carteira",
    tags=["Carteira EcoPontos"]
)


@router.get("/extrato", response_model=ExtratoPontosResponse)
def obter_extrato(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual)
):

    service = EcoBeneficioHistoricoService(db)

    return service.calcular_saldo_e_extrato(usuario_logado.id)