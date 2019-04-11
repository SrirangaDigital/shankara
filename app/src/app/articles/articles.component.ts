import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DatePipe } from '@angular/common';
import { RlzeroPipe } from '../custom-pipes/rlzero.pipe';
import { MonthToDevanagariPipe } from '../custom-pipes/monthToDevanagari.pipe';
import { ToDevanagariPipe } from '../custom-pipes/toDevanagari.pipe';

// Import the DataService
import { DataService } from '../data.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe, RlzeroPipe, MonthToDevanagariPipe, ToDevanagariPipe]
})
export class ArticlesComponent implements OnInit {

  // Define a articles property to hold our article data
  articles: Array<any>;
  pageTitle: String = '';
  urlParams: ParamMap;
  articleListType: String;
  basePdfUrl: String;
  numArticles: Number;

  // Create an instance of the DataService through dependency injection
  constructor( private route: ActivatedRoute, private router: Router, private _dataService: DataService, private datePipe: DatePipe, private rlzeroPipe: RlzeroPipe, private monthToDevanagariPipe: MonthToDevanagariPipe, private toDevanagariPipe: ToDevanagariPipe ) { }

  ngOnInit() {
    
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.articleListType = params.get('articleListType');
    });

    this.route.queryParamMap
      .switchMap((params: ParamMap) => {
        
        this.urlParams = params;
        return this._dataService.getArticles(this.urlParams);
      })
      .subscribe(res => {
        this.articles = res;
        this.basePdfUrl = 'http://127.0.0.1:3000/pdfjs/web/viewer.html?file=../../Volumes/';
        this.getPageTitle(this.articleListType);
        this.numArticles = this.articles.length;
    });
  }

  getPageTitle(type) {

    if(this.articles.length == 0) return;

    console.log(this.articles.length);

    switch (type) {

      case 'toc' :
        // this.pageTitle = this.datePipe.transform(new Date(this.articles[0].date), 'd MMMM y') + ' (Volume ' + this.rlzeroPipe.transform(this.articles[0].volume) + ', Issue ' + this.rlzeroPipe.transform(this.articles[0].part) + ')';
        this.pageTitle = this.monthToDevanagariPipe.transform(this.articles[0].date)
          + ' '
          + this.toDevanagariPipe.transform(this.articles[0].year)
          + ' (वर्ष '
          + this.toDevanagariPipe.transform(this.rlzeroPipe.transform(this.articles[0].volume))
          + ', अंक '
          + this.toDevanagariPipe.transform(this.rlzeroPipe.transform(this.articles[0].part))
          + ')';
        break;
      case 'author' :
        this.pageTitle = 'लेखक : ' + this.urlParams.get('authornames');
        break;
      case 'translator' :
        this.pageTitle = 'अनुवादक : ' + this.urlParams.get('translatornames');
        break;
      case 'feature' :
        this.pageTitle = 'स्तम्भ : ' + this.urlParams.get('feature');
        break;
      case 'series' :
        this.pageTitle = 'लेखमाला : ' + this.urlParams.get('series');
        break;
      case 'articlesLetterWise' :
        this.pageTitle = 'लेख';
        break;
    }
  }
}
