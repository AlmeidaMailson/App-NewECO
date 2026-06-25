from sqlalchemy.orm import Session
from Repository.repository_mensagens import mensagem_repository
from schemas.mensagens_schema import MensagemCreate
from fastapi import HTTPException, status

class MensagemService:
    
    def enviar_nova_mensagem(self, db: Session, esquema_mensagem: MensagemCreate, remetente_id: int):
        
        if not esquema_mensagem.conversa_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Você precisa dizer em qual conversa quer colocar esse bilhete!"
            )
            
        nova_mensagem = mensagem_repository.criar_mensagem(
            db=db,
            conversa_id=esquema_mensagem.conversa_id,
            remetente_id=remetente_id,
            texto_mensagem=esquema_mensagem.mensagem
        )
        
        return nova_mensagem

    
    def buscar_historico_do_chat(self, db: Session, conversa_id: int):
        
        if not conversa_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="ID da conversa inválido!"
            )
            
        lista_mensagens = mensagem_repository.listar_mensagens_da_conversa(db, conversa_id)
        return lista_mensagens

mensagens_service = MensagemService()