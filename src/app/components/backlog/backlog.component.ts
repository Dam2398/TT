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
  teamURP: any;
  backlog: any;
  selectedItem: any;
  assignedURP: any;
  allUsers: any;
  user: any;
  teamUser: any[] = [];
  teams: any [] = [];
  idEditTask: any;

  public editTask = {
    name: '',
    description: '',
    status: '',
    priority: '',
    urpId: 0,
    sprintId: 0,
  }

  constructor(
    private httpClient : HttpClient,
    private Activateroute : ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.Activateroute.params.subscribe(params => {
      this.idSprint = params['idSprint'];
    });
    this.idProject = (this.router.url).split('/')[3];

    let headers = new HttpHeaders().set('auth', `${this.localToken}`);

    let promiseTeamUrp = this.httpClient.get(this.urlTasks + 'urp/equipo/?projectId=' + this.idProject + '&userId=' + this.idUser, {headers}).toPromise();
    await promiseTeamUrp.then((data) => {
      this.teamURP = data;
    }).catch((error) => {
      console.log(error);
    })

    let promiseTasks = this.httpClient.get(this.urlTasks + 'tareas/?sprintId=' + this.idSprint + '&userId=' + this.idUser + '&projectId=' + this.idProject, { headers }).toPromise();
    await promiseTasks.then((data) => {
      this.backlog = data;
    }).catch((error) => {
      console.log(error);
    })

    await this.backlogOrder(this.backlog, this.teamURP);

    let promiseDevelopmentTeam = this.httpClient.get(this.urlTasks + 'urp/equipo/?projectId=' + this.idProject + '&userId=' + this.idUser, { headers }).toPromise();
    promiseDevelopmentTeam.then((data) => {
      this.allUsers = data;
      this.getAlllUsers(this.allUsers)
    }).catch((error) => {
      console.log(error);
    })
  }
  
  async backlogOrder(these: any, usersURP: any) {
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
      } else {
        for(let j = 0; j < usersURP.length; j++) {
          if(these[i].urpId == usersURP[j].userId) {
            let getOneUser = this.httpClient.get(this.urlTasks + 'users/' + usersURP[j].userId ).toPromise();
            await getOneUser.then((data) => {
              this.assignedURP = data
              these[i].urpId = 'Asignada a: ' + this.assignedURP.firstName + ' ' + this.assignedURP.lastName
            }).catch((error) => {
              console.log(error);
            })
          }
        }
      }

      if(these[i].status == 'InProgress') {
        these[i].status = 'En Progreso'
      } else if (these[i].status == 'Done') {
        these[i].status = 'Hecho'
      } else if (these[i].status == 'NotDone') {
        these[i].status = 'Sin hacer'
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

  async getAlllUsers(these: any) {
    for(let i = 0; i < these.length; i++) {

      let PromiseUserbyId = this.httpClient.get(this.urlTasks + 'users/' + these[i].userId).toPromise();
      await PromiseUserbyId.then((data) => {
        this.user = data

        this.teamUser.push({
          "urpId" : these[i].id,
          "id" : these[i].userId,
          "name" : this.user.firstName +  ' ' +this.user.lastName,
          "role" : these[i].rol,
          "email" : this.user.email
        });

      }).catch((error) => {
        console.log(error);
      })
    }

    this.teams = this.teamUser
  }

  seeTask(taskEdit: any) {
    this.editTask.name = taskEdit.name
    this.editTask.description = taskEdit.description
    this.editTask.status = taskEdit.status
    this.editTask.priority = taskEdit.priority
    this.editTask.sprintId = taskEdit.sprintId
    this.idEditTask = taskEdit.id
  }

  addEditTask(){
    if (this.editTask.status == 'Sin hacer') {
      this.editTask.status = 'NotDone'
    } else if (this.editTask.status == 'En Progreso') {
      this.editTask.status = 'InProgress'
    } else if (this.editTask.status == 'Hecho') {
      this.editTask.status = 'Done'
    }
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    this.httpClient.patch<any>(this.urlTasks + 'tareas/edit/' + this.idEditTask + '?sprintId=' + this.idSprint +'&userId=' + this.idUser + '&projectId=' + this.idProject ,this.editTask, {headers}).subscribe(response => {
      if (response.msg == 'Tarea update'){
        this.router.navigate(['Backlog/Proyecto/' + this.idProject])
      } else {
        //handdle errors
      }
    })
  }
}
