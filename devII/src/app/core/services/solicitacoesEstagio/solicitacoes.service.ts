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
    this.setProcessandoSolicitacao(id).subscribe();
    
    return this.httpClient.put<any>(
      `${environment.API_URL}/deferirSolicitacao/${id}`,
      formData
    );
  }

  setProcessandoSolicitacao(id: number): Observable<any> {
    return this.httpClient.post<any>(`${environment.API_URL}/setProcessando?id=${id}`, {});
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

  editarSolicitacao(id: number, solicitacao: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.API_URL}/editarSolicitacao?id=${id}`,
      solicitacao
    );
  }

  setValidadeContrato(
    id: number,
    dataFinalNova: string,
    dataInicioNova: string
  ): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.API_URL}/trocarValidadeContrato`,
      {
        params: {
          id: id.toString(),
          dataFinalNova: dataFinalNova,
          dataInicioNova: dataInicioNova,
        },
      }
    );
  }

  enviarRelatorioFinal(id: string, file: File[]): Observable<any> {
    const formData = new FormData();
    file.forEach((element) => {
      formData.append('file', element);
    });
    formData.append('id', id);
    return this.httpClient.post<any>(
      `${environment.API_URL}/salvarRelatorioFinal`,
      formData
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

  enviarCancelamento(id: string, file: File[]): Observable<any> {
    const formData = new FormData();
    file.forEach((element) => {
      formData.append('file', element);
    });
    formData.append('id', id);
    return this.httpClient.post<any>(
      `${environment.API_URL}/cancelarEstagio`,
      formData
    );
  }

  setEditarSolicitacao(id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.API_URL}/setEdicaoDocumentosSolicitacao`,
      { params: { id: id.toString() } }
    );
  }

  setEtapaSolicitacao(id: number, etapa: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.API_URL}/editarEtapa`, {
      params: { id: id.toString(), etapa: etapa.toString() },
    });
  }

  setObservacaoDaSolicitacao(id: number, text: String): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.API_URL}/editarobservacaoSolicitacao`,
      { params: { id: id.toString(), texto: text.toString() } }
    );
  }

  listarSolicitacoesPorEmailServidor(): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.API_URL}/listarSolicitacoesPorEmailServidor`, {})
      .pipe(
        map((solicitacoes: any[]) =>
          solicitacoes.map((solicitacao: Solicitacoes, i: number) => ({
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
