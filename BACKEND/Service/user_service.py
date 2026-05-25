from passlib.context import CryptContext
from Repository.user_repository import create_user_repository
from sqlalchemy.orm import Session
from models.user import User

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# cadastro
async def create_user(db, user):

    senha_hash = pwd_context.hash(
        user.senha
    )

    user.senha = senha_hash

    return create_user_repository(db, user)

# login
def login_user(db, email, senha):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return None

    senha_correta = pwd_context.verify(
        senha,
        user.senha
    )

    if not senha_correta:
        return None

    return user