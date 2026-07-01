from models.user import User
from sqlalchemy import select

def create_user_repository(db, user):

    novo_usuario = User(
        nome=user.nome,
        email=user.email,
        senha=user.senha,
        telefone=user.telefone,
        estado=user.estado,
        cidade=user.cidade,
        bio=getattr(user, "bio", None),
        avatar_url=getattr(user, "avatar_url", None),
        eco_beneficios=getattr(user, "eco_beneficios", 0)

    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario

def get_usuario_by_id(db, usuario_id: int):
    stmt = select(User).filter(User.id == usuario_id)
    result = db.execute(stmt)
    return result.scalars().first()
