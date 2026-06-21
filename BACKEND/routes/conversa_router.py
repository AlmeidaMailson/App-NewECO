from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.depedencies import get_db 
import Service.conversas_service as conversas_service

# Criamos o router especificando o prefixo da rota e a tag para a documentação do Swagger
router = APIRouter(
    prefix="/conversas",
    tags=["Conversas / Chat"]
)

@router.get("/", status_code=status.HTTP_200_OK)
def listar_conversas(
   usuario_id: int,
   db: Session = Depends(get_db) 
):
    try:
        conversas = conversas_service.listar_conversas_ativas_do_usuario(db, usuario_id)
        return conversas
    
    except HTTPException as http_err:
        # Repassa os erros tratados que vieram lá do Service (Ex: ID inválido)
        raise http_err
    except HTTPException as err:
        # Tratamento de erro genérico
        print(f"Erro interno no servidor: {str(err)}") # Em prod, use um logger de verdade
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro interno ao processar as conversas."
        )
    