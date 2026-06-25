from sqlalchemy.orm import Session
from models.configuracao_privacidade import ConfiguracaoPrivacidade

class ConfiguracaoPrivacidadeRepository:
    def __init__(self, db: Session):
        self.db = db

    def obter_ou_criar(self, usuario_id: int) -> ConfiguracaoPrivacidade:
        config = self.db.query(ConfiguracaoPrivacidade).filter(ConfiguracaoPrivacidade.usuario_id == usuario_id).first()
        if not config:
            config = ConfiguracaoPrivacidade(usuario_id=usuario_id)
            self.db.add(config)
            self.db.commit()
            self.db.refresh(config)
        return config

    def atualizar(self, config: ConfiguracaoPrivacidade, dados_dict: dict) -> ConfiguracaoPrivacidade:
        for chave, valor in dados_dict.items():
            if valor is not None:
                setattr(config, chave, valor)
        self.db.commit()
        self.db.refresh(config)
        return config