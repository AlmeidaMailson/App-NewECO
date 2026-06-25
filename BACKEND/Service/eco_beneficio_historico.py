from sqlalchemy.orm import Session
from Repository.eco_beneficio_historico import EcoBeneficioHistoricoRepository

class EcoBeneficioHistoricoService:
    def __init__(self, db: Session):
        self.repo = EcoBeneficioHistoricoRepository(db)

    def calcular_saldo_e_extrato(self, usuario_id: int):
        historico = self.repo.obter_historico_por_usuario(usuario_id)

        # Regra de negócio: calcula saldo de pontos somando créditos e subtraindo débitos
        saldo = 0
        for item in historico:
            if item.tipo.upper() == "CREDITO":
                saldo += item.pontos
            elif item.tipo.upper() == "DEBITO":
                saldo -= item.pontos

        return {
            "saldo_total": saldo,
            "historico": historico
        }