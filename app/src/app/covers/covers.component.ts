import { Component, OnInit, ViewEncapsulation, Renderer } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DatePipe } from '@angular/common';
import { RlzeroPipe } from '../custom-pipes/rlzero.pipe';
import { MonthToDevanagariPipe } from '../custom-pipes/monthToDevanagari.pipe';
import { ToDevanagariPipe } from '../custom-pipes/toDevanagari.pipe';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-covers',
  templateUrl: './covers.component.html',
  styleUrls: ['./covers.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, RlzeroPipe, MonthToDevanagariPipe, ToDevanagariPipe]
})

export class CoversComponent implements OnInit {

  covers: Array<any>;

  constructor(private route: ActivatedRoute, private router: Router, private _dataService: DataService, private datePipe: DatePipe, private rlzeroPipe: RlzeroPipe, private monthToDevanagariPipe: MonthToDevanagariPipe, private toDevanagariPipe: ToDevanagariPipe ) { }

  ngOnInit() {
  	
  	this.route.paramMap
  	  .switchMap((params: ParamMap) =>
  	    this._dataService.getCoversList())
  	  .subscribe(res => {
  	    this.covers = res;
  	  });
  }
}
