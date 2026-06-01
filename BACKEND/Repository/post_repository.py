from sqlalchemy import func, case
from sqlalchemy.orm import joinedload

from models.post import Post
from models.post_interacoes import (
  ComentarioPost,
  CompartilhamentoPost,
  CurtidaPost,
  PostSalvo
)
from models.seguidores import Seguidor

def create_post_repository(db, dados_post):

  try:
    novo_post = Post(
      usuario_id=dados_post["usuario_id"],
      titulo=dados_post["titulo"],
      legenda=dados_post["legenda"],
      midia_url=dados_post["midia_url"],
      tipo_midia=dados_post["tipo_midia"]
  )
    db.add(novo_post)
    db.commit()
    db.refresh(novo_post)

    return novo_post
  except Exception:
    db.rollback()
    raise

def list_posts_repository(db, usuario_id):
  seguindo_subquery = db.query(Seguidor.seguindo_id).filter(
    Seguidor.seguidor_id == usuario_id
  ).subquery()

  return db.query(Post).options(
    joinedload(Post.usuario)
  ).order_by(
    case(
      (Post.usuario_id.in_(seguindo_subquery), 0),
      else_=1
    ),
    Post.criado_em.desc()
  ).all()

def get_post_repository(db, post_id):
  return db.query(Post).filter(Post.id == post_id).first()

def delete_post_repository(db, post):
  try:
    db.delete(post)
    db.commit()
    return True
  except Exception:
    db.rollback()
    raise

def get_curtida_repository(db, post_id, usuario_id):
  return db.query(CurtidaPost).filter(
    CurtidaPost.post_id == post_id,
    CurtidaPost.usuario_id == usuario_id
  ).first()

def create_curtida_repository(db, post_id, usuario_id):
  try:
    curtida = CurtidaPost(post_id=post_id, usuario_id=usuario_id)
    db.add(curtida)
    db.commit()
    db.refresh(curtida)
    return curtida
  except Exception:
    db.rollback()
    raise

def delete_curtida_repository(db, curtida):
  try:
    db.delete(curtida)
    db.commit()
    return True
  except Exception:
    db.rollback()
    raise

def create_comentario_repository(db, post_id, usuario_id, texto):
  try:
    comentario = ComentarioPost(
      post_id=post_id,
      usuario_id=usuario_id,
      texto=texto
    )
    db.add(comentario)
    db.commit()
    db.refresh(comentario)
    return comentario
  except Exception:
    db.rollback()
    raise

def list_comentarios_repository(db, post_id):
  return db.query(ComentarioPost).filter(
    ComentarioPost.post_id == post_id
  ).order_by(ComentarioPost.criado_em.asc()).all()

def get_salvo_repository(db, post_id, usuario_id):
  return db.query(PostSalvo).filter(
    PostSalvo.post_id == post_id,
    PostSalvo.usuario_id == usuario_id
  ).first()

def create_salvo_repository(db, post_id, usuario_id):
  try:
    salvo = PostSalvo(post_id=post_id, usuario_id=usuario_id)
    db.add(salvo)
    db.commit()
    db.refresh(salvo)
    return salvo
  except Exception:
    db.rollback()
    raise

def delete_salvo_repository(db, salvo):
  try:
    db.delete(salvo)
    db.commit()
    return True
  except Exception:
    db.rollback()
    raise

def create_compartilhamento_repository(db, post_id, usuario_id):
  try:
    compartilhamento = CompartilhamentoPost(
      post_id=post_id,
      usuario_id=usuario_id
    )
    db.add(compartilhamento)
    db.commit()
    db.refresh(compartilhamento)
    return compartilhamento
  except Exception:
    db.rollback()
    raise

def count_curtidas_repository(db, post_id):
  return db.query(func.count(CurtidaPost.id)).filter(
    CurtidaPost.post_id == post_id
  ).scalar()

def count_comentarios_repository(db, post_id):
  return db.query(func.count(ComentarioPost.id)).filter(
    ComentarioPost.post_id == post_id
  ).scalar()

def count_compartilhamentos_repository(db, post_id):
  return db.query(func.count(CompartilhamentoPost.id)).filter(
    CompartilhamentoPost.post_id == post_id
  ).scalar()
