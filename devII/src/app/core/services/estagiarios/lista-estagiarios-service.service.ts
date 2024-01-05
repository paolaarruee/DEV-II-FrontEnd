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

}
