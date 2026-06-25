from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.configuracao_privacidade_schema import ConfiguracaoPrivacidadeResponse, ConfiguracaoPrivacidadeUpdateSchema
from Service.configuracao_privacidade_service import ConfiguracaoPrivacidadeService

# Importe a dependência do token e o modelo de Usuário
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/configuracoes/privacidade", tags=["Configurações de Privacidade"])

@router.get("/{usuario_id}", response_model=ConfiguracaoPrivacidadeResponse)
def obter_privacidade(
    usuario_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # Opcional: Validação de segurança para um usuário não xeretar a privacidade do outro
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para visualizar as configurações de outro usuário."
        )

    service = ConfiguracaoPrivacidadeService(db)
    return service.buscar_configuracoes(usuario_id)

@router.patch("/{usuario_id}", response_model=ConfiguracaoPrivacidadeResponse)
def atualizar_privacidade(
    usuario_id: int, 
    dados: ConfiguracaoPrivacidadeUpdateSchema, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # REGRA DE OURO DE SEGURANÇA: Garante que o ID do token é o mesmo da URL
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode alterar as suas próprias configurações de privacidade."
        )

    service = ConfiguracaoPrivacidadeService(db)
    return service.atualizar_configuracoes(usuario_id, dados)