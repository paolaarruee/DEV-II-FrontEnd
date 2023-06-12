import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Aluno } from './aluno.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AlunoService {
    private readonly urlAPI = 'http://localhost:8088/assinaturaapi/GetAluno';
  
    constructor(private http: HttpClient) { }
  
    public getAlunoById(id: string): Observable<Aluno> {
      //  lógica para buscar o aluno por ID no backend
      // Supondo que o backend retorne um objeto com os dados do aluno
      return this.http.get<Aluno>(`${this.urlAPI}/${id}`);
    }
  }
  
