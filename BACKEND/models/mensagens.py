from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Mensagem(Base):
    __tablename__ = "mensagens"

    id = Column(Integer, primary_key=True, index=True)

    conversa_id = Column(Integer, ForeignKey("conversas.id", ondelete="CASCADE"), nullable=False)

    remetente_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False) 
    
    mensagem = Column(String, nullable=False)
    
    lida = Column(Boolean, nullable=False, default=False)
    
    criado_em = Column(DateTime(timezone=True), server_default=func.now())


  