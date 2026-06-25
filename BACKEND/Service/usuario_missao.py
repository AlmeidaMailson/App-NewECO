from fastapi import HTTPException
from sqlalchemy.orm import Session
from Repository.usuario_missao import UsuarioMissaoRepository
from models.missoes import Missao  # Ajuste conforme seu arquivo antigo de missões
from models.usuario_missao import UsuarioMissao

class UsuarioMissaoService:
    def __init__(self, db: Session):
        self.repo = UsuarioMissaoRepository(db)
        self.db = db

    def listar_com_progresso(self, usuario_id: int):
        # Regra de negócio: mapeia todas as missões do sistema vinculando o progresso atual do usuário
        missoes = self.db.query(Missao).filter(Missao.ativo == True).all()
        resposta = []
        
        for missao in missoes:
            progresso_usuario = self.repo.buscar_progresso(usuario_id, missao.id)
            resposta.append({
                "id": missao.id,
                "titulo": missao.titulo,
                "descricao": missao.descricao,
                "recompensa": missao.recompensa,
                "total_acoes": missao.total_acoes,
                "local": missao.local,
                "tema": missao.tema,
                "ativo": missao.ativo,
                "progresso_atual": progresso_usuario.progresso if progresso_usuario else 0
            })
        return resposta

    def registrar_progresso_missao(self, usuario_id: int, missao_id: int) -> UsuarioMissao:
        missao = self.db.query(Missao).filter(Missao.id == missao_id).first()
        if not missao:
            raise HTTPException(status_code=404, detail="Missão não encontrada")

        reg_progresso = self.repo.buscar_progresso(usuario_id, missao_id)
        if not reg_progresso:
            reg_progresso = self.repo.criar_progresso_inicial(usuario_id, missao_id)

        if reg_progresso.concluida:
            raise HTTPException(status_code=400, detail="Esta missão já foi concluída por este usuário")

        reg_progresso.progresso += 1

        # Se bateu a meta, conclui e gera os pontos
        if reg_progresso.progresso >= missao.total_acoes:
            reg_progresso.concluida = True
            self.repo.adicionar_historico_pontos(usuario_id, missao_id, missao.titulo, missao.recompensa)

        self.repo.commit()
        self.repo.refresh(reg_progresso)
        return reg_progresso