import { Component } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { SalaryData } from './salary-data';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { SalaryService } from './salary.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private salService:SalaryService){
  }

  title = 'DataSalary';
  public configuration!: Config;
  
  public columns: Columns[]= [
    { key: 'id', title: 'Id' },
    { key: 'ranks', title: 'Rank' },
    { key: 'discipline', title: 'Discipline' },
    { key: 'yrSincePhd', title: 'YrsSincePhd' },
    { key: 'yrsService', title: 'YrsService' },
    { key: 'sex', title: 'Sex' },
    { key: 'salary', title: 'Salary' }
  ];;

  //data:SalaryData[]=[];
  data:any;

  ngOnInit(): void {
    console.log("hi");
    this.configuration = { ...DefaultConfig };
    this.salService.getData().subscribe((data)=>{
      console.log(data);
      this.data=data;
    });
    //this.rows = data;
    // this.columns = [
    //   { key: 'id', title: 'Id' },
    //   { key: 'ranks', title: 'Rank' },
    //   { key: 'discipline', title: 'Discipline' },
    //   { key: 'yrsSincePhd', title: 'YrsSincePhd' },
    //   { key: 'yrsService', title: 'YrsService' },
    //   { key: 'sex', title: 'Sex' },
    //   { key: 'Salary', title: 'Salary' }
    // ];
    console.log(this.data);
  }
}
