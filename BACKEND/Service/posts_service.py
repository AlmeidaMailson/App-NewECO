import os
import shutil
import uuid

from sqlalchemy.orm import Session
from Repository.post_repository import create_post_repository

# Importar a função create_post do repositório
async def create_post(db,tiulo, legenda, midia): # função para criar um post

    # dterminar o tipo de mídia com base na extensão 
    extensao = os.path.splitext( # extrair a extensão do arquivo
        midia.filename # extrair o nome do arquivo e a extensão
    )[1].lower() # extrair a extensão do arquivo e converter para minúscula

    # determinar o tipo de mídia com base na extensão
    if extensao in [".jpg", ".jpeg", ".png", ".gif"]:
        tipo_midia = "imagem"

    elif extensao in [".mp4", ".avi", ".mov"]:
        tipo_midia = "video"
    elif extensao in [".mp3", ".wav"]:
        tipo_midia = "audio"
    else: 
        tipo_midia = "desconhecido"
        
        #criar pasta de upload se não existir
        nome_unico = f"{uuid.uuid4()}{extensao}" # Gerar um nome único para o arquivo
        caminho = f"uploads/post/{nome_unico}" #caminho para salvar o arquivo 

        with open(caminho, "wb") as buffer: # Abrir o arquivo para escrita em modo binário, buffer é o objeto de arquivo que será usado para escrever os dados do arquivo enviado
            buffer.write(midia.file.read()) # write é um método do objeto de arquivo que escreve os dados lidos do arquivo enviado para o buffer, e oque esta entre parênteses é oque esta sendo escrito

        dados_post = {
            "tiulo": tiulo,
            "legenda": legenda,
            "midia": caminho,
            "tipo_midia": tipo_midia 
        }

        return create_post_repository(db, dados_post) # Chamar a função create_post_repository