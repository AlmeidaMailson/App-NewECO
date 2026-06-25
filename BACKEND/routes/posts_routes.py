from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status
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
    listar_posts_perfil_usuario,
    listar_posts_usuario,
    salvar_post
)
from schemas.posts_schemas import (
    ComentarioCreate,
    ComentarioResponse,
    FeedPostResponse,
    PostResponse
)

# Imports corretos e padronizados conforme solicitado
from core.deps import obter_usuario_atual
from models.user import User as Usuario

router = APIRouter(prefix="/posts", tags=["Posts / Redes Sociais"]) # Adicionado a tag para organizar o Swagger

@router.get("/feed", response_model=list[FeedPostResponse])
def listar_posts_feed(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # Passa o ID do token direto para o seu service existente
    return listar_feed(db, usuario_logado.id)

@router.get("/me", response_model=list[FeedPostResponse])
def listar_meus_posts(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # Agora a rota realmente faz jus ao nome "/me" (busca o usuário do token)
    return listar_posts_usuario(db, usuario_logado.id)

@router.get("/user/{perfil_usuario_id}", response_model=list[FeedPostResponse])
def listar_posts_de_usuario(
    perfil_usuario_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # O usuario_id logado serve para o service saber se o usuário curtiu/salvou os posts que está visualizando
    return listar_posts_perfil_usuario(
        db,
        perfil_usuario_id=perfil_usuario_id,
        usuario_id=usuario_logado.id
    )

@router.post("/", response_model=PostResponse)
async def create_post_route(
    titulo: str = Form(...),
    legenda: str = Form(...),
    midia_url: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    # ❌ Removemos o `usuario_id: int = Form(...)` para evitar fraudes!
    # O ID agora vem direto e seguro do token.
    return create_post(
        db,
        titulo,
        legenda,
        usuario_logado.id,
        midia_url
    )

@router.delete("/{post_id}")
def delete_post_route(
    post_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    # Seu service já deve validar internamente se o usuario_logado.id realmente é o dono do post antes de apagar
    return deletar_post(db, post_id, usuario_logado.id)

@router.post("/{post_id}/curtir")
def curtir_post_route(
    post_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    return curtir_post(db, post_id, usuario_logado.id)

@router.post("/{post_id}/comentarios", response_model=ComentarioResponse)
def comentar_post_route(
    post_id: int,
    comentario: ComentarioCreate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    return comentar_post(
        db,
        post_id=post_id,
        usuario_id=usuario_logado.id,
        texto=comentario.texto
    )

@router.post("/{post_id}/salvar")
def salvar_post_route(
    post_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    return salvar_post(db, post_id, usuario_logado.id)

@router.post("/{post_id}/compartilhar")
def compartilhar_post_route(
    post_id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) #  Rota protegida por Token
):
    return compartilhar_post(db, post_id, usuario_logado.id)