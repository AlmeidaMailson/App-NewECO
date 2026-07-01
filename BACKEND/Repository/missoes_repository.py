from sqlalchemy import func, select, or_, and_
from sqlalchemy.orm import Session

from sqlalchemy.orm import Session
from models.missoes import Missao

class MissaoRepository:

    def listar_missoes_ativas(self, db: Session):
        """Busca todas as missões que estão ativas no momento"""
        return db.query(Missao).filter(Missao.ativo == True).all()

    def buscar_por_id(self, db: Session, missao_id: int):
        """Busca uma missão específica pelo ID"""
        return db.query(Missao).filter(Missao.id == missao_id).first()

    def deletar_missao(self, db: Session, missao_id: int):
        """Deleta uma missão do banco"""
        missao = self.buscar_por_id(db, missao_id)
        if missao:
            db.delete(missao)
            db.commit()
            return True
        return False
    def salvar_missao(self, db: Session, nova_missao: Missao):
        """Salva a missão gerada no banco de dados"""
        db.add(nova_missao)
        db.commit()
        db.refresh(nova_missao)
        return nova_missao

missao_repository = MissaoRepository()

def existe_missao_ativa(self, db: Session, titulo: str, local: str):
    return (
        db.query(Missao)
        .filter(
            Missao.titulo == titulo,
            Missao.local == local,
            Missao.ativo == True
        )
        .first()
    )