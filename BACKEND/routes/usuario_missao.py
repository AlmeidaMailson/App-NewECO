from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from  app.depedencies import get_db
from schemas.usuario_missao import RegistrarProgressoSchema, UsuarioMissaoResponse
from Service.usuario_missao import UsuarioMissaoService

router = APIRouter(prefix="/missoes", tags=["Missões do Usuário"])

@router.get("/usuario/{usuario_id}")
def listar_missoes_usuario(usuario_id: int, db: Session = Depends(get_db)):
    service = UsuarioMissaoService(db)
    return service.listar_com_progresso(usuario_id)

@router.post("/progresso", response_model=UsuarioMissaoResponse)
def registrar_progresso(dados: RegistrarProgressoSchema, db: Session = Depends(get_db)):
    service = UsuarioMissaoService(db)
    return service.registrar_progresso_missao(dados.usuario_id, dados.missao_id)