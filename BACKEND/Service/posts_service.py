import os
import uuid

from Repository.post_repository import create_post_repository

def create_post(db, titulo, legenda,usuario_id, midia):

    extensao = os.path.splitext(midia.filename)[1].lower()

    if extensao in [".jpg", ".jpeg", ".png", ".gif"]:
        tipo_midia = "imagem"

    elif extensao in [".mp4", ".avi", ".mov"]:
        tipo_midia = "video"

    elif extensao in [".mp3", ".wav"]:
        tipo_midia = "audio"

    else:
        tipo_midia = "desconhecido"

    # CRIAR PASTA SE NÃO EXISTIR
    pasta = "uploads/post"
    os.makedirs(pasta, exist_ok=True)

    nome_unico = f"{uuid.uuid4()}{extensao}"
    caminho = os.path.join(pasta, nome_unico)

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