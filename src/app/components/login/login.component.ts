import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  urlLogin = environment.API_URL + 'auth/login'

  public login = {
    email: '',
    password: ''
  }

  constructor(
    private httpClient: HttpClient,
    private router : Router  
  ) { }

  ngOnInit(): void {
  }

  loginUser(){
    this.httpClient.post<any>(this.urlLogin, this.login).subscribe(response => {
      if(response.msg == 'OK') {
        this.saveToken(response.token, response.userId)
        environment.isLoggedIn = true;
        this.router.navigate(['Proyectos'])
      } else {
        //handdle errors
      }
    })
  }

  private saveToken(token: any, idUser: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('idUser', idUser);
  }
}
