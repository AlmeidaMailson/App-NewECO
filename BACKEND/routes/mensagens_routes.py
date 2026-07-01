from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.depedencies import get_db 
from schemas.mensagens_schema import MensagemCreate, MensagemResponse
from Service.mensagens_service import mensagens_service
from typing import List

# Imports corretos e padronizados
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/mensagens", tags=["Mensagens"])

@router.post("/", response_model=MensagemResponse, status_code=status.HTTP_201_CREATED)
def enviar_mensagem(
    esquema_mensagem: MensagemCreate, 
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # SEGURANÇA MÁXIMA: O remetente SEMPRE será o usuário do Token, ignorando fraudes no JSON
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
    # PROTEÇÃO EXTRAS CONTRA INVASÃO DE PRIVACIDADE:
    # Chama o service para verificar se o usuário atual pertence a essa conversa antes de carregar as mensagens.
    # Se ele não fizer parte, o próprio service ou esta validação deve barrar a requisição.
    
    historico = mensagens_service.buscar_historico_do_chat(
        db=db, 
        conversa_id=conversa_id,
        usuario_id=usuario_logado.id  # Repassando o id do usuário para validação no service
    )
    
    if historico is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para visualizar as mensagens deste chat."
        )
        
    return historico

@router.patch("/{conversa_id}/visualizar")
def visualizar_conversa(
    conversa_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual)
):

    mensagens_service.visualizar_conversa(
        db,
        conversa_id,
        usuario_logado.id
    )

    return {
        "mensagem": "Mensagens marcadas como lidas."
    }