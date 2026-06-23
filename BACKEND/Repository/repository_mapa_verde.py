from sqlalchemy.orm import Session
from models.mapa_verde import MapaVerdePonto

class MapaVerdeRepository:

    def salvar_ponto(self, db: Session, novo_ponto: MapaVerdePonto):
        """Salva um ponto no banco (usado na criação individual ou na importação)"""
        db.add(novo_ponto)
        db.commit()
        db.refresh(novo_ponto)
        return novo_ponto

    def listar_pontos_ativos(self, db: Session):
        """Busca todos os pontos ecológicos ativos para mostrar no mapa"""
        return db.query(MapaVerdePonto).filter(MapaVerdePonto.ativo == True).all()

    def buscar_por_id(self, db: Session, ponto_id: int):
        """Busca um ponto específico pelo ID"""
        return db.query(MapaVerdePonto).filter(MapaVerdePonto.id == ponto_id).first()

mapa_verde_repository = MapaVerdeRepository()