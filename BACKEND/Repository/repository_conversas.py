from sqlalchemy import func, case, select, or_, and_
from sqlalchemy.orm import joinedload


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

def get_conversas_usuario_repository(db, usuario_1_id, limit=50):
    seguindo_subquery = (
        select(Seguidor.seguindo_id)
        .filter(Seguidor.seguidor_id == usuario_1_id)
        .scalar_subquery()
    ) 
    stmt = (
        select(conversa).filter(
            #conversa.aberto == True, ==>YAGNI (You Aren't Gonna Need It — Você não vai precisar disso agora).
            or_(
                and_(conversa.usuario_1_id == usuario_1_id, conversa.usuario_2_id.in_(seguindo_subquery)),
                and_(conversa.usuario_2_id==usuario_1_id, conversa.usuario_1_id.in_(seguindo_subquery))
            )  
        )
        .order_by(conversa.criado_em.desc())
            .limit(limit) 
    )
    result = db.execute(stmt) 
    return result.scalars().all()


