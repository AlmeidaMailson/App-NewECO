from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base

from models.user import User      
from models.post import Post            
from models.post_interacoes import CurtidaPost, ComentarioPost, CompartilhamentoPost, PostSalvo
from models.mensagens import Mensagem     
from models.missoes import Missao         
class Notificacao(Base):
    __tablename__ = "notificacoes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    remetente_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=True)
    comentario_id = Column(Integer, ForeignKey("post_comentarios.id", ondelete="CASCADE"), nullable=True)
    mensagem_id = Column(Integer, ForeignKey("mensagens.id", ondelete="CASCADE"), nullable=True)
    missao_id = Column(Integer, ForeignKey("missoes.id", ondelete="SET NULL"), nullable=True)
    titulo = Column(String(150), nullable=True)
    mensagem = Column(Text, nullable=False)
    tipo = Column(String(50), nullable=False)
    lida = Column(Boolean, nullable=False, default=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    # Relacionamento mapeado com a classe Usuario importada acima
    remetente = relationship("models.user.User", foreign_keys=[remetente_id])