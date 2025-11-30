// src/utils/ChatBotSingleton.ts
import User from "../models/User";
import Message from "../models/Message";
import MessageFactory from "./MessageFactory";
import { chatObserver } from "./ChatObserver";

/**
 * ChatBotSingleton: instancia única do bot
 * - contém FAQs
 * - processa perguntas simples com palavras-chave
 * - notifica observers com array de mensagens
 */

class ChatBot {
  private static instance: ChatBot | null = null;
  private botId = "bot";
  private messages: Message[] = [];

  // Base de respostas (faça expandir conforme necessidade)
  private faq: { keys: string[]; answer: string }[] = [
    {
      keys: ["como postar", "publicar", "postar"],
      answer:
        "Para publicar: abra '+', escolha uma mídia, escreva a legenda e toque em 'Publicar'.",
    },
    {
      keys: ["como doar", "doar", "doação"],
      answer:
        "Para doar: acesse 'Troque e Doe', escolha o item e siga as instruções de doação.",
    },
    {
      keys: ["envio", "entrega", "entregar"],
      answer:
        "Entregas são feitas pelos motoboys cadastrados. Verifique o status em 'Meus pedidos'.",
    },
    {
      keys: ["eco", "ecobeneficios"],
      answer:
        "EcoBeneficios são ganhos ao completar missões e podem ser trocados por descontos na loja.",
    },
    {
      keys: ["ajuda", "suporte", "contato"],
      answer:
        "Abra 'Suporte' no menu ou envie um e-mail para suporte@neweco.link. Estamos aqui para ajudar!",
    },
    {
      keys: ["mapa", "mapa verde"],
      answer:
        "O Mapa Verde mostra pontos de coleta e parceiros próximos. Abra a tela 'Mapa Verde' para ver.",
    },
  ];

  private constructor() {
    // mensagem de boas-vindas
    const welcome = MessageFactory.createText(
      this.botId,
      "Olá! Eu sou o assistente do NewEco Link. Pergunte algo sobre o app."
    );
    this.messages.push(welcome);
  }

  static getInstance() {
    if (!ChatBot.instance) ChatBot.instance = new ChatBot();
    return ChatBot.instance;
  }

  getMessages() {
    return this.messages;
  }

  // recebe mensagem do usuário e responde
  async receiveMessage(user: User, content: string) {
    const userMsg = MessageFactory.createText(user.id, content);
    this.messages.push(userMsg);
    chatObserver.notify(this.messages.slice()); // notifica subscribers

    // simula processamento assíncrono (poderia buscar API)
    setTimeout(() => {
      const resposta = this.makeResponse(content);
      const botMsg = MessageFactory.createText(this.botId, resposta);
      this.messages.push(botMsg);
      chatObserver.notify(this.messages.slice());
    }, 600); // delay curto pra simular "pensamento"
  }

  private makeResponse(content: string): string {
    const lower = content.toLowerCase();

    // procura por palavra-chave
    for (const item of this.faq) {
      if (item.keys.some((k) => lower.includes(k))) return item.answer;
    }

    return (
      "Desculpe, não entendi. Tente perguntar ‘como postar’, ‘como doar’ ou 'suporte'."
    );
  }
}

export default ChatBot;
