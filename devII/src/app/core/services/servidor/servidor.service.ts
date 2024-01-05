import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  public excluirServidor(id: any): Observable<void> {
    return this.httpClient.get<void>(
      `${environment.API_URL}/excluirServidor/${id}`
 
    );
  }
  public constructor(private httpClient: HttpClient) {}

  public cadastraServidor(servidor: Servidor): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.API_URL}/cadastroServidor`,
      servidor
    );
  }

  public buscarServidor(cursoId: number): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.API_URL}/buscarOrientadorCurso`,
      cursoId
    );
  }

  public listaServidor(id: number): Observable<void> {
    return this.httpClient.get<void>(
      `${environment.API_URL}/buscarServidor/${id}`
    );
  }

  public listarTodosServidores(): Observable<Servidor[]> {
    return this.httpClient.get<Servidor[]>(
      `${environment.API_URL}/listarServidores`
    );
  }
}
