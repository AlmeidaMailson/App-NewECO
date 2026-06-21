from sqlalchemy import CheckConstraint,Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class conversa(Base):
    __tablename__ = "conversas"

    id = Column(Integer, primary_key=True , index=True)

    usuario_1_id = Column(
        Integer,
        ForeignKey("usaurios.id", ondelete="CASCADE"),
        nullable = False
    )
    usuario_2_id = Column(
        Integer,
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable = False
    )
    criado_em = Column(
        TIMESTAMP,
        server_default=func.now()
    )
    
    __table_args__ = (
        CheckConstraint("usuario_1_id != usuario_2_id", name="check_usuarios_diferentes"),
    )
