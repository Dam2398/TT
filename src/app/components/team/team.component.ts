import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlTeam =  environment.API_URL;
  idProject: any;
  user: any;
  teams: any = {};
  teamUser: any[] = [];

  constructor(
    private httpClient : HttpClient,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProject = params['id'];
    });

    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    let promiseDevelopmentTeam = this.httpClient.get(this.urlTeam + 'urp/equipo/?projectId=' + this.idProject + '&userId=' + this.idUser, { headers }).toPromise();
    promiseDevelopmentTeam.then((data) => {
      this.getAlllUsers(data);
    }).catch((error) => {
      console.log(error);
    })
  }

  async getAlllUsers(these: any) {
    for(let i = 0; i < these.length; i++) {

      let PromiseUserbyId = this.httpClient.get(this.urlTeam + 'users/' + these[i].userId).toPromise();
      await PromiseUserbyId.then((data) => {
        this.user = data

        this.teamUser.push({
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
}
