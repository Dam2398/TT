import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms'
import { ProjectComponent } from './components/project/project.component';
import { AbouttoComponent } from './components/aboutto/aboutto.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'Proyectos',
    component: ProjectComponent
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