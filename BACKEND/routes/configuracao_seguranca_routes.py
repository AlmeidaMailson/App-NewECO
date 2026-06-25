from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.configuracao_seguranca_schema import ConfiguracaoSegurancaResponse, ConfiguracaoSegurancaUpdateSchema
from Service.configuracao_seguranca_service import ConfiguracaoSegurancaService

# Importa a dependência do token JWT e o modelo de Usuário
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/configuracoes/seguranca", tags=["Configurações de Segurança"])

@router.get("/{usuario_id}", response_model=ConfiguracaoSegurancaResponse)
def obter_seguranca(
    usuario_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida
):
    # Trava de segurança: impede xeretar as configurações de outros
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para visualizar as configurações de segurança de outro usuário."
        )

    service = ConfiguracaoSegurancaService(db)
    return service.buscar_configuracoes(usuario_id)

@router.patch("/{usuario_id}", response_model=ConfiguracaoSegurancaResponse)
def atualizar_seguranca(
    usuario_id: int, 
    dados: ConfiguracaoSegurancaUpdateSchema, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida
):
    # Trava de segurança: impede alterar os dados de outra conta
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode alterar as suas próprias configurações de segurança."
        )

    service = ConfiguracaoSegurancaService(db)
    return service.atualizar_configuracoes(usuario_id, dados)