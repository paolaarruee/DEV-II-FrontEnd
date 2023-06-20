import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosBackendService {

  private readonly urlAPI = 'http://localhost:8088/assinaturaapi/listarVagas';

  constructor(private http: HttpClient) { }

  obterSolicitacoes(): Observable<any> {
    return this.http.get<any>(this.urlAPI);
  }
}
