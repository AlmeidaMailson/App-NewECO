from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import CHAR
from sqlalchemy import TIMESTAMP

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):

    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(
        String(120),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    senha = Column(
        Text,
        nullable=False
    )

    telefone = Column(
        CHAR(11)
    )

    estado = Column(
        String(2)
    )

    cidade = Column(
        String(100)
    )

    bio = Column(Text)

    avatar_url = Column(Text)

    eco_beneficios = Column(
        Integer,
        default=0,
        nullable=False
    )

    criado_em = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    # RELACIONAMENTO

    posts = relationship(
        "Post",
        back_populates="usuario"
    )