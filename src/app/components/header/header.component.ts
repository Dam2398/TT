import { Component, Input, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

import { ChatService } from "./../../service/chat.service";
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from './../../service/usuario.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  prueba!: boolean;



  storedToDos:any  = localStorage.getItem('user');
  projectId!: number;

  notIcon:number=0;//se manda desde aqui


  userName: string= '';
  userId:string= '';
  message: string ;
  notification :string;
  output: any[] = [];
  outnot: any[] = [];
  feedback: string ;
  pStyle:string;

  value:boolean;

  exp:boolean =true;

  constructor(private chatSvc:ChatService,
              private userSvc:UsuarioService,
              private route: ActivatedRoute,
              private router: Router) {
  
    
   // this.userId="2"//JSON.parse(this.storedToDos)["userId"];
    //this.userName= JSON.parse(this.storedToDos)["username"];//lo manda al handle
    this.message ='';
    this.feedback='';
    this.notification='';
    this.pStyle='';
    this.value = false;

    
   }

  ngOnInit(){
    //console.log(this.value)
    
    //if(this.value){


      console.log('holadel try del header')
      this.userId=  "2"//JSON.parse(this.storedToDos)["userId"];
      this.userName= "Damian"//JSON.parse(this.storedToDos)["username"];
      console.log(this.userId,this.userName)


      
      //this.check()
      this.route.params.subscribe(params => {
        this.projectId = params['id'];//Id del proyecto
      })
      this.chatSvc.emit('room-created-not',this.userId);
      this.chatSvc.emit2('new-user-not', `n${this.projectId}`,this.userId);
  
      //
      this.chatSvc.listen('notification-received').subscribe((data)=> this.updateNotifications(data) )
      //
      this.chatSvc.listen('error').subscribe((data)=>console.log(data))
      //this.chatSvc.listen('mal').subscribe((data)=>this.mal(data));
  
  
      this.chatSvc.listen('old-not').subscribe((data)=>this.displayNot(data)) 
    //} 
  }

  
desdeLogin():void{
  this.value = true;
  console.log(this.value)
}

valores(user_id:any, user_anem:any):any{
  this.userId = user_id;
  this.userName = user_anem;

}

   

  logOut(){

    this.userSvc.logout()
    //this.exp= this.userSvc.checkToken()
    this.value = false;
    //this.chatSvc.desconectar(); no sirve, no sabe que usuario eliminar
    this.outnot = [];
  }


  cambiar() {
    this.notIcon = 0; 
  }
  ///////////////////////////////
  updateNotifications(data:any){
    if(!!!data) return;
    this.outnot.push({
      nombre: data.name,
      not: ` ${data.notification} en`,
      proyecto: data.project,
      fecha: ''
    })
    this.notIcon = this.notIcon+1;
    console.log(this.outnot)
  }



  displayNot(data:any){
    if(!!!data) return;
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      const yy = data[i].fechaCreacion.toString()
      const mm= yy.substr(0, 10);
      if(data[i].userId != this.userId){
        this.outnot.push({
          id:data[i].projectId,
          nombre: '',
          not: data[i].notification,
          proyecto: '',
          fecha:  mm
        })
        this.notIcon = this.notIcon+1;
        //console.log(data[i].notification);
      }
    }
  }

}


