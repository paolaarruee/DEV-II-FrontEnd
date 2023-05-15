import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { AuthenticationServiceService } from '../core/services/authentication/authentication.service';
import { Usuario } from '../shared/interfaces/usuario';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements  OnInit{

  constructor(private loginService: AuthenticationServiceService,private router: Router) {}
  email?: string;
  password?: string;

  public login(){
     this.loginService.login(new Usuario(this.email,this.password));
  }

  public cadatrar(){
    alert("em contrução")
  }

  ngOnInit():void {
  }
}
