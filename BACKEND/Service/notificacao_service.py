from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from Repository.notificacao_repository import NotificacaoRepository
from schemas.notificacao_schemas import NotificacaoCriarSchema

class NotificacaoService:
    def __init__(self, db: Session):
        self.repo = NotificacaoRepository(db)

    def obter_notificacoes_usuario(self, usuario_id: int):
        return self.repo.listar_por_usuario(usuario_id)

    def disparar_notificacao(self, dados: NotificacaoCriarSchema):
        # Aqui entraria um disparo de Push Notification real (Firebase) se quisesse
        return self.repo.criar(dados)

    def ler_notificacao(self, notificacao_id: int):
        notificacao = self.repo.marcar_como_lida(notificacao_id)
        if not notificacao:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notificação não encontrada."
            )
        return notificacao

    def limpar_notificacoes_pendentes(self, usuario_id: int):
        self.repo.marcar_todas_como_lidas(usuario_id)
        return {"message": "Todas as notificações foram marcadas como lidas."}