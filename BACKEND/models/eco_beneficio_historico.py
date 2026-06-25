from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class EcoBeneficioHistorico(Base):
    __tablename__ = "eco_beneficios_historico"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    missao_id = Column(Integer, ForeignKey("missoes.id", ondelete="SET NULL"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="SET NULL"), nullable=True)
    descricao = Column(String(200), nullable=False)
    pontos = Column(Integer, nullable=False)
    tipo = Column(String(30), nullable=False)  # "CREDITO" ou "DEBITO"
    criado_em = Column(DateTime, default=datetime.utcnow)