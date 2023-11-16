import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { Observable, catchError, map } from 'rxjs';


import { environment } from 'src/environments/environment.development';
import { Usuario, Authorization, Role } from 'src/app/shared/interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly TOKEN_KEY: string = 'Authorization';
  private readonly ROLE_KEY: string = 'Roles';

  public constructor(private http: HttpClient, private router: Router) {}

  public login(userData: Usuario): Observable<Authorization> {
    return this.http.post<Authorization>(
      `${environment.API_URL}/login`,
      userData
    );
  }

  logingoogle(data: any) {
    return this.http.get(`${environment.API_URL}/login/google`,data);
  }

  public logout(): void {
    this.removeAuthData();
    this.router.navigateByUrl('/login');
  }

  public setAuthData({ Authorization, Roles }: Authorization): void {
    sessionStorage.setItem(this.TOKEN_KEY, Authorization);
    sessionStorage.setItem(this.ROLE_KEY, JSON.stringify(Role[Roles]));
  
  }

  public get isAuthenticated(): boolean {
    return !!this.token && !!this.role;
  }

  public get token(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  public get role(): Role | null {
    const roleAsString: string | null = sessionStorage.getItem(this.ROLE_KEY);

    if (!roleAsString) {
      return null;
    }

    return JSON.parse(roleAsString);
  }

  private removeAuthData(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.ROLE_KEY);
  }

  public getUsuarioPorEmail(email: string): Observable<any> {
    const url = `http://localhost:8088/buscarServidoresPorEmail/${email}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const servidorEncontrado = response;

        if (servidorEncontrado) {
          const userId = servidorEncontrado.usuarioSistema.id;
          // Faça o que você precisa com o ID do usuário...
          // ...
        }

        return servidorEncontrado;
      }),
      catchError((error: any) => {
        console.error('Erro ao obter o tipo de usuário:', error);
        // Tratar o erro, se necessário...
        // ...
        throw error; // Lançar o erro novamente para que seja tratado na chamada original
      })
    );
  }

}
