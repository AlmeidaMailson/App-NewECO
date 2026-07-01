import { UserProfile } from "../utils/UserSessions";

export default class User implements UserProfile {
  // Propriedades alinhadas perfeitamente com o banco (FastAPI) e com a Sessão Global
  public id: number; // Mudado para number se o seu banco usar IDs sequenciais, ou mantido string se for UUID
  public nome: string;
  public email: string;
  public tipo?: string;         
  public eco_beneficios?: number; 
  public avatar_url?: string;    
  public bio?: string;
  public cidade?: string;
  public estado?: string;

  constructor(
    id: number | string,
    nome: string,
    email: string = "",
    avatar_url?: string,
    eco_beneficios: number = 0,
    tipo: string = "comum"
  ) {
    this.id = typeof id === "string" ? parseInt(id, 10) || Date.now() : id;
    this.nome = nome;
    this.email = email;
    this.avatar_url = avatar_url;
    this.eco_beneficios = eco_beneficios;
    this.tipo = tipo;
  }

  /**
   *  Método de conveniência para instanciar 
   * um usuário rapidamente a partir de um objeto JSON da API
   */
  static fromJSON(json: any): User {
    return new User(
      json.id,
      json.nome,
      json.email || "",
      json.avatar_url,
      json.eco_beneficios || 0,
      json.tipo || "comum"
    );
  }
}