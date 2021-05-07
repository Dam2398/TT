import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlProjects =  environment.API_URL + 'projects/misProyectos'
  projects: any;
  selectedItem: any;
  ProjectName: any;
  ProjectDate: any;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    if(environment.isLoggedIn) {
      this.getProjects();
    }
  }

  private getProjects() {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseProjects = this.httpClient.get(this.urlProjects + '?userId=' + this.idUser, { headers }).toPromise();
    promiseProjects.then((data) => {
      this.projects = data;
    }).catch((error) => {
      console.log(error);
    })
  }

  printProject(that: any){
    this.ProjectName = that.name
    if(that.fechaCreacion.includes("T")){
      that.fechaCreacion = that.fechaCreacion.split("T")
    }
    this.ProjectDate = that.fechaCreacion[0]
    this.selectedItem = that.id;
  }
}
