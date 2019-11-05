import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Import the DataService
import { DataService } from '../data.service';
import * as _underscore from 'underscore';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchResultsComponent implements OnInit {

  // Define a articles property to hold our article data
  articles: Array<any> = [];
  urlParams: ParamMap;
  articleListType: String;
  basePdfUrl: String;
  fullTextParam: String = '';
  maxVolume: number = 20;
  currentVolume: number = 0;
  currentPointer:number = 1;
  progress:number = 1;

  timerInterval:any;
  searchingComplete:boolean = false;

  numresults:number = 0;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService ) { }

  ngOnInit() {
  

    this.route.queryParamMap
      .subscribe((params: ParamMap) => {

        this.urlParams = params;
    });

    if (this.urlParams.has('fulltext')) {

      this.fullTextParam = this.urlParams.get('fulltext');
      this.timerInterval = setInterval (() => { 

        this.getResultsByVolume(this.currentPointer++);
        if(this.currentPointer > this.maxVolume) clearInterval(this.timerInterval);
      }, 1000);
    }
    else {

      this.getMetadataResults();
    }
  }

  getResultsByVolume(volume) {

    return this._dataService.getTextSearchResultsByVolume(this.urlParams, volume)
     .subscribe(res => {

        this.currentVolume++;
        this.progress++;

        this.articles = this.articles.concat(res[0]);
        this.numresults = this.articles.length;
        this.basePdfUrl = 'http://127.0.0.1:3000/flipbook/pdf_reader.html?file=';
        if(this.currentVolume == this.maxVolume) this.searchingComplete = true;
      });
  }

  getMetadataResults() {

    return this._dataService.getSearchResults(this.urlParams)
      .subscribe(res => {

        this.articles = res;
        this.numresults = this.articles.length;
        this.basePdfUrl = 'http://127.0.0.1:3000/flipbook/pdf_reader.html?file=';
        this.searchingComplete = true;
    });
  }
  
  getSortedPageList(pageList: Array<number>){
	var sortedArray: Array<number> = pageList.sort((a,b) => (Number(a) - Number(b)));
	return sortedArray;
  }

  getPageListCount(pageList: Array<number>){
	return pageList.length;
  }
  
  
}
