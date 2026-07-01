import os
from dotenv import load_dotenv
from sqlalchemy import select 
from sqlalchemy.orm import Session
from models.mensagens import Mensagem
from cryptography.fernet import Fernet

#Carrega as variaveis do arquivo .env para a memoria do sistema
load_dotenv()

        #   codigo para cria a chave 
# from cryptography.fernet import Fernet
# print(Fernet.generate_key().decode())


#Busca  a chave secreta que criamos e adicionamos la no arquivo .env
CHAVE_SEC = os.getenv("CHAVE_CRIPTOGRAFIA")

#  Inicializa o "cofre" (Fernet). Se esquecer de pôr no .env, ele cria uma temporária para não quebrar
cipher = Fernet(CHAVE_SEC.encode() if CHAVE_SEC else Fernet.generate_key())


class MensagemRepository:
  
    def criar_mensagem(self, db: Session, conversa_id: int, remetente_id: int, texto_mensagem: str):

        # CRIPTOGRAFA: Transforma o texto limpo em código ilegível antes de salvar
        texto_criptografado = cipher.encrypt(texto_mensagem.encode()).decode()
        nova_mensagem = Mensagem (
            conversa_id = conversa_id,
            remetente_id = remetente_id,
            mensagem = texto_criptografado
        )
        db.add(nova_mensagem)
        db.commit()
        db.refresh(nova_mensagem)
        return nova_mensagem
    

    def listar_mensagens_da_conversa(self, db: Session, conversa_id: int):
        stmt = (
            select(Mensagem)
            .filter(Mensagem.conversa_id == conversa_id)
            .order_by(Mensagem.criado_em.asc())
        )
        resultado = db.execute(stmt)
        mensagens_banco = resultado.scalars().all()

        # DESCRIPTOGRAFA: Como o banco devolve o texto trancado, nós abrimos antes de mandar pro front-end
        for msg in mensagens_banco:
            try:
                msg.mensagem = cipher.decrypt(msg.mensagem.encode()).decode()
            except Exception:

                # Se houver alguma mensagem antiga não criptografada no banco, ignora o erro para não quebrar o chat
                pass
        return mensagens_banco
    

mensagem_repository = MensagemRepository()

def marcar_mensagens_como_lidas(db, conversa_id: int, usuario_id: int):

    (
        db.query(Mensagem)
        .filter(
            Mensagem.conversa_id == conversa_id,
            Mensagem.remetente_id != usuario_id,
            Mensagem.lida == False
        )
        .update(
            {"lida": True},
            synchronize_session=False
        )
    )

    db.commit()

