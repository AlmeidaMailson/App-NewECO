from models.post import Post

def create_post_repository(db, dados_post):

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