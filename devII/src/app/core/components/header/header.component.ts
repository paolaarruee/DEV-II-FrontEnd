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


  public constructor(private authService: AuthenticationService,  private router: Router) {}

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });

  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}
