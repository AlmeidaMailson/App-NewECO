from sqlalchemy import func, select, or_, and_


from models.conversas import conversa
from models.seguidores import Seguidor

def create_conversa_repository(db, dados_conversa):
     try:
        nova_conversa = conversa(
            usuario_1_id=dados_conversa["usuario_1_id"],
            usuario_2_id=dados_conversa["usuario_2_id"]
        )
        db.add(nova_conversa)
        db.commit()
        db.refresh(nova_conversa)

        return nova_conversa
     except Exception:
         db.rollback()
         raise

def get_conversas_usuario_repository(db, usuario_id, limit=50):

    return (
        db.query(conversa)
        .filter(
            or_(
                conversa.usuario_1_id == usuario_id,
                conversa.usuario_2_id == usuario_id,
            )
        )
        .order_by(conversa.criado_em.desc())
        .limit(limit)
        .all()
    )


def buscar_conversa_existente(db, usuario_1_id: int, usuario_2_id: int):

    return (
        db.query(conversa)
        .filter(
            or_(
                and_(
                    conversa.usuario_1_id == usuario_1_id,
                    conversa.usuario_2_id == usuario_2_id,
                ),
                and_(
                    conversa.usuario_1_id == usuario_2_id,
                    conversa.usuario_2_id == usuario_1_id,
                ),
            )
        )
        .first()
    )

