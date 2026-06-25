# core/security.py
import jwt
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext

# Configurações do JWT (Em produção, jogue isso para o arquivo .env)
SECRET_KEY = "SUA_CHAVE_SECRETA_SUPER_SECRETA_DO_NEWECO"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # O token vai durar 1 dia

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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