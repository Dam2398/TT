import { Component, Input, NgModule, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  urlUsers = environment.API_URL + 'users/'
  id =localStorage.getItem('idUser')
  localToken =  localStorage.getItem('token')
  firstName = '';
  lastName = '';
  email = '';
  user: any;

  public userUpdate = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
  

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser() {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseUsers = this.httpClient.get(this.urlUsers + this.id, {headers}).toPromise();
    promiseUsers.then((data) => {
      this.user = data;
      this.firstName = this.user.firstName
      this.lastName = this.user.lastName;
      this.email = this.user.email;
    }).catch((error) => {
      console.log(error);
    })
  }

  editUser() {
    //console.log(this.userUpdate)
    this.httpClient.patch<any>(this.urlUsers + this.id, this.userUpdate).subscribe(response => {
      if(response.msg == 'User update') {
        this.getUser();
      }
    })
  }
}
