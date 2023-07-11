import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DocFile } from 'src/app/shared/interfaces/doc';
import { SolicitacaoIndeferir } from 'src/app/shared/interfaces/solicitacao-indeferir';
import { Solicitacoes } from 'src/app/shared/interfaces/solicitacoes';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SolicitacoesService {
  setSolicitacao(solicitacao: any) {
    throw new Error('Method not implemented.');
  }
  public constructor(private httpClient: HttpClient) {}

  deferirSolicitacao(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put<any>(
      `${environment.API_URL}/deferirSolicitacao/${id}`,
      formData
    );
  }

 

  indeferirSolicitacao(
    id: number,
    dados: SolicitacaoIndeferir
  ): Observable<any> {
    return this.httpClient.put<any>(
      `${environment.API_URL}/indeferirSolicitacao/${id}`,
      dados
    );
  }

  listarSolicitacoes(): Observable<Solicitacoes[]> {
    const url = `${environment.API_URL}/listarSolicitacoes`;
    return this.httpClient.get<Solicitacoes[]>(url);
  }

  getStudentData(id: number): Observable<any> {
    const url = `${environment.API_URL}/alunoSolicitacao/${id}`;
    return this.httpClient.get<any>(url);
  }

  getSolicitacoesData(id: number): Observable<any> {
    const url = `${environment.API_URL}/solicitacao/${id}`;
    return this.httpClient.get<any>(url);
  }

  getlistDocsPorEstagioId(id: number): Observable<DocFile[]> {
    return this.httpClient.get<DocFile[]>(
      `${environment.API_URL}/listarDocumento/${id}`
    );
  }

  listarSolicitacoesPorEmailServidor(): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.API_URL}/listarSolicitacoesPorEmailServidor`, {})
      .pipe(
        map((solicitacoes: any[]) =>
          solicitacoes.map((solicitacao: any, i: number) => ({
             //id: i + 1,
            ...solicitacao,
          }))
        )
      );
  }

  obterSolicitacoes(): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.API_URL}/listarSolicitacoesPorEmailServidor`
    );
  }
}
