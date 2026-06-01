from faker import Faker

from passlib.context import CryptContext
from app.database import SessionLocal

from models.user import User
from models.post import Post
from models.post_interacoes import (
    CurtidaPost,
    ComentarioPost,
    PostSalvo,
    CompartilhamentoPost
)
from models.seguidores import Seguidor

fake = Faker("pt_BR")

db = SessionLocal()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

print("Limpando banco...")

db.query(CurtidaPost).delete()
db.query(ComentarioPost).delete()
db.query(PostSalvo).delete()
db.query(CompartilhamentoPost).delete()
db.query(Seguidor).delete()
db.query(Post).delete()
db.query(User).delete()

db.commit()

print("Criando usuários...")

for _ in range(20):
    usuario = User(
        nome=fake.name(),
        email=fake.unique.email(),
        senha=pwd_context.hash("123456"),
        telefone=fake.msisdn()[:11],
        cidade=fake.city(),
        estado=fake.estado_sigla()
    )

    db.add(usuario)

db.commit()

usuarios = db.query(User).all()

print("Criando posts...")

for usuario in usuarios:
    for _ in range(3):
        post = Post(
            usuario_id=usuario.id,
            titulo=fake.sentence(),
            legenda=fake.text(max_nb_chars=150),
            midia_url="uploads/post/foto1.jpg",
            tipo_midia="imagem"
        )

        db.add(post)

db.commit()

posts = db.query(Post).all()

print("Criando comentários...")

for post in posts:

    usuarios_comentarios = fake.random_elements(
        usuarios,
        length=min(5, len(usuarios)),
        unique=True
    )

    for usuario in usuarios_comentarios:

        comentario = ComentarioPost(
            post_id=post.id,
            usuario_id=usuario.id,
            texto=fake.sentence()
        )

        db.add(comentario)

db.commit()

print("Criando curtidas...")

for post in posts:

    usuarios_curtidas = fake.random_elements(
        usuarios,
        length=min(5, len(usuarios)),
        unique=True
    )

    for usuario in usuarios_curtidas:

        curtida = CurtidaPost(
            post_id=post.id,
            usuario_id=usuario.id
        )

        db.add(curtida)

db.commit()

print("Criando seguidores...")

seguidores_criados = set()

for usuario in usuarios:

    outros = [u for u in usuarios if u.id != usuario.id]

    sorteados = fake.random_elements(
        outros,
        length=min(3, len(outros)),
        unique=True
    )

    for seguido in sorteados:

        chave = (usuario.id, seguido.id)

        if chave not in seguidores_criados:
            seguidores_criados.add(chave)

            seguidor = Seguidor(
                seguidor_id=usuario.id,
                seguindo_id=seguido.id
            )

            db.add(seguidor)

db.commit()

db.close()

print("Seed executado com sucesso!")