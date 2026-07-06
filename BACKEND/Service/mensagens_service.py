from fastapi import WebSocket
from sqlalchemy.orm import Session
from Repository.repository_mensagens import MensagemRepository
from core.security import criptografar_mensagem, descriptografar_mensagem
import json

class ChatService:
    def __init__(self, db: Session):
        self.repo = MensagemRepository(db)
        self._conexoes_ativas: dict[int, WebSocket] = {}

    async def conectar_usuario(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self._conexoes_ativas[user_id] = websocket

    def desconectar_usuario(self, user_id: int):
        if user_id in self._conexoes_ativas:
            del self._conexoes_ativas[user_id]

    async def processar_e_enviar_mensagem(self, remetente_id: int, dados_brutos: str):
        dados = json.loads(dados_brutos)
        destinatario_id = int(dados["destinatario_id"])
        texto_puro = dados["conteudo"]

        texto_criptografado = criptografar_mensagem(texto_puro)
        self.repo.salvar_mensagem(remetente_id, destinatario_id, texto_criptografado)

        payload = {
            "remetente_id": remetente_id,
            "destinatario_id": destinatario_id,
            "conteudo": texto_criptografado,
            "horario": "agora"
        }

        if destinatario_id in self._conexoes_ativas:
            await self._conexoes_ativas[destinatario_id].send_json(payload)
        if remetente_id in self._conexoes_ativas:
            await self._conexoes_ativas[remetente_id].send_json(payload)

    # 🔴 CERTIFIQUE-SE DE QUE ESTA FUNÇÃO ESTÁ EXATAMENTE AQUI DENTRO DA CLASSE:
    def obter_conversas_descriptografadas(self, user_id: int):
        conversas_do_banco = self.repo.buscar_lista_conversas(user_id)
        lista_final = []

        for row in conversas_do_banco:
            if row.ultima_mensagem:
                msg_tratada = descriptografar_mensagem(row.ultima_mensagem)
            else:
                msg_tratada = "Toque para iniciar uma conversa..."

            lista_final.append({
                "contato_id": row.contato_id,
                "contato_nome": row.contato_nome,
                "ultima_mensagem": msg_tratada,
                "horario": row.horario
            })
        return lista_final