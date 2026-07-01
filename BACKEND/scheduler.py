from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal

from Service.missoes_automacao_service import missoes_automacao_service

scheduler = BackgroundScheduler()

def gerar_missoes():
    db = SessionLocal()

    try:
        resultado = missoes_automacao_service.rodar_gerador_automatico(db)
        print(resultado)
    finally:
        db.close()


def iniciar_scheduler():
    scheduler.add_job(
        gerar_missoes,
        "interval",
        hours=10,  
        id="gerador_missoes",
        replace_existing=True
    )

    scheduler.start()