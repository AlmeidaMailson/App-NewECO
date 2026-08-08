#  NewEco Link - Mobile App

**Status:  Em Desenvolvimento** Projeto Integrador focado em Economia Circular e Sustentabilidade, desenvolvido com **React Native**.

## Sobre o Projeto
O NewEco Link é uma solução tecnológica que visa conectar cidadãos, empresas e ONGs para promover o descarte correto e a reutilização de materiais. O projeto utiliza Inteligência Artificial e Geolocalização para facilitar a jornada sustentável do usuário.

## Tecnologias e Ferramentas
- **Framework:** React Native (Expo)
- **Linguagem:** JavaScript (ES6+) e Python
- **Backend:** FastAPI
- **Banco de Dados:** PostgreSQL
- **Estilização:** Styled Components / CSS-in-JS
- **Ambiente:** VS Code & Android Studio (Depuração via Wi-Fi/ADB)

##  Como executar
1. Clone o repositório: `git clone https://github.com/AlmeidaMailson/App-NewECO.git`
2. Instale as dependências: `npm install`
3. Inicie o projeto: `npx expo start`
## Para conexão do banco dados
1. No arquivo api.ts a linha 05 é a responsável pela a comunicação do front com backend(API), se você estiver usando um celular para rodar o app recomendo usar o localhost:800, se não usa o ip que a maquina recomenda com a porta:8000
2. abro terminal do VsCode:
   1.  digite cd BACKEND
   2.  digite .venv/bin/activate
   3.  digite pip install -r requirements.txt
   4.  digite uvicorn app.main:app --reload
  
      
   **Observação:** Esse código trabalha com WSL2(ubuntu no windows) e Docker Desktop. Os Passos dados acima são para quem não usa esse tipo de Ferramentas
   
