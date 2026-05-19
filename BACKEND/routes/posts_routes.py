from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.depedencies import get_db
from schemas.posts_schemas import PostCreate
from Service.posts_service import create_post

router = APIRouter(prefix="/posts")

# Rota para criar um novo post

@router.post("/")
def criar_posts(
    titulo: str = Form(...),
    legenda: str = Form(...),
    midia: UploadFile = File(...),
    db: Session =  Depends(get_db)
):
    return create_post(db, titulo, legenda, midia)
