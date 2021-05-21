import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms'
import { ProjectComponent } from './components/project/project.component';
import { AbouttoComponent } from './components/aboutto/aboutto.component';
import { UserComponent } from './components/user/user.component';
import { TeamComponent } from './components/team/team.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { BacklogComponent } from './components/backlog/backlog.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'Proyectos',
    component: ProjectComponent,
    children: [
      {
        path: 'Equipo/:id',
        component: TeamComponent
      }
    ]
  },
  {
    path: 'Backlog/Proyecto/:id',
    component: TasksComponent,
    children: [
      {
        path: 'Sprint/:idSprint',
        component: BacklogComponent
      }
    ]
  },
  {
    path: 'Acerca',
    component: AbouttoComponent
  }, 
  {
    path: 'Mi-Perfil',
    component: UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }