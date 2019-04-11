import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-translators',
  templateUrl: './translators.component.html',
  styleUrls: ['./translators.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TranslatorsComponent implements OnInit {

  // Define a translators property to hold our translator data
  translators: Array<any>;
  letter: String;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService ) { }

  ngOnInit() {
    
    this.route.paramMap
      .switchMap((params: ParamMap) => {

        this.letter = params.get('letter');

        // Listing all translators together
        this.letter = '.*';
        return this._dataService.getTranslatorsLetterWise(this.letter);
      })
      .subscribe(res => {
        this.translators = res;
        this.letter = this.letter;
    });
  }
}
