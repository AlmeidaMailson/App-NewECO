from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.depedencies import get_db 
import Service.conversas_service as conversas_service

#  Importa a dependência do token JWT e o modelo de Usuário
from core.deps import obter_usuario_atual
from models.user import User as Usuario

# Criamos o router especificando o prefixo da rota e a tag para a documentação do Swagger
router = APIRouter(
    prefix="/conversas",
    tags=["Conversas / Chat"]
)

@router.get("/", status_code=status.HTTP_200_OK)
def listar_conversas(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario_atual) # Rota protegida por Token
):
    try:
        #  SAFEVOTE: Agora passamos o ID direto do usuário autenticado pelo token
        conversas = conversas_service.listar_conversas_ativas_do_usuario(db, usuario_logado.id)
        return conversas
    
    except HTTPException as http_err:
        # Repassa os erros tratados que vieram lá do Service (Ex: 404, 400)
        raise http_err
    except Exception as err: # Corrigido de HTTPException para Exception (captura erros reais do sistema)
        # Tratamento de erro genérico
        print(f"Erro interno no servidor: {str(err)}") # Em prod, use um logger de verdade
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro interno ao processar as conversas."
        )