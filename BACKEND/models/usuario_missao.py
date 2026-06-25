from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base  # Conforme seu main.py, database está na raiz de app/

class UsuarioMissao(Base):
    __tablename__ = "usuarios_missoes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    missao_id = Column(Integer, ForeignKey("missoes.id", ondelete="CASCADE"), nullable=False)
    progresso = Column(Integer, nullable=False, default=0)
    concluida = Column(Boolean, nullable=False, default=False)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Restrição única para evitar duplicidade de registros
    __table_args__ = (UniqueConstraint('usuario_id', 'missao_id', name='_usuario_missao_uc'),)

    missao = relationship("Missao")