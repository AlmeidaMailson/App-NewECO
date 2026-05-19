from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from schemas.user_schema import UserResponse

from app.database import engine, Base
from app.depedencies import get_db

from routes.user_routes import router as user_router
from routes.posts_routes import router as posts_router

from models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router)
app.include_router(posts_router)

@app.get("/")
def home():
    return {"message": "API funcionando"}

# Rota para listar usuários (exemplo)

@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return users

@app.get("/posts")
def posts():
    return {"message": "Rota de posts"}