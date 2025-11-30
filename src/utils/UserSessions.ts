class UserSession {
  private static instance: UserSession;
  private userData: any = null;

  private constructor() {}

  public static getInstance() {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }
    return UserSession.instance;
  }

  setUser(data: any) {
    this.userData = data;
  }

  getUser() {
    return this.userData;
  }

  clear() {
    this.userData = null;
  }
}

export default UserSession;
