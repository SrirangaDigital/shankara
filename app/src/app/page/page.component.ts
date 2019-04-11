import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PageComponent implements OnInit {

  name:String;
  htmlString:String = '';

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService ) { }

  ngOnInit() {

  	this.route.paramMap
  	  .switchMap((params: ParamMap) => {
  	    
  	    this.name = params.get('name');
  	    return this._dataService.getStaticContent('assets/html/' + this.name + '.html');
  	  })
  	  .subscribe(res => {

  	    this.htmlString = res;
  	});
  }

}
