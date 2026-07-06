from sqlalchemy.orm import Session
from sqlalchemy import text
from models.mensagens import Mensagem as MensagemModel

class MensagemRepository:
    def __init__(self, db: Session):
        self.db = db

    def salvar_mensagem(self, remetente_id: int, destinatario_id: int, conteudo_cripto: str):
        nova_msg = MensagemModel(
            remetente_id=remetente_id,
            destinatario_id=destinatario_id,
            conteudo=conteudo_cripto
        )
        self.db.add(nova_msg)
        self.db.commit()
        self.db.refresh(nova_msg)
        return nova_msg

    def buscar_lista_conversas(self, user_id: int):
        # Query otimizada usando DISTINCT ON do PostgreSQL
        query = text("""
            WITH ultimas_mensagens AS (
                SELECT DISTINCT ON (
                    CASE WHEN remetente_id = :user_id THEN destinatario_id ELSE remetente_id END
                )
                id, remetente_id, destinatario_id, conteudo, criado_em
                FROM mensagens
                WHERE remetente_id = :user_id OR destinatario_id = :user_id
                ORDER BY 
                    CASE WHEN remetente_id = :user_id THEN destinatario_id ELSE remetente_id END, 
                    criado_em DESC
            )
            SELECT 
                um.conteudo AS ultima_mensagem,
                um.criado_em AS horario,
                u.id AS contato_id,
                u.nome AS contato_nome,
                u.avatar_url AS contato_avatar
            FROM ultimas_mensagens um
            JOIN usuarios u ON u.id = (
                CASE WHEN um.remetente_id = :user_id THEN um.destinatario_id ELSE um.remetente_id END
            )
            ORDER BY um.criado_em DESC;
        """)
        
        result = self.db.execute(query, {"user_id": user_id})
        return result.fetchall()
    
    def buscar_lista_conversas(self, user_id: int):
        # Query corrigida com 'seguindo_id' conforme o seu banco de dados
        query = text("""
            WITH ultimas_mensagens AS (
                SELECT DISTINCT ON (
                    CASE WHEN remetente_id = :user_id THEN destinatario_id ELSE remetente_id END
                )
                id, remetente_id, destinatario_id, conteudo, criado_em
                FROM mensagens
                WHERE remetente_id = :user_id OR destinatario_id = :user_id
                ORDER BY 
                    CASE WHEN remetente_id = :user_id THEN destinatario_id ELSE remetente_id END, 
                    criado_em DESC
            )
            SELECT 
                u.id AS contato_id,
                u.nome AS contato_nome,
                um.conteudo AS ultima_mensagem,
                COALESCE(um.criado_em, s.criado_em) AS horario
            FROM seguidores s
            JOIN usuarios u ON u.id = s.seguindo_id -- ✅ Corrigido para 'seguindo_id'
            LEFT JOIN ultimas_mensagens um ON (
                (um.remetente_id = :user_id AND um.destinatario_id = u.id) OR
                (um.remetente_id = u.id AND um.destinatario_id = :user_id)
            )
            WHERE s.seguidor_id = :user_id
            ORDER BY horario DESC;
        """)
        
        result = self.db.execute(query, {"user_id": user_id})
        return result.fetchall()