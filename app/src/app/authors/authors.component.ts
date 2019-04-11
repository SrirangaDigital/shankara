import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthorsComponent implements OnInit {

  // Define a authors property to hold our author data
  authors: Array<any>;
  letter: String;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService ) { }

  ngOnInit() {
    
    this.route.paramMap
      .switchMap((params: ParamMap) => {

        this.letter = params.get('letter');
        return this._dataService.getAuthorsLetterWise(this.letter);
      })
      .subscribe(res => {
        this.authors = res;
        this.letter = this.letter;
    });
  }
}
