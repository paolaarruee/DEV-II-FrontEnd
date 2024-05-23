import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaEstagiariosServiceService {


  constructor(private httpClient: HttpClient) { }

  public listaEstagiarios(): Observable<Response> {
    return this.httpClient.get<Response>(`${environment.API_URL}/retornarListaEstagiarios`);
  }

  public retornarEstagiarioMatricula(matricula: string): Observable<Response> {
    return this.httpClient.get<Response>(`${environment.API_URL}/retornarEstagiarioMatricula`, {params: {matricula}});
  }

  public downloadPDF(): Observable<Blob> {
    return this.httpClient.get<Blob>(`${environment.API_URL}/pegarPdfEstagiarios`,{ responseType: 'blob' as 'json' });
  }


  public listaEstagiariosPagina(pagina: number): Observable<Response> {
    return this.httpClient.get<Response>(`${environment.API_URL}/retornarListaEstagiariosPagina?pagina=${pagina}`);
  }

  public retornarEstagioEstagiario(id: number): Observable<Response> {
    return this.httpClient.get<Response>(`${environment.API_URL}/retornarEstagioEstagiario`, {params: {id}});
  }
  public atualizarEstagio(estagiario: any): Observable<Response> {
    return this.httpClient.put<Response>(`${environment.API_URL}/atualizarEstagio`, estagiario);
  }

  public cancelarEstagio(id: string): Observable<Response> {
    return this.httpClient.put<Response>(`${environment.API_URL}/cancelarEstagio`, id );
  }

}
