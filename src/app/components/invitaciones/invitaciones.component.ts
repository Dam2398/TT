import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-invitaciones',
  templateUrl: './invitaciones.component.html',
  styleUrls: ['./invitaciones.component.css']
})
export class InvitacionesComponent implements OnInit {

  datosForm: any ={};
  salida : any ={};
  projectId:string ;
  rol:string ;
  email:string ;

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlINV =  environment.API_URL + 'projects/des'


  constructor(private httpClient : HttpClient,
              private route: ActivatedRoute,
              private router: Router) { 

                this.email='';
                this.rol='';
                this.projectId ='';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      this.projectId = params['projectId'];
      this.rol = params['rol'];
      this.email = params ['email'];
      console.log(this.projectId, this.rol ,this.email)
    })
    this.datosForm ={
      projectId: this.projectId,
      rol: this.rol,
      email: this.email
    }

    console.log(this.datosForm)
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    this.httpClient.post<any>(this.urlINV + `?userId=${this.idUser}`,this.datosForm , {headers}).subscribe(responde =>{
      this.salida = responde;
      console.log(this.salida)
    });

  }

  aceptar(){
    
  }

}
