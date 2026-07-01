from pathlib import Path

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.depedencies import get_db
from models.user import User

from app.database import Base, engine
from routes import (
    configuracao_privacidade_routes,
    configuracao_seguranca_routes,
    eco_beneficio_historico,
    mapa_verde_routes,
    missoes_routes,
    notificacao_routes,
    usuario_missao,
)
from routes.auth import router as auth
from routes.conversa_router import router as conversa_router
from routes.mensagens_routes import router as mensagens_router
from routes.posts_routes import router as posts_router
from routes.seguidores_routes import router as seguidores_router
from routes.user_routes import router as user_router
from scheduler import iniciar_scheduler

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="App NewEco Link",
    version="1.0.0",
)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
(UPLOADS_DIR / "post").mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(auth)

@app.on_event("startup")
def startup():
    iniciar_scheduler()


@app.get("/")
def home():
    return {"message": "API funcionando"}

@app.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(User).all()

    return usuarios

