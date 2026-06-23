from sqlalchemy.orm import Session
from models.mapa_verde import MapaVerdePonto
from schemas.mapa_verde_schema import MapaVerdeCreate
from Repository.repository_mapa_verde import mapa_verde_repository

class MapaVerdeService:

    def criar_ponto_manual(self, db: Session, esquema: MapaVerdeCreate):
        """Regra para criar um ponto vindo do painel administrativo (Swagger)"""
        ponto_model = MapaVerdePonto(
            nome=esquema.nome,
            tipo=esquema.tipo,
            descricao=esquema.descricao,
            latitude=esquema.latitude,
            longitude=esquema.longitude,
            recompensa=esquema.recompensa,
            ativo=True
        )
        return mapa_verde_repository.salvar_ponto(db, ponto_model)

    def listar_todos_os_pontos(self, db: Session):
        """Retorna a lista de pontos cadastrados"""
        return mapa_verde_repository.listar_pontos_ativos(db)
    
    def buscar_ponto_por_id(self, db: Session, ponto_id: int):
        """Busca um ponto específico no banco pelo ID através do Repository"""
        return mapa_verde_repository.buscar_por_id(db, ponto_id)

mapa_verde_service = MapaVerdeService()
