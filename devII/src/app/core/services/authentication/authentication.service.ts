import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, catchError, map } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import { Usuario, Authorization } from 'src/app/shared/interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly TOKEN_KEY: string = 'token';

  public constructor(private http: HttpClient, private router: Router) {}

  public login(userData: Usuario): Observable<string> {
    return this.http
      .post<Authorization>(`${environment.API_URL}/login`, userData)
      .pipe(map(({ Authorization }: Authorization) => Authorization));
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigateByUrl('/login');
  }

  public get isAuthenticated(): boolean {
    return !!this.token;
  }

  public get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public set token(authToken: string | null) {
    authToken && localStorage.setItem(this.TOKEN_KEY, authToken);
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
