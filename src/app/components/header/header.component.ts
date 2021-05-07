import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }
  
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('idUser');
    environment.isLoggedIn = false;
  }
}
