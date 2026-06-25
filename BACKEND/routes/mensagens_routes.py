from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.depedencies import get_db 
from schemas.mensagens_schema import MensagemCreate, MensagemResponse
from Service.mensagens_service import mensagens_service
from typing import List

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/mensagens", tags=["Mensagens"])

@router.post("/", response_model=MensagemResponse, status_code=status.HTTP_201_CREATED)
def enviar_mensagem(
    esquema_mensagem: MensagemCreate, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # 🔥 SEGURANÇA MÁXIMA: O remetente SEMPRE será o usuário do Token, ignorando fraudes no JSON
    usuario_logado_id = usuario_logado.id 

    nova_mensagem = mensagens_service.enviar_nova_mensagem(
        db=db, 
        esquema_mensagem=esquema_mensagem, 
        remetente_id=usuario_logado_id
    )
    return nova_mensagem


@router.get("/{conversa_id}", response_model=List[MensagemResponse])
def listar_mensagens(
    conversa_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # Opcional, mas altamente recomendado: no seu service, valide se o `usuario_logado.id` 
    # realmente faz parte dos participantes dessa `conversa_id` para evitar que estranhos leiam o chat.
    
    historico = mensagens_service.buscar_historico_do_chat(db=db, conversa_id=conversa_id)
    return historico