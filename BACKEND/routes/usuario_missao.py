from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.usuario_missao import RegistrarProgressoSchema, UsuarioMissaoResponse
from Service.usuario_missao import UsuarioMissaoService

# Imports corretos e corrigidos do JWT
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/missoes", tags=["Missões do Usuário"])

@router.get("/usuario/{usuario_id}")
def listar_missoes_usuario(
    usuario_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # Trava de segurança: impede que o Usuário A xeretar as missões do Usuário B
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para visualizar as missões de outro usuário."
        )

    service = UsuarioMissaoService(db)
    return service.listar_com_progresso(usuario_id)

@router.post("/progresso", response_model=UsuarioMissaoResponse)
def registrar_progresso(
    dados: RegistrarProgressoSchema, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # Trava de segurança: Garante que o usuário logado só registra progresso para si mesmo
    if usuario_logado.id != dados.usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode registrar progresso para as suas próprias missões."
        )

    service = UsuarioMissaoService(db)
    # Mantém a chamada idêntica ao seu Service original
    return service.registrar_progresso_missao(dados.usuario_id, dados.missao_id)