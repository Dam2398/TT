import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartType, ChartOptions, ChartColor } from "chart.js";
import { Color, Label ,PluginServiceGlobalRegistrationAndOptions} from "ng2-charts";
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  urlTasks =  environment.API_URL;
  backlog: any;
  sprint:any;
  sprintNombre:any;
  cambio:boolean =true;

  projectId: any;
  sprintId:any;
  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales:{
      yAxes:[{
        display:true,
        scaleLabel:{
          display:true,
          labelString:'Tareas',

        },
        ticks:{
          beginAtZero:true,
        }
      }]
    }

  };
  
    
  public barChartLabels: Label[] = ['Estado de las tareas'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [10], label: 'No Hecho' , backgroundColor:'#ff6961'},
    { data: [10], label: 'En Progreso' },
    { data: [10], label: 'Hecho' , backgroundColor:'rgb(120, 222, 120)', borderColor:'rgb(120, 222, 120)', hoverBackgroundColor:'rgb(120, 222, 120)'}
  ];

  constructor(private router: Router,
              private httpClient : HttpClient,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'];//id del proyecto
      this.sprintId =params['sprintId'];
    });

    let headers = new HttpHeaders().set('auth',`${this.localToken}`);
    let promise = this.httpClient.get(this.urlTasks+ `tareas/?sprintId=${this.sprintId}&userId=${this.idUser}&projectId=${this.projectId}`,{headers}).toPromise();
    promise.then((data)=>{
      this.backlog =data;
      //console.log(this.backlog)
      //console.log(this.backlog[0]['status'])
      //console.log(this.backlog.length)
      this.separar(this.backlog)
    }).catch((error)=>{
      console.log(error);
    })

    let sprintpro = this.httpClient.get(this.urlTasks+`sprints/byid/${this.sprintId}?&userId=${this.idUser}&projectId=${this.projectId}`,{headers}).toPromise();
    sprintpro.then((data)=>{
      this.sprint = data
      //console.log(this.sprint['name'])
      this.sprintNombre = this.sprint['name']
    }).catch((error)=>{
      console.log(error)
    })
  }


  separar(tareas:any){
    let contNotDone =0;
    let contInProgress=0;
    let contDone=0;
    for (let i = 0; i < tareas.length; i++) {
      if (tareas[i]['status']=='NotDone') {
        contNotDone=contNotDone+1;
        this.barChartData[0].data = []
      }if (tareas[i]['status']=='InProgress') {
        contInProgress = contInProgress+1;
      } if(tareas[i]['status']=='Done') {//DONE
        contDone = contDone+1;
      }
    }
    console.log(contDone,contInProgress,contNotDone)
    this.barChartData[0].data = [contNotDone];
    this.barChartData[1].data = [contInProgress];
    this.barChartData[2].data = [contDone];

    this.pieChartData[0]=contNotDone;
    this.pieChartData[1]= contDone;
    this.pieChartData[2]= contInProgress;
  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public randomize(): void {//Cambio de graficas
    this.cambio = !this.cambio;
  }
//-----------------------------------------------------PIE
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value:any, ctx:any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  public pieChartLabels: Label[] = [['No Hecho'], ['Hecho'], ['En Progreso']];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins:PluginServiceGlobalRegistrationAndOptions[] = [{
    
  }];

  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];



}
