type CallbackFunction = () => void;

class FeedObserver {
  private observers: CallbackFunction[] = [];

  // Registrar quem quer ser avisado
  subscribe(callback: CallbackFunction) {
    // PROTEÇÃO SÊNIOR: Evita duplicar a mesma função na lista de ouvintes
    if (this.observers.includes(callback)) return;
    
    this.observers.push(callback);
  }

  // Tirar da lista (quando sair da tela)
  unsubscribe(callback: CallbackFunction) {
    this.observers = this.observers.filter(cb => cb !== callback);
  }

  // Notificar todos de forma segura
  notify() {
    this.observers.forEach(cb => {
      try {
        if (typeof cb === 'function') {
          cb();
        }
      } catch (error) {
        console.error("Erro ao executar callback do FeedObserver:", error);
      }
    });
  }
}

// Exporta uma única instância global (Singleton) para o app inteiro compartilhar a mesma lista
export const feedObserver = new FeedObserver();