from sqlalchemy.orm import Session
from Repository.configuracao_seguranca_repository import ConfiguracaoSegurancaRepository
from schemas.configuracao_seguranca_schema import ConfiguracaoSegurancaUpdateSchema

class ConfiguracaoSegurancaService:
    def __init__(self, db: Session):
        self.repo = ConfiguracaoSegurancaRepository(db)

    def buscar_configuracoes(self, usuario_id: int):
        return self.repo.obter_ou_criar(usuario_id)

    def atualizar_configuracoes(self, usuario_id: int, dados: ConfiguracaoSegurancaUpdateSchema):
        config = self.repo.obter_ou_criar(usuario_id)
        return self.repo.atualizar(config, dados.model_dump(exclude_unset=True))