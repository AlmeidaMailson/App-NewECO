# core/deps.py
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.depedencies import get_db
from models.user import User as Usuario
from core.security import SECRET_KEY, ALGORITHM

# Diz ao FastAPI para procurar o token na rota '/auth/login' ou no header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def obter_usuario_atual(token: int = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    excecao_credenciais = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodifica o token recebido do Front-end
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: int = payload.get("sub") # O 'sub' costuma guardar o ID do usuário
        if usuario_id is None:
            raise excecao_credenciais
    except jwt.PyJWTError:
        raise excecao_credenciais
        
    # Busca o usuário dono do token no banco de dados
    usuario = db.query(Usuario).filter(Usuario.id == int(usuario_id)).first()
    if usuario is None:
        raise excecao_credenciais
        
    return usuario