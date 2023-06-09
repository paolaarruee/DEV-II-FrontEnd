import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servidor } from 'src/app/shared/interfaces/servidor';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  public constructor(private httpClient: HttpClient) {}

  public cadastraServidor(servidor: Servidor): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.API_URL}/cadastroServidor`,
      servidor
    );
  }

  public listaServidor(id: number): Observable<void> {
    return this.httpClient.get<void>(
      `${environment.API_URL}/buscarServidor/${id}`
    );
  }
}
