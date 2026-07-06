from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from sqlalchemy import or_
from datetime import datetime
from app.depedencies import get_db
from core.security import obtener_usuario_por_token
from models.mensagens import Mensagem as MensagemModel
from models.user import User as Usuario
from cryptography.fernet import Fernet

router = APIRouter(prefix="/chat", tags=["Chat"])

# 🔑 CHAVE DE CRIPTOGRAFIA: Em produção, coloque isso no seu arquivo .env
# Chave gerada via Fernet.generate_key(). Mantenha esta fixa para conseguir descriptografar depois!
CHAVE_SECRETA = b'7_X1Z47jW89_pLzR6mNqK3v_TxB9uY1cDhF2gH3jK4l='
fernet = Fernet(CHAVE_SECRETA)

class MensagemCreate(BaseModel):
    destinatario_id: int
    conteudo: str

def obter_id_usuario_por_header(authorization: str, db: Session) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token não fornecido")
    token = authorization.split(" ")[1]
    usuario = obtener_usuario_por_token(token, db)
    if not usuario:
        raise HTTPException(status_code=401, detail="Token inválido")
    return usuario.id

# Enviar Mensagem (Criptografa e Salva no Banco)
@router.post("/enviar")
async def enviar_mensagem(
    dados: MensagemCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    remetente_id = obter_id_usuario_por_header(authorization, db)
    
    # 🔐 CRIPTOGRAFIA: Transforma o texto limpo em bytes embaralhados e converte em string
    texto_puro_bytes = dados.conteudo.encode('utf-8')
    texto_criptografado = fernet.encrypt(texto_puro_bytes).decode('utf-8')

    # Salva no banco PostgreSQL
    nova_msg = MensagemModel(
        remetente_id=remetente_id,
        destinatario_id=dados.destinatario_id,
        conteudo=texto_criptografado
    )
    db.add(nova_msg)
    db.commit()
    db.refresh(nova_msg)
    
    return {"status": "Mensagem enviada com segurança"}

#  Buscar Histórico (Busca, Descriptografa e Entrega para a Tela)
@router.get("/historico/{contato_id}")
async def obter_historico(
    contato_id: int,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    meu_id = obter_id_usuario_por_header(authorization, db)
    
    # Busca todas as mensagens trocadas entre você e esse contato específico
    # Mude a linha do filter no seu GET /historico para terminar com .desc():
    historico_banco = db.query(MensagemModel).filter(
        ((MensagemModel.remetente_id == meu_id) & (MensagemModel.destinatario_id == contato_id)) |
        ((MensagemModel.remetente_id == contato_id) & (MensagemModel.destinatario_id == meu_id))
        ).order_by(MensagemModel.criado_em.desc()).all() # 🌟 Mudou para desc() aqui
    
    lista_descriptografada = []
    
    for msg in historico_banco:
        try:
            # 🔓 DESCRIPTOGRAFIA: Abre o texto embaralhado de volta para o texto original
            texto_decodificado = fernet.decrypt(msg.conteudo.encode('utf-8')).decode('utf-8')
        except Exception:
            texto_decodificado = "[Erro ao descriptografar mensagem]"

        lista_descriptografada.append({
            "id": str(msg.id),
            "remetente_id": msg.remetente_id,
            "destinatario_id": msg.destinatario_id,
            "conteudo": texto_decodificado,
            "horario": msg.criado_em.strftime("%Y-%m-%d %H:%M:%S") if msg.criado_em else "--:--"
        })
        
    return lista_descriptografada

@router.get("/conversas")
async def listar_conversas_disponiveis(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    # 1. Identifica com segurança quem é você através do Token JWT do cabeçalho
    meu_id = obter_id_usuario_por_header(authorization, db)
    
    # 2. Busca no banco de dados todos os usuários cadastrados, EXCETO você mesmo
    # (Assim traz a lista de pessoas disponíveis para conversar)
    todos_usuarios = db.query(Usuario).filter(Usuario.id != meu_id).all()
    
    # 3. Formata a resposta exatamente do jeito que a sua tela antiga espera ler
    lista_formatada = []
    for u in todos_usuarios:
        lista_formatada.append({
            "contato_id": u.id,
            "contato_nome": u.nome, # Verifique se o campo no seu banco se chama 'nome'
            "ultima_mensagem": "Clique para abrir a conversa...",
            "horario": u.criado_em.strftime("%H:%M") if u.criado_em else "--:--"
        })
        
    return lista_formatada

