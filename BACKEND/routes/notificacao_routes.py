from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.notificacao_schemas import NotificacaoCriarSchema, NotificacaoResponse
from Service.notificacao_service import NotificacaoService

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/notificacoes", tags=["Notificações"])

@router.get("/usuario/{usuario_id}", response_model=list[NotificacaoResponse])
def listar_notificacoes(
    usuario_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # Trava de segurança: impede um usuário de ler as notificações do outro
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para visualizar as notificações de outro usuário."
        )

    service = NotificacaoService(db)
    return service.obter_notificacoes_usuario(usuario_id)

@router.post("/", response_model=NotificacaoResponse, status_code=status.HTTP_201_CREATED)
def criar_notificacao(
    dados: NotificacaoCriarSchema, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # O comportamento de criação permanece idêntico
    service = NotificacaoService(db)
    return service.disparar_notificacao(dados)

@router.patch("/{notificacao_id}/ler", response_model=NotificacaoResponse)
def marcar_como_lida(
    notificacao_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # O comportamento de marcar como lida permanece idêntico
    # (Opcional: no seu service você pode validar se a notificacao_id pertence ao usuario_logado.id)
    service = NotificacaoService(db)
    return service.ler_notificacao(notificacao_id)

@router.put("/usuario/{usuario_id}/ler-todas")
def marcar_todas_como_lidas(
    usuario_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # Trava de segurança: impede um usuário de marcar como lida as notificações de outro
    if usuario_logado.id != usuario_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para alterar as notificações de outro usuário."
        )

    service = NotificacaoService(db)
    return service.limpar_notificacoes_pendentes(usuario_id)