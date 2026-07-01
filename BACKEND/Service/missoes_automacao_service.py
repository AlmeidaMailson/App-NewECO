import random
from sqlalchemy.orm import Session

from models.mapa_verde import MapaVerdePonto
from models.missoes import Missao
from Repository.missoes_repository import missao_repository

TEMPLATES_MISSOES = [
    {
        "titulo": "Guerreiro do Plástico",
        "descricao": "Vá até ao ponto '{ponto_nome}' e descarte pelo menos 5 garrafas PET para reciclagem.",
        "tema": "Plástico"
    },
    {
        "titulo": "Descarte Eletrônico Consciente",
        "descricao": "Leve pilhas ou cabos velhos até '{ponto_nome}'.",
        "tema": "Eletrônicos"
    },
    {
        "titulo": "Mestre do Vidro",
        "descricao": "Descarte recipientes de vidro corretamente em '{ponto_nome}'.",
        "tema": "Vidro"
    },
    {
        "titulo": "Herói do Papel",
        "descricao": "Leve jornais e papelão para reciclagem em '{ponto_nome}'.",
        "tema": "Papel"
    },
    {
        "titulo": "Recicle o Metal",
        "descricao": "Descarte latinhas e outros metais em '{ponto_nome}'.",
        "tema": "Metal"
    },
    {
        "titulo": "Óleo Consciente",
        "descricao": "Leve óleo de cozinha usado para o ponto '{ponto_nome}'.",
        "tema": "Óleo"
    }
]


class MissoesAutomacaoService:

    def rodar_gerador_automatico(self, db: Session):

        pontos = (
            db.query(MapaVerdePonto)
            .filter(MapaVerdePonto.ativo == True)
            .all()
        )

        if not pontos:
            return {
                "status": "erro",
                "mensagem": "Nenhum ponto ativo encontrado."
            }

        missoes_criadas = 0

        for ponto in pontos:

            template = random.choice(TEMPLATES_MISSOES)

            existe = missao_repository.existe_missao_ativa(
    db,
    template["titulo"],
    ponto.nome
)
            if existe:
                continue

            recompensa = random.randint(30, 200)

            total_acoes = random.randint(1, 5)

            descricao = template["descricao"].format(
                ponto_nome=ponto.nome
            )

            nova_missao = Missao(
                titulo=template["titulo"],
                descricao=descricao,
                recompensa=recompensa,
                total_acoes=total_acoes,
                local=ponto.nome,
                tema=template["tema"],
                mapa_verde_ponto_id=ponto.id,
                ativo=True
            )

            missao_repository.salvar_missao(db, nova_missao)

            missoes_criadas += 1

        return {
            "status": "sucesso",
            "missoes_criadas": missoes_criadas,
            "mensagem": f"{missoes_criadas} missões foram geradas automaticamente."
        }


missoes_automacao_service = MissoesAutomacaoService()