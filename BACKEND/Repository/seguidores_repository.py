from models.seguidores import Seguidor

def create_seguir_repository(db, seguidor):

    try:
        novo_seguidor = Seguidor(
            seguidor_id=seguidor.seguidor_id,
            seguindo_id=seguidor.seguindo_id
        )
        db.add(novo_seguidor)
        db.commit()
        db.refresh(novo_seguidor)

        return novo_seguidor
    except Exception:
        db.rollback()
        raise

def get_seguir_repository(db, seguidor_id, seguindo_id):
    return db.query(Seguidor).filter(
        Seguidor.seguidor_id == seguidor_id,
        Seguidor.seguindo_id == seguindo_id
    ).first()

def delete_seguir_repository(db, seguir):
    try:
        db.delete(seguir)
        db.commit()

        return True
    except Exception:
        db.rollback()
        raise

def list_seguidores_repository(db, usuario_id):
    return db.query(Seguidor).filter(
        Seguidor.seguindo_id == usuario_id
    ).all()

def list_seguindo_repository(db, usuario_id):
    return db.query(Seguidor).filter(
        Seguidor.seguidor_id == usuario_id
    ).all()
