import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { Authorization, Usuario } from '../../shared/interfaces/usuario';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  public constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.setLoginForm();
  }

  public login(userData: Usuario) {
    this.authService.login(userData).subscribe(
      {
        next: (authData: Authorization) => {
          this.authService.setAuthData(authData);
          if (authData.Roles.toLocaleString() === 'ROLE_SERVIDOR') {
            this.router.navigateByUrl('/listaSolicitacoesServidor').then(() => {
              window.location.reload();
            });
          } else {
            this.router.navigateByUrl('/listaSolicitacoesAluno').then(() => {
              window.location.reload();
            });
        }
        },
        error: () => this.toastService.showMessage('Erro ao autenticar usuário.'),
      }
    );
  }

  public cadatrar() {
    alert('em contrução');
  }

  private setLoginForm(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', Validators.required),
      senha: this.fb.control('', Validators.required),
    });
  }
}
