from sqlalchemy.orm import Session
from Repository.configuracao_privacidade_Repository import ConfiguracaoPrivacidadeRepository
from schemas.configuracao_privacidade_schema import ConfiguracaoPrivacidadeUpdateSchema

class ConfiguracaoPrivacidadeService:
    def __init__(self, db: Session):
        self.repo = ConfiguracaoPrivacidadeRepository(db)

    def buscar_configuracoes(self, usuario_id: int):
        return self.repo.obter_ou_criar(usuario_id)

    def atualizar_configuracoes(self, usuario_id: int, dados: ConfiguracaoPrivacidadeUpdateSchema):
        config = self.repo.obter_ou_criar(usuario_id)
        return self.repo.atualizar(config, dados.model_dump(exclude_unset=True))