// src/models/User.ts
export default class User {
  constructor(
    public id: string,
    public nome: string,
    public tipo?: string,
    public ecoBeneficios?: number,
    public avatarUri?: string
  ) {}
}
