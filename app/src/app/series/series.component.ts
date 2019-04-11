import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SeriesComponent implements OnInit {

  // Define a series property to hold our series data
  series: Array<any>;
  letter: String;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService ) { }

  ngOnInit() {
    
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this._dataService.getSeriesList())
      .subscribe(res => {
        this.series = res;
    });
  }

}
