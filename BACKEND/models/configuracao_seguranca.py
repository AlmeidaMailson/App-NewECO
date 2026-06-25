from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database import Base

class ConfiguracaoSeguranca(Base):
    __tablename__ = "configuracoes_seguranca"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False)
    autenticacao_duas_etapas = Column(Boolean, nullable=False, default=False)
    alertas_login = Column(Boolean, nullable=False, default=True)
    filtro_mensagens = Column(Boolean, nullable=False, default=True)