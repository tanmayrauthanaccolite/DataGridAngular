import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private http : HttpClient) { }

  getData()
  {
    return this.http.get<any>("http://localhost:8099/salary/getData");
  }
}
