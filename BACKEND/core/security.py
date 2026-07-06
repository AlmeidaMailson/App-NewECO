import jwt
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.user import User as Usuario
from cryptography.fernet import Fernet  #  para o chat

# Configurações do JWT
SECRET_KEY = "SUA_CHAVE_SECRETA_SUPER_SECRETA_DO_NEWECO"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # O token vai durar 1 dia

# Chave para criptografia simétrica das mensagens do chat
# Em produção, você pode mover isso para o seu arquivo .env
CHAVE_CHAT_SECRET = b'6f_X42K3XzR_8Vv2B9v19J43Hz7f8asD23fGhzklMno='
fernet = Fernet(CHAVE_CHAT_SECRET)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- SEGURANÇA DE USUÁRIOS (SUAS FUNÇÕES ORIGINAIS) ---

# Criptografa a senha antes de salvar no banco
def gerar_senha_criptografada(senha: str) -> str:
    return pwd_context.hash(senha)

# Verifica se a senha digitada bate com o hash do banco
def verificar_senha(senha_pura: str, senha_criptografada: str) -> bool:
    return pwd_context.verify(senha_pura, senha_criptografada)

# Cria o Token JWT assinado
def criar_token_acesso(dados: dict, tempo_expiracao: Optional[timedelta] = None) -> str:
    dados_para_codificar = dados.copy()
    
    if tempo_expiracao:
        expiracao = datetime.utcnow() + tempo_expiracao
    else:
        expiracao = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    dados_para_codificar.update({"exp": expiracao})
    token_jwt = jwt.encode(dados_para_codificar, SECRET_KEY, algorithm=ALGORITHM)
    return token_jwt


# --- NOVA SEÇÃO: CRIPTOGRAFIA DO CHAT (DUAS VIAS) ---

def criptografar_mensagem(texto: str) -> str:
    """Transforma o texto puro da mensagem em uma string criptografada e ilegível."""
    return fernet.encrypt(texto.encode()).decode()

def descriptografar_mensagem(texto_criptografado: str) -> str:
    """Transforma a string criptografada do banco de volta em texto legível."""
    try:
        return fernet.decrypt(texto_criptografado.encode()).decode()
    except Exception:
        return "[Erro ao descriptografar mensagem]"
    
from sqlalchemy.orm import Session
from models.user import User as Usuario
import jwt

def obtener_usuario_por_token(token: str, db: Session):
    """Decodifica o token JWT baseado no ID ('sub') e retorna o usuário do banco."""
    try:
        # 1. Decodifica o token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = payload.get("sub") 
        
        if usuario_id is None:
            print("❌ Falha no WebSocket: O Token não possui a chave 'sub'.")
            return None
            
        # 2. Conversão segura para Inteiro (Garante que '86' vire 86)
        try:
            id_limpo = int(usuario_id)
        except ValueError:
            print(f"❌ Falha no WebSocket: O 'sub' ({usuario_id}) não pôde ser convertido para número inteiro.")
            return None
            
        # 3. Busca o usuário dono do ID no banco de dados
        usuario = db.query(Usuario).filter(Usuario.id == id_limpo).first()
        
        if not usuario:
            print(f"❌ Falha no WebSocket: Usuário com ID {id_limpo} não existe no banco.")
            return None
            
        return usuario
        
    except jwt.ExpiredSignatureError:
        print("❌ Falha no WebSocket: O Token JWT enviado já expirou.")
        return None
    except jwt.PyJWTError as e:
        print(f"❌ Falha no WebSocket: Erro de assinatura ou token corrompido: {e}")
        return None
    except Exception as e:
        print(f"❌ Erro inesperado na segurança do WebSocket: {e}")
        return None


