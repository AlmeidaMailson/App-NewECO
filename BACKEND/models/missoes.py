from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Missao(Base):
    __tablename__="missoes"

    id = Column( Integer, primary_key=True, index= True)
    
    titulo = Column(String(150), nullable=False)

    descricao = Column( Text)

    recompensa = Column(Integer, nullable=False, default=0)

    total_acoes = Column( Integer, nullable=False, default=1)

    local = Column(String(150))

    ativo = Column(Boolean, nullable=False, default=True)

    tema = Column(String(100), default="Geral", nullable=False)

    mapa_verde_ponto_id = Column(Integer, ForeignKey("mapa_verde_pontos.id"), nullable=True)

    ponto_coleta = relationship("MapaVerdePonto")