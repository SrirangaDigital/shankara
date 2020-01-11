import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TocComponent implements OnInit {

  // Define a series property to hold our series data
  volumes: Array<any>;
  urlParams: ParamMap;
  basePdfUrl: String;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService,private elRef:ElementRef) { }

  ngAfterViewInit() 
  {  
      setTimeout(() => {
          /* returns x here */
          this.onClick();
      }, 500);
  }
 
  ngOnInit() {
    
    this.route.queryParamMap
      .switchMap((params: ParamMap) => {
        
        this.urlParams = params;
        return this._dataService.getToc(this.urlParams);
      })
      .subscribe(res => {
        this.volumes = res;
        this.basePdfUrl = 'http://127.0.0.1:3000/flipbook/pdf_reader.html?file=';
    });
  }


  onClick() {
    var spanElement = this.elRef.nativeElement.querySelector('.highlight');
    var topValue = spanElement.getBoundingClientRect().top
    document.body.scrollTop = document.documentElement.scrollTop = topValue;
  }
}
