import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { Authorization, Usuario } from '../../shared/interfaces/usuario';
import { ToastService } from '../../core/services/toast/toast.service';
import { NgZone } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { jwtDecode } from 'jwt-decode';

declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm!: FormGroup;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.setLoginForm();
    this.carregarBotao();
  }

  carregarBotao() {
    google.accounts.id.renderButton(
      document.getElementById('buttonDiv'),
      { theme: 'outline', size: 'large', width: 400 } // customization attributes
    );
  }

  ngAfterViewInit(): void {
    window.loginComponentInstance = this;
    window.onload = () => {
      google.accounts.id.initialize({
        client_id:
          '478313855925-e7atlt49t165r6hbn6ssc10pfhqo7shp.apps.googleusercontent.com',
        callback: window.handleCredentialResponse.bind(this),
      });
      this.carregarBotao();
      google.accounts.id.prompt();
    };
  }

  public login(userData: Usuario) {
    this.authService.login(userData).subscribe({
      next: (authData: Authorization) => {
        this.authService.setAuthData(authData);
        if (
          authData.Roles.toLocaleString() === 'ROLE_SERVIDOR' ||
          authData.Roles.toLocaleString() === 'ROLE_SESTAGIO' ||
          authData.Roles.toLocaleString() === 'ROLE_DIRETOR'
        ) {
          const { id } = this.activatedRoute.snapshot.params;
          if (id != '' && id != undefined) {
            this.router.navigateByUrl('/analisedocs/' + id).then(() => {
              window.location.reload();
            });
          } else {
            this.router.navigateByUrl('/listaSolicitacoesServidor').then(() => {
              window.location.reload();
            });
          }
        } else {
          this.router.navigateByUrl('/listaSolicitacoesAluno').then(() => {
            window.location.reload();
          });
        }
      },
      error: (error) =>
        this.toastService.showMessage('Erro ao autenticar usuário.'),
    });
  }

  public cadastrar(authData: Authorization) {
    this.authService.setAuthData(authData);
    if (
      authData.Roles.toLocaleString() === 'ROLE_SERVIDOR' ||
      authData.Roles.toLocaleString() === 'ROLE_SESTAGIO'
    ) {
      this.router.navigateByUrl('/listaSolicitacoesServidor').then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigateByUrl('/listaSolicitacoesAluno').then(() => {
        window.location.reload();
      });
    }
  }

  private setLoginForm(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', Validators.required),
      senha: this.fb.control('', Validators.required),
    });
  }
}

declare global {
  interface Window {
    handleCredentialResponse(response: any): void;
    loginComponentInstance: LoginComponent;
  }
}

//@ts-ignore
window.handleCredentialResponse = (response) => {
  const data = jwtDecode(response.credential);
  console.log(response.credential);
  fetch(environment.API_URL + '/login/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: response.credential,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao fazer o POST para o back-end');
      }
      return response.json();
    })
    .then((data) => {
      if (window.loginComponentInstance) {
        window.loginComponentInstance.cadastrar(data);
      }
    })
    .catch((error) => {
      console.error('Erro ao fazer o POST:', error);
    });
};
