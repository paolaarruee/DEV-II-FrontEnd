import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Role } from 'src/app/shared/interfaces/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public readonly Roles: typeof Role = Role;
  exibirLink: boolean = false;
  logado: boolean = false;
  navBarLinks: any;
  ultimoLink: HTMLElement | undefined;
  nomeUsuario: string = sessionStorage.getItem('nomeUsuario') || '';

  public constructor(private authService: AuthenticationService,  private router: Router) {}
    public logout(): void {
      this.authService.logout();
      this.router.navigateByUrl('/login').then(() => {
        window.location.reload();
      });
    }

    divClick(event : any): void {
      const a = event.target as HTMLElement;
      a.classList.add('div-ativa');
      if(this.ultimoLink != undefined && this.ultimoLink != a){
        this.ultimoLink.classList.remove('div-ativa');

      }
      if(this.ultimoLink == a){
        window.location.reload();
      }
      
      this.ultimoLink = a;
    }

    ngOnInit(): void {
      this.logado = this.authService.isAuthenticated;
      if(this.authService.role === 3 || this.authService.role === 2 || this.authService.role === 4)
        this.exibirLink = true;

      }

      public eServidor(): boolean {
        if(this.authService.role === Role.ROLE_SERVIDOR)
          return true;
        else if(this.authService.role === Role.ROLE_SESTAGIO)
          return true;
        else
          return false;
      }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }


}
