from pathlib import Path

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from schemas.user_schema import UserResponse

from app.database import engine, Base
from app.depedencies import get_db

from routes.user_routes import router as user_router
from routes.posts_routes import router as posts_router
from routes.seguidores_routes import router as seguidores_router
from routes.conversa_router import router as conversa_router
from routes.mensagens_routes import router as mensagens_router
from routes import mapa_verde_routes
from routes import missoes_routes
from routes import usuario_missao, eco_beneficio_historico
from routes import notificacao_routes
from routes import configuracao_privacidade_routes, configuracao_seguranca_routes

#jwt
from routes import auth

from models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="App NewEco Link",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)
app.include_router(posts_router)
app.include_router(seguidores_router)
app.include_router(conversa_router)
app.include_router(mensagens_router)
app.include_router(mapa_verde_routes.router)
app.include_router(missoes_routes.router)
app.include_router(usuario_missao.router)
app.include_router(eco_beneficio_historico.router)
app.include_router(notificacao_routes.router)
app.include_router(configuracao_privacidade_routes.router)
app.include_router(configuracao_seguranca_routes.router)

# jwt
app.include_router(auth.router)




UPLOADS_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

@app.get("/")
def home():
    return {"message": "API funcionando"}

# Rota para listar usuários (exemplo)

@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return users

