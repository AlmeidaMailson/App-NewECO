from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form
)
from sqlalchemy.orm import Session

from app.depedencies import get_db
from Service.posts_service import (
    comentar_post,
    compartilhar_post,
    create_post,
    curtir_post,
    deletar_post,
    listar_feed,
    salvar_post
)
from schemas.posts_schemas import (
    ComentarioCreate,
    ComentarioResponse,
    FeedPostResponse,
    PostResponse
)

router = APIRouter(prefix="/posts")

@router.get("/feed", response_model=list[FeedPostResponse])
def listar_posts_feed(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return listar_feed(db, usuario_id)

@router.post("/", response_model=PostResponse)
async def create_post_route(
    usuario_id: int = Form(...),
    titulo: str = Form(...),
    legenda: str = Form(...),
    midia_url: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return create_post(
        db,
        titulo,
        legenda,
        usuario_id,
        midia_url
    )

@router.delete("/{post_id}")
def delete_post_route(
    post_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return deletar_post(db, post_id, usuario_id)

@router.post("/{post_id}/curtir")
def curtir_post_route(
    post_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return curtir_post(db, post_id, usuario_id)

@router.post("/{post_id}/comentarios", response_model=ComentarioResponse)
def comentar_post_route(
    post_id: int,
    comentario: ComentarioCreate,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return comentar_post(
        db,
        post_id=post_id,
        usuario_id=usuario_id,
        texto=comentario.texto
    )

@router.post("/{post_id}/salvar")
def salvar_post_route(
    post_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return salvar_post(db, post_id, usuario_id)

@router.post("/{post_id}/compartilhar")
def compartilhar_post_route(
    post_id: int,
    usuario_id: int,
    db: Session = Depends(get_db)
):
    return compartilhar_post(db, post_id, usuario_id)
