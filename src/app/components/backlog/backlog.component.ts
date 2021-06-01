import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlTasks =  environment.API_URL;
  idProject: any;
  idSprint: any;
  tasks: any [] = [];
  oneTask: any [] = [];
  backlog: any;

  constructor(
    private httpClient : HttpClient,
    private Activateroute : ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.Activateroute.params.subscribe(params => {
      this.idSprint = params['idSprint'];
    });
    this.idProject = (this.router.url).split('/')[3];

    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    let promiseTasks = this.httpClient.get(this.urlTasks + 'tareas/?sprintId=' + this.idSprint + '&userId=' + this.idUser + '&projectId=' + this.idProject, { headers }).toPromise();
    promiseTasks.then((data) => {
      this.backlog = data;
      this.backlogOrder(this.backlog);
    }).catch((error) => {
      console.log(error);
    })
  }
  
  backlogOrder(these: any) {
    for(let i = 0; i < these.length; i++) {
      this.oneTask.push({
        "id": these[i].id,
        "name": these[i].name,
        "description": these[i].description,
        "status": these[i].status,
        "priority": these[i].priority
      });

      this.tasks = this.oneTask;
    }
    //console.log(this.tasks)
  }

}
