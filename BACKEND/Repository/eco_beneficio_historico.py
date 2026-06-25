from sqlalchemy.orm import Session
from models.eco_beneficio_historico import EcoBeneficioHistorico

class EcoBeneficioHistoricoRepository:
    def __init__(self, db: Session):
        self.db = db

    def obter_historico_por_usuario(self, usuario_id: int) -> list[EcoBeneficioHistorico]:
        return self.db.query(EcoBeneficioHistorico).filter(
            EcoBeneficioHistorico.usuario_id == usuario_id
        ).order_by(EcoBeneficioHistorico.criado_em.desc()).all()