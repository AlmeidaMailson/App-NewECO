from models.user import User

def create_user_repository(db, user):

    novo_usuario = User(
        nome=user.nome,
        email=user.email,
        senha=user.senha,
        telefone=user.telefone,
        estado=user.estado,
        cidade=user.cidade
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario