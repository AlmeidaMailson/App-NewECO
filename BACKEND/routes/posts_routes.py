from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session

from app.depedencies import get_db
from Service.posts_service import create_post

router = APIRouter(prefix="/posts")

# Rota para criar um novo post

@router.post("/")
async def crieate_post(
    usuario_id: int = Form(...), 

    titulo: str = Form(...),

    legenda: str = Form(...),

    midia_url: UploadFile = File(...),

    db: Session = Depends(get_db)

):
    
    return await create_post(
        db,
        titulo,
        legenda,
        usuario_id,
        midia_url
    )