from pyngrok.conf import PyngrokConfig
from pyngrok import ngrok

pyngrok_config = PyngrokConfig(
    ngrok_path=r"C:\Ferramentas\ngrok\ngrok.exe"
)

ngrok.set_auth_token("SEU_TOKEN")

tunnel = ngrok.connect(8000, pyngrok_config=pyngrok_config)

print(tunnel.public_url)