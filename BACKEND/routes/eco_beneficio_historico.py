from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.eco_beneficio_historico import ExtratoPontosResponse
from Service.eco_beneficio_historico import EcoBeneficioHistoricoService

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/carteira", tags=["Carteira EcoPontos"])

@router.get("/extrato/{usuario_id}", response_model=ExtratoPontosResponse)
def obter_extrato(
    usuario_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # 🔐 Trava de segurança: impede que o Usuário A veja o extrato do Usuário B
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para visualizar o extrato de outro usuário."
        )

    service = EcoBeneficioHistoricoService(db)
    return service.calcular_saldo_e_extrato(usuario_id)