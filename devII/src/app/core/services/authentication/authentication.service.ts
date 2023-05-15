import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders } from "@angular/common/http";
import {Router} from "@angular/router";
import { AppConstants } from 'src/app/app-constants';


const  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {
  constructor(private http: HttpClient,private router: Router) { }

  // @ts-ignore
  login(usurio): Observable<any>{
    return this.http.post<any>(AppConstants.baseLogin,JSON.stringify(usurio), httpOptions ).subscribe(data => {
      if (JSON.parse(JSON.stringify(data)).Authorization) {
        var token = JSON.parse(JSON.stringify(data)).Authorization;
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      } else {
        alert("email ou senha invalidos")
        return
      }
    })
  }

}
