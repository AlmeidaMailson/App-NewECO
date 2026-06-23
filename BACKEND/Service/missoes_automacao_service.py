import random
from sqlalchemy.orm import Session
from models.mapa_verde import MapaVerdePonto
from models.missoes import Missao
from Repository.missoes_repository import missao_repository 

# Templates que o robô vai usar para criar os desafios
TEMPLATES_MISSOES = [
    {
        "titulo": "Guerreiro do Plástico",
        "descricao": "Vai até ao ponto '{ponto_nome}' e descarta pelo menos 5 garrafas PET para reciclagem.",
        "recompensa": 50,
        "tema": "Plástico"
    },
    {
        "titulo": "Descarte Eletrónico Consciente",
        "descricao": "Leva pilhas ou cabos velhos que tens em casa até ao '{ponto_nome}'.",
        "recompensa": 80,
        "tema": "Eletrónicos"
    },
    {
        "titulo": "Mestre do Vidro",
        "descricao": "Ajuda a comunidade descartando recipientes de vidro de forma segura no '{ponto_nome}'.",
        "recompensa": 60,
        "tema": "Vidro"
    }
]

class MissoesAutomacaoService:
    
    def rodar_gerador_automatico(self, db: Session):
        # 1. Procura todos os pontos do mapa que estão ativos no banco (os 70 que importaste!)
        pontos_disponiveis = db.query(MapaVerdePonto).filter(MapaVerdePonto.ativo == True).all()

        if not pontos_disponiveis:
            return {"status": "erro", "mensagem": "Nenhum ponto do mapa ativo encontrado no banco de dados."}

        # 2. Sorteia UM ponto real de Brasília e UM template da lista
        ponto_sorteado = random.choice(pontos_disponiveis)
        template_sorteado = random.choice(TEMPLATES_MISSOES)

        # 3. Monta a descrição trocando o marcador pelo nome real do ponto ecológico
        descricao_final = template_sorteado["descricao"].format(ponto_nome=ponto_sorteado.nome)

        # 4. Instancia o modelo da Missão
        nova_missao = Missao(
            titulo=template_sorteado["titulo"],
            descricao=descricao_final,
            recompensa=template_sorteado["recompensa"],
            total_acoes=1,
            local=ponto_sorteado.nome,
            tema=template_sorteado["tema"],
            mapa_verde_ponto_id=ponto_sorteado.id,
            ativo=True
        )

        # 5. O Repository entra em ação para gravar no banco
        missao_salva = missao_repository.salvar_missao(db, nova_missao)

        return {
            "status": "sucesso", 
            "mensagem": f"Missão '{missao_salva.titulo}' gerada automaticamente no ponto '{ponto_sorteado.nome}'!"
        }

missoes_automacao_service = MissoesAutomacaoService()