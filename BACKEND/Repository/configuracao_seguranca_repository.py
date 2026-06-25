from sqlalchemy.orm import Session
from models.configuracao_seguranca import ConfiguracaoSeguranca

class ConfiguracaoSegurancaRepository:
    def __init__(self, db: Session):
        self.db = db

    def obter_ou_criar(self, usuario_id: int) -> ConfiguracaoSeguranca:
        config = self.db.query(ConfiguracaoSeguranca).filter(ConfiguracaoSeguranca.usuario_id == usuario_id).first()
        if not config:
            config = ConfiguracaoSeguranca(usuario_id=usuario_id)
            self.db.add(config)
            self.db.commit()
            self.db.refresh(config)
        return config

    def atualizar(self, config: ConfiguracaoSeguranca, dados_dict: dict) -> ConfiguracaoSeguranca:
        for chave, valor in dados_dict.items():
            if valor is not None:
                setattr(config, chave, valor)
        self.db.commit()
        self.db.refresh(config)
        return config