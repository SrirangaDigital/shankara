import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FeatureComponent implements OnInit {

  // Define a features property to hold our features data
  features: Array<any>;
  letter: String;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService ) { }

  ngOnInit() {
    
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this._dataService.getFeaturesList())
      .subscribe(res => {
        this.features = res;
    });
  }

}
