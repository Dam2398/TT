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
  selectedItem: any;

  public editTask = {
    name: '',
    description: '',
    status: '',
    priority: '',
    fechaCreacion: '',
    fechaUpdate: '',
    urpId: 0,
    sprintId: 0,
  }

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
      console.log(this.backlog)
      this.backlogOrder(this.backlog);
    }).catch((error) => {
      console.log(error);
    })
  }
  
  backlogOrder(these: any) {
    let idPrior;
    for(let i = 0; i < these.length; i++) {
      if(these[i].priority == 'Prioritario') {
        idPrior = 1
      } else if (these[i].priority == 'Urgente') {
        idPrior = 2
      } else if (these[i].priority == 'Importante') {
        idPrior = 3
      }else if (these[i].priority == 'Necesario') {
        idPrior = 4
      }

      if(these[i].urpId == null) {
        these[i].urpId = 'Sin Asignar'
      }

      this.oneTask.push({
        "id": these[i].id,
        "name": these[i].name,
        "description": these[i].description,
        "status": these[i].status,
        "priority": these[i].priority,
        'order': idPrior,
        'assigned': these[i].urpId,
        'sprintId': these[i].sprintId
      });

      this.tasks = this.oneTask;
    }
    this.tasks.sort(function(a,b){ 
      var x = a.order < b.order? -1:1; 
      return x; 
    });
  }
  seeTask(taskEdit: any) {
    this.editTask.name = taskEdit.name
    this.editTask.description = taskEdit.description
    this.editTask.status = taskEdit.status
    this.editTask.priority = taskEdit.priority
    this.editTask.urpId = taskEdit.assigned
    this.editTask.sprintId = taskEdit.sprintId
    console.log(taskEdit)
    console.log(this.editTask)
    //console.log(new Date())
  }
}
