from models.post import Post

def create_post_repository(db, dados_post):
     novo_post = Post(
          titulo = dados_post.titulo,
          legenda = dados_post.Legenda, 
          midia = dados_post.midia,
          tipo_midia = dados_post.tipo_midia 
     )
     
     db.add(novo_post)
     db.commit()
     db.refresh(novo_post)

     return novo_post