import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import { Usuario, Authorization, Role } from 'src/app/shared/interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly TOKEN_KEY: string = 'token';
  private readonly ROLE_KEY: string = 'role';

  public constructor(private http: HttpClient, private router: Router) {}

  public login(userData: Usuario): Observable<Authorization> {
    return this.http.post<Authorization>(
      `${environment.API_URL}/login`,
      userData
    );
  }

  public logout(): void {
    this.removeAuthData();
    this.router.navigateByUrl('/login');
  }

  public setAuthData({ Authorization, Roles }: Authorization): void {
    localStorage.setItem(this.TOKEN_KEY, Authorization);
    localStorage.setItem(this.ROLE_KEY, JSON.stringify(Role[Roles]));
  }

  public get isAuthenticated(): boolean {
    return !!this.token && !!this.role;
  }

  public get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public get role(): Role | null {
    const roleAsString: string | null = localStorage.getItem(this.ROLE_KEY);

    if (!roleAsString) {
      return null;
    }
    
    return JSON.parse(roleAsString);
  }

  private removeAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }
}
