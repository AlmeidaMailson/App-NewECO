import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# 2. Pega a URL do banco do arquivo .env (com valor padrão do Docker caso o .env não exista)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://dev_user:dev_password@localhost:5432/meu_banco"
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# 3. Cria a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# 4. Teste de conexão simples
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        print("🚀 Banco PostgreSQL do Docker conectado com sucesso!")
except Exception as e:
    print("❌ Erro ao conectar no banco:", e)

# 5. Configuração da sessão e Base para os modelos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()