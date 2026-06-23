# 🟢 Trocamos 'Decimal' por 'Numeric' no import da sqlalchemy
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean
from app.database import Base  # Ajuste o import se o seu Base vier de outro lugar

class MapaVerdePonto(Base):
    __tablename__ = "mapa_verde_pontos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    tipo = Column(String(80), nullable=False)
    descricao = Column(Text)
    
    latitude = Column(Numeric(10, 7), nullable=False)
    longitude = Column(Numeric(10, 7), nullable=False)
    
    recompensa = Column(Integer, default=0, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)