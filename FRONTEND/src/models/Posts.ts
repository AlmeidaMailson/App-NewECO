// Importa a interface que criamos no UserSessions para tipar o dono do post
import { UserProfile } from "../utils/UserSessions";

export default class Post {
  id: string;
  user: UserProfile;    //  Agora temos acesso ao nome, avatar e ID do autor do post
  image: string;        // URL da imagem da publicação sustentável
  caption: string;      // Legenda/Texto do post
  likedUsers: string[]; //  Array com os IDs de quem curtiu (substitui o número puro)
  createdAt: number;    // Timestamp para ordenação cronológica do feed

  constructor(
    id: string,
    user: UserProfile,
    image: string,
    caption: string,
    likedUsers: string[] = [],
    createdAt: number = Date.now()
  ) {
    this.id = id;
    this.user = user;
    this.image = image;
    this.caption = caption;
    this.likedUsers = likedUsers;
    this.createdAt = createdAt;
  }

  /**
   * Retorna a quantidade total de curtidas dinamicamente
   */
  get likesCount(): number {
    return this.likedUsers.length;
  }

  /**
   * Verifica se um usuário específico (o logado) curtiu este post
   */
  hasLiked(userId: string | number): boolean {
    return this.likedUsers.includes(userId.toString());
  }

  /**
   * Altera o estado do like de forma segura baseado no ID do usuário
   */
  toggleLike(userId: string | number): boolean {
    const userIdStr = userId.toString();
    const index = this.likedUsers.indexOf(userIdStr);

    if (index === -1) {
      this.likedUsers.push(userIdStr); // Adiciona o like
      return true; // Retorna true se curtiu
    } else {
      this.likedUsers.splice(index, 1); // Remove o like (Unlike)
      return false; // Retorna false se descurtiu
    }
  }
}