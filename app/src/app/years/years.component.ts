import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class YearsComponent implements OnInit {

  // Define a series property to hold our series data
  years: Array<any>;
  yearLoopVar: Array<any>;
  partLoopVar: Array<any>;
  yearsPerRow: number = 10;
  partsPerRow: number = 12;
  parts: Array<any>;
  rowDisplayed: Array<boolean> = [];
  yearDisplayed: Array<boolean> = [];
   
  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService) { 

    this._dataService.getYearsList()
        .subscribe(res => {
          this.years = res;
          this.yearLoopVar = Array(Math.ceil(this.years.length / this.yearsPerRow)).fill(1);
        });
  }

  ngOnInit() { }

  togglePartsContainer(i) {
    
    this.rowDisplayed = [];
    this.rowDisplayed[i] = true;
  }
  
  showParts(year) {

    this._dataService.getPartsByYear(year)
        .subscribe(res => {
          this.parts = res;
          this.partLoopVar = Array(Math.ceil(this.parts.length / this.partsPerRow)).fill(1);
        });

    this.yearDisplayed = [];
    this.yearDisplayed[year] = true;
  }
}
