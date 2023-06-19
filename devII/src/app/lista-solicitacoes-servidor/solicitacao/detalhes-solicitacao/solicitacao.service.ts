import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private solicitacao: any;

  constructor(
    private http: HttpClient,
    @Inject(AuthenticationService) private authService: AuthenticationService
  ) { }

  getSolicitacao(): any {
    return this.solicitacao;
  }

  setSolicitacao(solicitacao: any): void {
    this.solicitacao = solicitacao;
  }

  listarSolicitacoesPorEmailServidor(): Observable<any> {
    const token = this.authService.token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${environment.API_URL}/listarSolicitacoesPorEmailServidor`, { headers });
  }
}
