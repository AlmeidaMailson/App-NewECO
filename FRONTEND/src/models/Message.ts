// src/models/Message.ts
export type MessageType = "text" | "image" | "system";

export default class Message {
  id: string;
  authorId: string; // user id or 'bot'
  content: string;
  createdAt: number;
  type: MessageType;

  constructor(
    id: string,
    authorId: string,
    content: string,
    type: MessageType = "text",
    createdAt: number = Date.now()
  ) {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.type = type;
    this.createdAt = createdAt;
  }
}
