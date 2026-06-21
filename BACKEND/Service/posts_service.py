import os
import uuid

from fastapi import HTTPException

from Repository.post_repository import (
    count_comentarios_repository,
    count_compartilhamentos_repository,
    count_curtidas_repository,
    create_comentario_repository,
    create_compartilhamento_repository,
    create_curtida_repository,
    create_post_repository,
    create_salvo_repository,
    delete_curtida_repository,
    delete_post_repository,
    delete_salvo_repository,
    get_curtida_repository,
    get_post_repository,
    get_salvo_repository,
    list_comentarios_repository,
    list_posts_usuario_repository,
    list_posts_repository
)
from Repository.seguidores_repository import get_seguir_repository
from models.user import User

def create_post(db, titulo, legenda, usuario_id, midia):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario logado nao encontrado no banco"
        )

    extensao = os.path.splitext(midia.filename)[1].lower()

    if extensao in [".jpg", ".jpeg", ".png", ".gif"]:
        tipo_midia = "imagem"
    elif extensao in [".mp4", ".avi", ".mov"]:
        tipo_midia = "video"
    elif extensao in [".mp3", ".wav"]:
        tipo_midia = "audio"
    else:
        tipo_midia = "desconhecido"

    pasta = "uploads/post"
    os.makedirs(pasta, exist_ok=True)

    nome_unico = f"{uuid.uuid4()}{extensao}"
    caminho = os.path.join(pasta, nome_unico).replace("\\", "/")

    with open(caminho, "wb") as buffer:
        buffer.write(midia.file.read())

    dados_post = {
        "titulo": titulo,
        "legenda": legenda,
        "usuario_id": usuario_id,
        "midia_url": caminho,
        "tipo_midia": tipo_midia
    }

    return create_post_repository(db, dados_post)

def listar_feed(db, usuario_id):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario logado nao encontrado no banco"
        )

    posts = list_posts_repository(db, usuario_id)

    return [
        montar_post_feed(db, post, usuario_id)
        for post in posts
    ]

def listar_posts_usuario(db, usuario_id):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario logado nao encontrado no banco"
        )

    posts = list_posts_usuario_repository(db, usuario_id)

    return [
        montar_post_feed(db, post, usuario_id)
        for post in posts
    ]

def listar_posts_perfil_usuario(db, perfil_usuario_id, usuario_id=None):
    usuario_perfil = db.query(User).filter(User.id == perfil_usuario_id).first()

    if not usuario_perfil:
        raise HTTPException(
            status_code=404,
            detail="Usuario do perfil nao encontrado"
        )

    usuario_logado = None

    if usuario_id:
        usuario_logado = db.query(User).filter(User.id == usuario_id).first()

    usuario_visualizador_id = usuario_logado.id if usuario_logado else perfil_usuario_id
    posts = list_posts_usuario_repository(db, perfil_usuario_id)

    return [
        montar_post_feed(db, post, usuario_visualizador_id)
        for post in posts
    ]

def deletar_post(db, post_id, usuario_id):
    post = get_post_repository(db, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post nao encontrado"
        )

    if post.usuario_id != usuario_id:
        raise HTTPException(
            status_code=403,
            detail="Voce nao pode deletar esse post"
        )

    delete_post_repository(db, post)

    return {
        "message": "Post deletado com sucesso"
    }

def curtir_post(db, post_id, usuario_id):
    post = validar_post_e_usuario(db, post_id, usuario_id)
    curtida = get_curtida_repository(db, post_id, usuario_id)

    if curtida:
        delete_curtida_repository(db, curtida)
        curtido = False
    else:
        create_curtida_repository(db, post_id, usuario_id)
        curtido = True

    return {
        "curtido": curtido,
        "curtidas_count": count_curtidas_repository(db, post.id)
    }

def comentar_post(db, post_id, usuario_id, texto):
    validar_post_e_usuario(db, post_id, usuario_id)

    texto_limpo = texto.strip()

    if not texto_limpo:
        raise HTTPException(
            status_code=400,
            detail="Comentario nao pode ser vazio"
        )

    comentario = create_comentario_repository(
        db,
        post_id=post_id,
        usuario_id=usuario_id,
        texto=texto_limpo
    )

    usuario = db.query(User).filter(User.id == usuario_id).first()

    return {
        "id": comentario.id,
        "post_id": comentario.post_id,
        "usuario_id": comentario.usuario_id,
        "texto": comentario.texto,
        "usuario_nome": usuario.nome if usuario else None
    }

def salvar_post(db, post_id, usuario_id):
    post = validar_post_e_usuario(db, post_id, usuario_id)
    salvo = get_salvo_repository(db, post_id, usuario_id)

    if salvo:
        delete_salvo_repository(db, salvo)
        esta_salvo = False
    else:
        create_salvo_repository(db, post_id, usuario_id)
        esta_salvo = True

    return {
        "salvo": esta_salvo,
        "post_id": post.id
    }

def compartilhar_post(db, post_id, usuario_id):
    post = validar_post_e_usuario(db, post_id, usuario_id)
    create_compartilhamento_repository(db, post_id, usuario_id)

    return {
        "post_id": post.id,
        "compartilhamentos_count": count_compartilhamentos_repository(db, post_id)
    }

def validar_post_e_usuario(db, post_id, usuario_id):
    usuario = db.query(User).filter(User.id == usuario_id).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario logado nao encontrado no banco"
        )

    post = get_post_repository(db, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post nao encontrado"
        )

    return post

def montar_post_feed(db, post, usuario_id):
    comentarios = list_comentarios_repository(db, post.id)
    curtida = get_curtida_repository(db, post.id, usuario_id)
    salvo = get_salvo_repository(db, post.id, usuario_id)
    seguindo = get_seguir_repository(db, usuario_id, post.usuario_id)
    midia_url = post.midia_url.replace("\\", "/") if post.midia_url else None

    return {
        "id": post.id,
        "usuario_id": post.usuario_id,
        "titulo": post.titulo,
        "legenda": post.legenda,
        "midia_url": midia_url,
        "tipo_midia": post.tipo_midia,
        "usuario": {
            "id": post.usuario.id,
            "nome": post.usuario.nome,
            "email": post.usuario.email,
            "bio": post.usuario.bio,
            "avatar_url": post.usuario.avatar_url,
            "cidade": post.usuario.cidade,
            "estado": post.usuario.estado
        },
        "curtidas_count": count_curtidas_repository(db, post.id),
        "comentarios_count": count_comentarios_repository(db, post.id),
        "compartilhamentos_count": count_compartilhamentos_repository(db, post.id),
        "curtido": curtida is not None,
        "salvo": salvo is not None,
        "seguindo_autor": seguindo is not None or post.usuario_id == usuario_id,
        "comentarios": [
            {
                "id": comentario.id,
                "post_id": comentario.post_id,
                "usuario_id": comentario.usuario_id,
                "texto": comentario.texto,
                "usuario_nome": comentario.usuario.nome if comentario.usuario else None
            }
            for comentario in comentarios
        ]
    }
