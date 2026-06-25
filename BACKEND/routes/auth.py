# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.depedencies import get_db
from models.user import User as Usuario
from core.security import verificar_senha, criar_token_acesso

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm usa form_data.username (que mapeamos para o email) e form_data.password
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    
    if not usuario or not verificar_senha(form_data.password, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )
    
    # Geramos o token passando o ID do usuário como 'sub' (subject)
    token_acesso = criar_token_acesso(dados={"sub": str(usuario.id)})
    
    return {
        "access_token": token_acesso,
        "token_type": "bearer",
        "usuario_id": usuario.id
    }