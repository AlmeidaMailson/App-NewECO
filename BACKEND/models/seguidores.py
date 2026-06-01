from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import CHAR
from sqlalchemy import TIMESTAMP
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base

class Seguidor(Base):
    __tablename__ = "seguidores"

    id = Column (Integer, primary_key=True, index=True)

    seguidor_id = Column(
        Integer,
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False
    )

    seguindo_id = Column(
        Integer,
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False
    )
    criado_em = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    __table_args__=(
        UniqueConstraint(
            "seguidor_id",
            "seguindo_id",
            name="unique_seguidor_seguindo"
        ),
    )

    seguidor = relationship(
        "User",
        foreign_keys=[seguidor_id]
    )

    seguindo = relationship(
        "User",
        foreign_keys=[seguindo_id]
    )
