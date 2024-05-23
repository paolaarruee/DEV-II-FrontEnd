import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CursosServiceService {


  adicionarCurso(novoCurso: any) {
    return this.http.post(`${environment.API_URL}/cadastrarCurso`, novoCurso);
  }
  
  constructor(private http: HttpClient) { }

  getTodosCursos(): Observable<any> {
    return this.http.get(`${environment.API_URL}/cursos`);
  }

  trocarStatus(id: any): Observable<any> {
    return this.http.put(`${environment.API_URL}/cursos/trocarStatus/${id}`, {});
  }

}
