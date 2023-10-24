import { Component, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { Authorization, Usuario } from '../../shared/interfaces/usuario';
import { ToastService } from '../../core/services/toast/toast.service';
import { NgZone } from '@angular/core';
import { environment } from 'src/environments/environment.development';


declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  
  public constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private ngZone: NgZone
  ) {}

 
 
  ngOnInit(): void {
    this.setLoginForm();
    window.loginComponentInstance = this;

    google.accounts.id.initialize({
      client_id: "608337993679-jbh57642rjhkuuaefg5lik3vol1tk4jc.apps.googleusercontent.com",
      callback: window.handleCredentialResponse.bind(this),
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt();
  }


  

  public login(userData: Usuario) {
    this.authService.login(userData).subscribe({
      next: (authData: Authorization) => {
        this.authService.setAuthData(authData);
        if (
          authData.Roles.toLocaleString() === 'ROLE_SERVIDOR' || authData.Roles.toLocaleString() === 'ROLE_SESTAGIO'
        ) {
          this.router.navigateByUrl('/listaSolicitacoesServidor').then(() => {
            window.location.reload();
          });
        } else {
          this.router.navigateByUrl('/oportunidades').then(() => {
            window.location.reload();
          });
        }
      },
      error: () => this.toastService.showMessage('Erro ao autenticar usuário.'),
    });
  }


  

   public cadastrar(authData : Authorization) {
    this.authService.setAuthData(authData);
    if (
      authData.Roles.toLocaleString() === 'ROLE_SERVIDOR' || authData.Roles.toLocaleString() === 'ROLE_SESTAGIO'
    ) {
      this.router.navigateByUrl('/listaSolicitacoesServidor').then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigateByUrl('/oportunidades').then(() => {
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
  //@ts-ignore
  const data = jwt_decode(response.credential)
  alert(data);
  console.log( data );
  fetch(environment.API_URL+"/login/google", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao fazer o POST para o back-end');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Resposta do back-end:', data);
      if (window.loginComponentInstance) {
        window.loginComponentInstance.cadastrar(data);
      }
    })
    .catch((error) => {
      console.error('Erro ao fazer o POST:', error);
    });
}






