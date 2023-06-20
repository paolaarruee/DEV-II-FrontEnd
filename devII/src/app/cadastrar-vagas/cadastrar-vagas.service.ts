import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vaga } from '../shared/interfaces/vaga';

@Injectable({
  providedIn: 'root'
})
export class CadastrarVagasService {

  private readonly urlAPI = 'http://localhost:8088/assinaturaapi/cadastrarVaga';

  constructor(private http: HttpClient) { }

  enviarDados(vaga: Vaga): Observable<Vaga>{
    return this.http.post<Vaga>(this.urlAPI, vaga);
  }
}
