import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public constructor(private authService: AuthenticationService) {}

  public logout(): void {
    this.authService.logout();
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}
