
import Message from "../models/Message";

export default class MessageFactory {
  static createText(authorId: string, content: string) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    return new Message(id, authorId, content, "text", Date.now());
  }

  static createSystem(content: string) {
    return this.createText("system", content);
  }
}
