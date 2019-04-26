import { Component, OnInit, ViewEncapsulation, Renderer } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import * as _underscore from 'underscore';

// Import the DataService
import { DataService } from '../data.service';


 // Load the Google Transliterate API
declare let google: any;

export interface Author {
  author: string;
  roman: string;
}

export interface Translator {
  translator: string;
  roman: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  searchForm = new FormGroup({
    toc: new FormControl(''),
    fulltext: new FormControl(''),
  });

  elid:string;
  googleLocal:any;
  
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService, private renderer: Renderer) { }

  ngOnInit() {
    

    if(!(typeof google === 'undefined')) {

      google.load("elements", "1", {
          packages: "transliteration",
          callback: onLoad
      });
    }


    function onLoad() {
        var options = {
            sourceLanguage: 'en', // or google.elements.transliteration.LanguageCode.ENGLISH,
            destinationLanguage: ['hi'], // or [google.elements.transliteration.LanguageCode.HINDI],
            shortcutKey: 'ctrl+g',
            transliterationEnabled: true
        };
        // Create an instance on TransliterationControl with the required
        // options.
        var control = new google.elements.transliteration.TransliterationControl(options);

        // Enable transliteration in the textfields with the given ids.
        var ids = ["toc", "fulltext"];
        control.makeTransliteratable(ids);
    }
  }

  onSubmit() {

    this.searchForm.get('toc').setValue(this.renderer.selectRootElement('#toc').value);
    this.searchForm.get('fulltext').setValue(this.renderer.selectRootElement('#fulltext').value);
    
    var form = _underscore.pick(this.searchForm.value, _underscore.identity);
	  this.router.navigate(['/searchResults'], { queryParams:  form });
  }

  onFocus(field: string) {

    this.elid = field;
    console.log(this.elid);
  }

  insertText(text: string) {

     switch (this.elid) {

      case 'toc' :
        
        var toc = this.searchForm.get('toc').value;
        toc = toc ? toc + text : text;
        this.searchForm.get('toc').setValue(toc);
        setTimeout(() => this.renderer.selectRootElement('#toc').focus(), 0);
        break;

      case 'fulltext' :
        
        var fulltext = this.searchForm.get('fulltext').value;
        fulltext = fulltext ? fulltext + text : text;
        this.searchForm.get('fulltext').setValue(fulltext);
        setTimeout(() => this.renderer.selectRootElement('#fulltext').focus(), 0);
        break;
    }
  }
}
