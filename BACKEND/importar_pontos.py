import json
from app.database import SessionLocal
from models.mapa_verde import MapaVerdePonto
from Repository.repository_mapa_verde import mapa_verde_repository

def importar_geojson_para_banco(caminho_geojson: str):
    db = SessionLocal()
    print("🚀 Iniciando a importação do GeoJSON usando o Repository...")
    
    try:
        with open(caminho_geojson, mode='r', encoding='utf-8') as arquivo:
            dados = json.load(arquivo)
            pontos_adicionados = 0
            pontos_pulados = 0
            
            for feature in dados.get('features', []):
               
                geometria = feature.get('geometry')
                if not geometria or geometria.get('type') != 'Point':
                    pontos_pulados += 1
                    continue  
                
                coordenadas = geometria.get('coordinates', [])
                if len(coordenadas) < 2:
                    pontos_pulados += 1
                    continue 
                
                longitude = coordenadas[0]
                latitude = coordenadas[1]
                
                propriedades = feature.get('properties', {})
                nome_ponto = propriedades.get('name', 'Ponto de Reciclagem Comunitário')
                tipo_ponto = propriedades.get('recycling_type', 'Coleta Seletiva')
                
               
                materiais = [key.split(':')[-1] for key, val in propriedades.items() if key.startswith('recycling:') and val == 'yes']
                materiais_str = f" Aceita: {', '.join(materiais)}." if materiais else ""
                descricao_ponto = f"Ponto de coleta mapeado via OpenStreetMap público.{materiais_str}"
                
                novo_ponto = MapaVerdePonto(
                    nome=nome_ponto,
                    tipo=tipo_ponto,
                    descricao=descricao_ponto,
                    latitude=latitude,
                    longitude=longitude,
                    recompensa=25,
                    ativo=True
                )
                
                mapa_verde_repository.salvar_ponto(db, novo_ponto)
                pontos_adicionados += 1
                
        print(f"\n Importação concluída com sucesso!")
        print(f"  Pontos reais de Brasília salvos: {pontos_adicionados}")
        print(f"  Elementos complexos ignorados (vias/áreas): {pontos_pulados}")
            
    except Exception as e:
        print(f"  Erro crítico: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    importar_geojson_para_banco("pontos.geojson")