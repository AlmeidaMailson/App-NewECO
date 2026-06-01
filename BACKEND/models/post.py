from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    titulo = Column(String(150), nullable=True)

    legenda = Column(Text, nullable=True)

    midia_url = Column(Text, nullable=True)

    tipo_midia = Column(String(20), nullable=False)

    criado_em = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    # RELACIONAMENTOS

    usuario = relationship("User", back_populates="posts")

    curtidas = relationship(
        "CurtidaPost",
        back_populates="post",
        cascade="all, delete"
    )

    comentarios = relationship(
        "ComentarioPost",
        back_populates="post",
        cascade="all, delete"
    )

    salvos = relationship(
        "PostSalvo",
        back_populates="post",
        cascade="all, delete"
    )

    compartilhamentos = relationship(
        "CompartilhamentoPost",
        back_populates="post",
        cascade="all, delete"
    )
