import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vaga } from 'src/app/shared/interfaces/vaga';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  constructor(private httpClient: HttpClient) {}

  enviarDados(vaga: Vaga): Observable<Vaga> {
    return this.httpClient.post<Vaga>(
      `${environment.API_URL}/cadastrarVaga`,
      vaga
    );
  }

  obterSolicitacoes(): Observable<any> {
    return this.httpClient.get<any>(`${environment.API_URL}/listarVagas`);
  }
}
