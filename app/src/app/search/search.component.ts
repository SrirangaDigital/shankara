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
    title: new FormControl(''),
    authornames: new FormControl(''),
    translatornames: new FormControl(''),
    feature: new FormControl(''),
    series: new FormControl(''),
    fulltext: new FormControl(''),
    year: new FormControl('')
  });

  elid:string;
  googleLocal:any;
  
  features: Array<any>;
  authors: Array<any>;
  translators: Array<any>;

  filteredAuthorOptions: Observable<string[]>;
  filteredTranslatorOptions: Observable<string[]>;
  
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
        var ids = ["title", "feature", "series", "fulltext"];
        control.makeTransliteratable(ids);
    }

    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this._dataService.getFeaturesList())
      .subscribe(res => {
        this.features = res;
    });

    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this._dataService.getAllAuthors())
      .subscribe(res => {
        this.authors = res;


        this.filteredAuthorOptions = this.searchForm.get('authornames').valueChanges
          .pipe(
            map(value => value ? this._filterAuthor(value) : this.authors.slice())
          );
    });

    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this._dataService.getAllTranslators())
      .subscribe(res => {
        this.translators = res;


        this.filteredTranslatorOptions = this.searchForm.get('translatornames').valueChanges
          .pipe(
            map(value => value ? this._filterTranslator(value) : this.translators.slice())
          );
    });
  }

  private _filterAuthor(value: string): Author[] {

    const filterValueAuthor = value.toLowerCase();

    return this.authors.filter(option => option.roman.toLowerCase().includes(filterValueAuthor) || option.author.toLowerCase().includes(filterValueAuthor));
  }

  private _filterTranslator(value: string): Translator[] {

    const filterValueTranslator = value.toLowerCase();

    return this.translators.filter(option => option.roman.toLowerCase().includes(filterValueTranslator) || option.translator.toLowerCase().includes(filterValueTranslator));
  }

  // displayAuthor(user?: Author): string | undefined {
    
  //   return user ? user.author : undefined;
  // }

  onSubmit() {

    this.searchForm.get('title').setValue(this.renderer.selectRootElement('#title').value);
    this.searchForm.get('series').setValue(this.renderer.selectRootElement('#series').value);
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

      case 'title' :
        
        var title = this.searchForm.get('title').value;
        title = title ? title + text : text;
        this.searchForm.get('title').setValue(title);
        setTimeout(() => this.renderer.selectRootElement('#title').focus(), 0);
        break;

      case 'authornames' :
        
        var authornames = this.searchForm.get('authornames').value;
        authornames = authornames ? authornames + text : text;
        this.searchForm.get('authornames').setValue(authornames);
        setTimeout(() => this.renderer.selectRootElement('#authornames').focus(), 0);

        break;

      case 'translatornames' :
        
        var translatornames = this.searchForm.get('translatornames').value;
        translatornames = translatornames ? translatornames + text : text;
        this.searchForm.get('translatornames').setValue(translatornames);
        setTimeout(() => this.renderer.selectRootElement('#translatornames').focus(), 0);
        break;

      case 'feature' :
        
        var feature = this.searchForm.get('feature').value;
        feature = feature ? feature + text : text;
        this.searchForm.get('feature').setValue(feature);
        setTimeout(() => this.renderer.selectRootElement('#feature').focus(), 0);

        break;

      case 'series' :
        
        var series = this.searchForm.get('series').value;
        series = series ? series + text : text;
        this.searchForm.get('series').setValue(series);
        setTimeout(() => this.renderer.selectRootElement('#series').focus(), 0);
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
