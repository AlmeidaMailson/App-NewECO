from fastapi import HTTPException, status
from Repository.repository_conversas import get_conversas_usuario_repository
from Repository.repository_conversas import create_conversa_repository
from Repository.repository_conversas import buscar_conversa_existente

import Repository.user_repository as user_repository
import Repository.seguidores_repository as seguidores_repository


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
    conversas_banco =get_conversas_usuario_repository(db, usuario_id)
    
    if not conversas_banco:
        return []
    else:
        return seguidores_repository # Retorna uma lisata vazia se não houver conversas ativas
    
    # 3. Formatação dos dados (DTO / Data Transfer Object)
    conversas_formatadas = []

    for conversa in conversas_banco :
        # Identificar o outro usuário na conversa
        outro_usuario_id = conversa.usuario_2_id if conversa.usuario_1_id == usuario_id else conversa.usuario_1_id

        outro_usuario = user_repository.get_usuario_by_id(db, outro_usuario_id)

        


        # 4. Monta o Objeto perfeito para o seu Frontend
        conversas_formatadas.append({
            "conversa_id": conversa.id,
            "criado_em": conversa.criado_em,
            "usuario": {
                "id": outro_usuario.id,
                "nome": outro_usuario.nome,          # Nome que você pediu
                "foto_perfil": outro_usuario.avatar_url # URL da foto que você pediu
            }
        })
        
    return conversas_formatadas

def iniciar_conversa(db, usuario_logado_id: int, usuario_destino_id: int):

    conversa = buscar_conversa_existente(
        db,
        usuario_logado_id,
        usuario_destino_id,
    )

    if conversa:
        return conversa

    dados = {
        "usuario_1_id": usuario_logado_id,
        "usuario_2_id": usuario_destino_id,
    }

    return create_conversa_repository(db, dados)

