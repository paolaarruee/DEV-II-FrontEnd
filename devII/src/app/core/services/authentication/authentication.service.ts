import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, map } from 'rxjs';

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
}
