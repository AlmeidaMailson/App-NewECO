from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.depedencies import get_db
from schemas.notificacao_schemas import NotificacaoCriarSchema, NotificacaoResponse
from Service.notificacao_service import NotificacaoService

router = APIRouter(prefix="/notificacoes", tags=["Notificações"])

@router.get("/usuario/{usuario_id}", response_model=list[NotificacaoResponse])
def listar_notificacoes(usuario_id: int, db: Session = Depends(get_db)):
    service = NotificacaoService(db)
    return service.obter_notificacoes_usuario(usuario_id)

@router.post("/", response_model=NotificacaoResponse, status_code=status.HTTP_201_CREATED)
def criar_notificacao(dados: NotificacaoCriarSchema, db: Session = Depends(get_db)):
    service = NotificacaoService(db)
    return service.disparar_notificacao(dados)

@router.patch("/{notificacao_id}/ler", response_model=NotificacaoResponse)
def marcar_como_lida(notificacao_id: int, db: Session = Depends(get_db)):
    service = NotificacaoService(db)
    return service.ler_notificacao(notificacao_id)

@router.put("/usuario/{usuario_id}/ler-todas")
def marcar_todas_como_lidas(usuario_id: int, db: Session = Depends(get_db)):
    service = NotificacaoService(db)
    return service.limpar_notificacoes_pendentes(usuario_id)