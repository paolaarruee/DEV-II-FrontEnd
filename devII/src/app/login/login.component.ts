import {Component, OnInit} from '@angular/core';
import {Usuario} from "../shered/models/usuario.model";
import {NgForm} from "@angular/forms";
import {AuthenticationServiceService} from "../service/authentication-service.service";
import {Router} from "@angular/router";



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
