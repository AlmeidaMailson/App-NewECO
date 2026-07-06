from sqlalchemy import Column, Integer, Text, DateTime
from datetime import datetime
from app.database import Base # Ou de onde você importa o seu Base do SQLAlchemy

class Mensagem(Base):
    __tablename__ = "mensagens"

    id = Column(Integer, primary_key=True, index=True)
    remetente_id = Column(Integer, nullable=False)
    destinatario_id = Column(Integer, nullable=False)
    conteudo = Column(Text, nullable=False) # Aqui vai salvar o texto criptografado
    criado_em = Column(DateTime, default=datetime.utcnow)