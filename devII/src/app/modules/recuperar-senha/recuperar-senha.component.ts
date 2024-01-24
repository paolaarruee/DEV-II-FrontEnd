import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
  
})
export class RecuperarSenhaComponent {
  constructor(
    private authService: AuthenticationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router : Router,
    ) {}
   
  emailRecuperacao = "";
  etapa : number = 0;
  token : string = "";
  senha : string = "";
  confirmarSenha : string = "";

  ngOnInit(): void {
    const { token } = this.activatedRoute.snapshot.params
    if(token != null){
      this.token = token;
      this.etapa = 2;
    }
  }

  recuperarSenha(): void {
    if (!this.isValidEmail(this.emailRecuperacao)) {
      this.toastService.showMessage("Email inválido", this.emailRecuperacao);
      return;
    }
    this.authService.recuperarSenha(this.emailRecuperacao).subscribe({
      next: () => {
        this.toastService.showMessage("Verifique a caixa de entrada do seu email!!");
        this.etapa = 1;
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showMessage("nenhum e-mail foi encontrado", "Tente novamente");
        } 
        this.toastService.showMessage("Ocorreu um erro", "Tente novamente");
      },
    });
  }

  validarToken(){
    this.authService.validarToken(this.token).subscribe({
      next: () => {
        this.toastService.showMessage("Token ativo!!");
        this.etapa = 2
        this.router.navigateByUrl(`/recuperarSenha/${this.token}`);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showMessage("Email não encontrado", "Tente novamente");
        } 
        this.toastService.showMessage("Ocorre um erro", "Tente novamente");
      },
    });
  }

  trocarSenha(){
    if(this.senha !== this.confirmarSenha){
      this.toastService.showMessage("Senhas não conferem", "Tente novamente");
      return;
    }
    this.authService.trocarSenha(this.senha, this.token).subscribe({
      next: () => {
        this.toastService.showMessage("Senha alterada com sucesso!!");
        this.router.navigateByUrl(`/login`);
      },
      error: (err) => {
        if (err.status === 404) {
          this.toastService.showMessage("Email não encontrado", "Tente novamente");
        } 
        this.toastService.showMessage("Ocorreu um erro", "Tente novamente");
      },
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
