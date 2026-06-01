from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class CurtidaPost(Base):
    __tablename__ = "post_curtidas"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("post_id", "usuario_id", name="unique_post_curtida_usuario"),
    )

    post = relationship("Post", back_populates="curtidas")
    usuario = relationship("User")

class ComentarioPost(Base):
    __tablename__ = "post_comentarios"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    texto = Column(Text, nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    post = relationship("Post", back_populates="comentarios")
    usuario = relationship("User")

class PostSalvo(Base):
    __tablename__ = "post_salvos"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("post_id", "usuario_id", name="unique_post_salvo_usuario"),
    )

    post = relationship("Post", back_populates="salvos")
    usuario = relationship("User")

class CompartilhamentoPost(Base):
    __tablename__ = "post_compartilhamentos"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())

    post = relationship("Post", back_populates="compartilhamentos")
    usuario = relationship("User")
