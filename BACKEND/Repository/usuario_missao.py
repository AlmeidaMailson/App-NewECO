from sqlalchemy.orm import Session
from models.usuario_missao import UsuarioMissao
from models.eco_beneficio_historico import EcoBeneficioHistorico

class UsuarioMissaoRepository:
    def __init__(self, db: Session):
        self.db = db

    def buscar_progresso(self, usuario_id: int, missao_id: int) -> UsuarioMissao:
        return self.db.query(UsuarioMissao).filter(
            UsuarioMissao.usuario_id == usuario_id,
            UsuarioMissao.missao_id == missao_id
        ).first()

    def criar_progresso_inicial(self, usuario_id: int, missao_id: int) -> UsuarioMissao:
        reg_progresso = UsuarioMissao(
            usuario_id=usuario_id,
            missao_id=missao_id,
            progresso=0,
            concluida=False
        )
        self.db.add(reg_progresso)
        self.db.flush()
        return reg_progresso

    def adicionar_historico_pontos(self, usuario_id: int, missao_id: int, titulo_missao: str, pontos: int):
        historico_pontos = EcoBeneficioHistorico(
            usuario_id=usuario_id,
            missao_id=missao_id,
            descricao=f"Conclusão da EcoMissão: {titulo_missao}",
            pontos=pontos,
            tipo="CREDITO"
        )
        self.db.add(historico_pontos)

    def commit(self):
        self.db.commit()

    def refresh(self, obj):
        self.db.refresh(obj)