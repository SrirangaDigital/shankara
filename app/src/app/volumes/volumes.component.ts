import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-years',
  templateUrl: './volumes.component.html',
  styleUrls: ['./volumes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VolumesComponent implements OnInit {

  // Define a series property to hold our series data
  volumes: Array<any>;
  volumeLoopVar: Array<any>;
  volumesPerRow: number = 5;
  rowDisplayed: Array<boolean> = [];
  volumeDisplayed: Array<boolean> = [];
   
  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService) { 

    this._dataService.getVolumes()
        .subscribe(res => {
          this.volumes = res;
          this.volumeLoopVar = Array(Math.ceil(this.volumes.length / this.volumesPerRow)).fill(1);
        });
  }

  ngOnInit() { }
}
