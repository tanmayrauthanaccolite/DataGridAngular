import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private http : HttpClient) { }
  filterObservable=new Subject<any>();
  myfilter={
    disciplines:[],
    ranks:[],
    salarymin:-1,
    salarymax:-1,
    sex:[]
  }
  
  getAll(request: any): Observable<any> {
		const params = {page:request.page, size:request.size};
    const body=request.filter;
    console.log(body);
    console.log(this.http.post("http://localhost:8099/salary/getData", {body:body,params:params}));
		return this.http.post("http://localhost:8099/salary/getData", body,{params:params});
	}
  getDefaultFilter() : any
  {
   console.log(this.myfilter);
   this.filterObservable.next(this.myfilter);
  }

  downloadPdf(body:any):Observable<Blob>{
    console.log(body);
    return this.http.post("http://localhost:8099/salary/users/export/pdf", body,{responseType:'blob'});
  }
}
