import Message from "../models/Message";

export default class MessageFactory {
  static createText(authorId: string | number, content: string) {
    const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    
    return new Message(
      tempId,
      authorId.toString(), // Converte o id para string na hora de instanciar a classe
      content,
      "text",
      Date.now()
    );
  }

  static createSystem(content: string) {
    const tempId = `system-${Date.now()}`;
    
    return new Message(
      tempId,
      "system", 
      content,
      "system",
      Date.now()
    );
  }
}