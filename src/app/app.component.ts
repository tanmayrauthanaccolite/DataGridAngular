import { Component } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { SalaryData } from './salary-data';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SalaryService } from './salary.service';
import { PageEvent } from '@angular/material/paginator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Options, LabelType } from "@angular-slider/ngx-slider";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  dropdownList: { item_id: number, item_text: String }[] = [];
  dropdownSettings: IDropdownSettings = {};
  selectedRanks = [];
  dropDownForm: FormGroup | undefined;
  constructor(
    private salService: SalaryService,
    private fb: FormBuilder
  ) {
  }

  //data:SalaryData[]=[];
  data: any;
  totalElements: number = 0;
  rows: any;
  filter: any;
  minvalue: number = 0;
  maxvalue: number = 1000000;
  newVariable: any = window.navigator;

  filters = {
    minvalue: 0,
    maxvalue: 1000000,
    gender: "",
    ranks:[]
  }

  ngOnInit(): void {
    this.filter = this.salService.myfilter;
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
    this.dropdownList = [
      { item_id: 1, item_text: 'Prof' },
      { item_id: 2, item_text: 'AssocProf' },
      { item_id: 3, item_text: 'AsstProf' }
    ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      unSelectAllText: "UnSelect All Items From List"
    };
  }
  private getSalaries(request: { page: string; size: string; filter: any }) {
    this.salService.getAll(request)
      .subscribe(data => {
        console.log(data);
        this.data = data['content'];
        this.totalElements = data['totalElements'];
        this.rows = data['content'];
      }
        , error => {
          console.log(error.error.message);
        }
      );
  }

  nextPage(event: PageEvent) {
    this.getSalaries({ page: event.pageIndex.toString(), size: event.pageSize.toString(), filter: this.filter });
  }
  onDisciplineSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    this.rows = this.data.filter((_: { discipline: string; }) => _.discipline == value);
  }
  onGenderChange(event: Event): void {
    // const value = (event.target as HTMLInputElement).value;
    // this.filter.sex = [];
    this.filter.sex = this.filters.gender ? [this.filters.gender] : [];
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    this.filter.ranks.push(item.item_text);
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
  }

  onItemDeSelect(item: any) {
    console.log('onItemDeSelect', item);
    const arrayWithoutItem = this.filter.ranks.filter(function (currank: any) {
      return currank !== item.item_text;
    });
    this.filter.ranks = arrayWithoutItem;
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
  }

  onUnSelectAll() {
    console.log('onUnSelectAll fires');
  }

  reset() {
    this.filter = {
      disciplines: [],
      ranks: [],
      salarymin: -1,
      salarymax: -1,
      sex: []
    }
    this.filters = {
      minvalue: 0,
      maxvalue: 1000000,
      gender: "",
      ranks:[]
    }
    this.dropdownSettings.unSelectAllText;
    this.salService.myfilter = this.filter;
    console.log(this.salService.myfilter);
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
  }

  options: Options = {
    floor: 0,
    ceil: 240000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min Salary:</b> $" + value;
        case LabelType.High:
          return "<b>Max Salary:</b> $" + value;
        default:
          return "$" + value;
      }
    }
  };
  minSalaryChange(value: number): void {
    this.filter.salarymin = this.filters.minvalue;
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
  }
  maxSalaryChange(value: number): void {
    this.filter.salarymax = this.filters.maxvalue;
    this.getSalaries({ page: "0", size: "5", filter: this.filter });
  }

  downloadPdf() {
    this.salService.downloadPdf(this.filter).subscribe((x) => {
      const blob = new Blob([x], { type: 'application/pdf' });
      if (this.newVariable && this.newVariable.msSaveOrOpenBlob) {
        this.newVariable.msSaveOrOpenBlob(blob);
        return;
      }
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = 'items.pdf';
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }

  excelDownload() {
    this.salService.downloadExcel(this.filter).subscribe(x => {
      const blob = new Blob([x], { type: 'application/pdf' });
      if (this.newVariable && this.newVariable.msSaveOrOpenBlob) {
        this.newVariable.msSaveOrOpenBlob(blob);
        return;
      }
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = 'items.xlsx';
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });
  }

}
