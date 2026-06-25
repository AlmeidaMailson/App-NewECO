from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database import Base

class ConfiguracaoPrivacidade(Base):
    __tablename__ = "configuracoes_privacidade"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False)
    perfil_privado = Column(Boolean, nullable=False, default=False)
    ocultar_localizacao = Column(Boolean, nullable=False, default=True)
    status_invisivel = Column(Boolean, nullable=False, default=False)