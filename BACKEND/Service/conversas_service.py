from fastapi import HTTPException, status
from Repository.repository_conversas import repository_conversas
from Repository.user_repository import user_repository


def listar_conversas_ativas_do_usuario(db, usuario_id: int):
    """
    Regra de Negócio: Busca todas as conversas onde o usuário participa 
    com pessoas que ele segue, e prepara os dados para o frontend.
    """

    # Verificar se o usuário existe:

    if not usuario_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="id do uasuário é invalido "
        )
    
    #chama a query para buscar as conversas , que ja foi deinida no repository_conversas
    conversas_banco = repository_conversas.get_conversas_usuario_repository(db, usuario_id)
    
    if not conversas_banco:
        return []  # Retorna uma lisata vazia se não houver conversas ativas
    
    # 3. Formatação dos dados (DTO / Data Transfer Object)
    conversas_formatadas = []


