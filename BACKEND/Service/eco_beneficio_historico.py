from Repository.eco_beneficio_historico import EcoBeneficioHistoricoRepository


class EcoBeneficioHistoricoService:

    def __init__(self, db):
        self.repo = EcoBeneficioHistoricoRepository(db)

    def calcular_saldo_e_extrato(self, usuario_id):

        historico = self.repo.listar_historico(usuario_id)

        saldo = self.repo.calcular_saldo(usuario_id)

        return {
            "saldo_total": saldo,
            "historico": historico
        }