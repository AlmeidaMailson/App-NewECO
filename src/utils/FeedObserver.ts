type CallbackFunction = () => void;

class FeedObserver {
  private observers: CallbackFunction[] = [];

  // registrar quem quer ser avisado
  subscribe(callback: CallbackFunction) {
    this.observers.push(callback);
  }

  // tirar da lista (quando sair da tela)
  unsubscribe(callback: CallbackFunction) {
    this.observers = this.observers.filter(cb => cb !== callback);
  }

  // notificar todos
  notify() {
    this.observers.forEach(cb => cb());
  }
}

export const feedObserver = new FeedObserver();
