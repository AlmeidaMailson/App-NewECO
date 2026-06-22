from sqlalchemy import select 
from sqlalchemy.orm import Session
from models.mensagens import Mensagem

class MensagemRepository:
    
    # 🌟 CORRIGIDO: 'self' com 's' minúsculo
    def criar_mensagem(self, db: Session, conversa_id: int, remetente_id: int, texto_mensagem: str):
        nova_mensagem = Mensagem (
            conversa_id = conversa_id,
            remetente_id = remetente_id,
            mensagem = texto_mensagem
        )
        db.add(nova_mensagem)
        db.commit()
        db.refresh(nova_mensagem)
        return nova_mensagem
    
    # 🌟 CORRIGIDO: Adicionado o 'self,' antes do db
    def listar_mensagens_da_conversa(self, db: Session, conversa_id: int):
        stmt = (
            select(Mensagem)
            .filter(Mensagem.conversa_id == conversa_id)
            .order_by(Mensagem.criado_em.asc())
        )
        resultado = db.execute(stmt)
        return resultado.scalars().all()
    
# 🌟 CORRIGIDO: Linha limpa criando o robô com parênteses no final ()
mensagem_repository = MensagemRepository()