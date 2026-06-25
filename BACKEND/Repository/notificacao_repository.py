from sqlalchemy.orm import Session
from models.notificacao import Notificacao
from schemas.notificacao_schemas import NotificacaoCriarSchema

class NotificacaoRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar_por_usuario(self, usuario_id: int) -> list[Notificacao]:
        return self.db.query(Notificacao).filter(
            Notificacao.usuario_id == usuario_id
        ).order_by(Notificacao.criado_em.desc()).all()

    def criar(self, dados: NotificacaoCriarSchema) -> Notificacao:
        nova_notificacao = Notificacao(**dados.model_dump())
        self.db.add(nova_notificacao)
        self.db.commit()
        self.db.refresh(nova_notificacao)
        return nova_notificacao

    def marcar_como_lida(self, notificacao_id: int) -> Notificacao:
        notificacao = self.db.query(Notificacao).filter(Notificacao.id == notificacao_id).first()
        if notificacao:
            notificacao.lida = True
            self.db.commit()
            self.db.refresh(notificacao)
        return notificacao

    def marcar_todas_como_lidas(self, usuario_id: int):
        self.db.query(Notificacao).filter(
            Notificacao.usuario_id == usuario_id, 
            Notificacao.lida == False
        ).update({"lida": True}, synchronize_session=False)
        self.db.commit()