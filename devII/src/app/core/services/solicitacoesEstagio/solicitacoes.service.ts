import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SolicitacoesService {
  public constructor(private httpClient: HttpClient) {}

  deferirSolicitacao(id: number, dados: any, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('dados', JSON.stringify(dados));
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    return this.httpClient.patch<any>(
      `${environment.API_URL}/deferirSolicitacao/${id}`,
      formData
    );
  }

  indeferirSolicitacao(id: number, dados: any): Observable<any> {
    return this.httpClient.patch<any>(
      `${environment.API_URL}/indeferirSolicitacao/${id}`,
      dados
    );
  }

  listarSolicitacoes(): Observable<Solicitacoes[]> {
    const url = `${environment.API_URL}/listarSolicitacoes`;
    return this.httpClient.get<Solicitacoes[]>(url);
  }
}
