export class AppConstants {
  public static get baseServidor(): string {return "http://localhost:8088"}
  public static get baseLogin(): string {return this.baseServidor+"/assinaturaapi/login"}
  public static get baseUrl(): string {return this.baseServidor+"/assinaturaapi/****/"}
}

