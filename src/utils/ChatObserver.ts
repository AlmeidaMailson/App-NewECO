
type Callback = (messages: any[]) => void;

export class ChatObserver {
  private observers: Set<Callback> = new Set();

  subscribe(cb: Callback) {
    this.observers.add(cb);
  }
  unsubscribe(cb: Callback) {
    this.observers.delete(cb);
  }
  notify(messages: any[]) {
    this.observers.forEach((cb) => cb(messages));
  }
}

export const chatObserver = new ChatObserver();
