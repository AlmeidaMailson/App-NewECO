from sqlalchemy.orm import Session
from sqlalchemy import func

from models.eco_beneficio_historico import  EcoBeneficioHistorico



class EcoBeneficioHistoricoRepository:

    def __init__(self, db: Session):
        self.db = db

    def listar_historico(self, usuario_id: int):
        return (
            self.db.query(EcoBeneficioHistorico)
            .filter(EcoBeneficioHistorico.usuario_id == usuario_id)
            .order_by(EcoBeneficioHistorico.criado_em.desc())
            .all()
        )

    def calcular_saldo(self, usuario_id: int):

        creditos = (
            self.db.query(func.coalesce(func.sum(EcoBeneficioHistorico.pontos), 0))
            .filter(
                EcoBeneficioHistorico.usuario_id == usuario_id,
                EcoBeneficioHistorico.tipo == "CREDITO",
            )
            .scalar()
        )

        debitos = (
            self.db.query(func.coalesce(func.sum(EcoBeneficioHistorico.pontos), 0))
            .filter(
                EcoBeneficioHistorico.usuario_id == usuario_id,
                EcoBeneficioHistorico.tipo == "DEBITO",
            )
            .scalar()
        )

        return creditos - debitos