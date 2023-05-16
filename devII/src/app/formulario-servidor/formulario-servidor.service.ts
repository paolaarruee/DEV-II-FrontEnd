import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servidor } from './servidor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioServidorService {

  private readonly urlAPI = 'http://localhost:8088/assinaturaapi/cadastroServidor';

  constructor(private http: HttpClient) { }


  enviarDados(aluno: Servidor): Observable<Servidor>{
    const header = new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQVNTSU5BVFVSQS5FU1QuSUZSUyIsInN1YiI6Im1heWNvbmRldkByZXN0aW5nYS5pZnJzLmVkdS5iciIsImV4cCI6MTY4NDIwOTUzMn0.2u9wbq7L9PT9PTToFagWNxWoRBq2m7St_xpzrJ0y0v8');
    return this.http.post<Servidor>(this.urlAPI, aluno, {headers:header});
  }




}
