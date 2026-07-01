import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface clara do Usuário para habilitar o IntelliSense (Autocompletar) no app todo
export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  cidade?: string;
  estado?: string;
  perfil_privado?: boolean;
  ocultar_localizacao?: boolean;
  status_invisivel?: boolean;
  dois_fatores?: boolean;
  alertas_login?: boolean;
  filtro_mensagens?: boolean;
  [key: string]: any; // Flexibilidade para outros campos vindos do FastAPI
}

class UserSession {
  private static instance: UserSession;
  // Substituído 'any' pela nossa Interface tipada
  private userData: UserProfile | null = null;

  private constructor() {}

  public static getInstance(): UserSession {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }
    return UserSession.instance;
  }

  /**
   * Define o usuário em memória e sincroniza imediatamente no armazenamento local persistente
   */
  async setUser(data: UserProfile) {
    this.userData = data;
    try {
      await AsyncStorage.setItem("@NewEco:user", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao persistir sessão do usuário localmente:", error);
    }
  }

  /**
   * Retorna os dados do usuário guardados em memória RAM de forma síncrona
   */
  getUser(): UserProfile | null {
    return this.userData;
  }

  /**
   * O PULO DO GATO: Carrega os dados salvos do disco para a memória na inicialização do App.
   * Deve ser chamada uma única vez no topo do seu projeto (Ex: App.tsx ou nas Rotas).
   */
  async loadStoredSession(): Promise<boolean> {
    try {
      const storedData = await AsyncStorage.getItem("@NewEco:user");
      if (storedData) {
        this.userData = JSON.parse(storedData);
        return true; // Existe uma sessão válida ativa
      }
    } catch (error) {
      console.error("Erro ao carregar sessão persistida:", error);
    }
    return false; // Nenhuma sessão encontrada
  }

  /**
   * Limpa os dados da memória e remove o registro do disco (Logout seguro)
   */
  async clear() {
    this.userData = null;
    try {
      await AsyncStorage.removeItem("@NewEco:user");
      await AsyncStorage.removeItem("@NewEco:token"); // Limpa o token JWT se houver
    } catch (error) {
      console.error("Erro ao limpar dados de sessão:", error);
    }
  }
}

export default UserSession;