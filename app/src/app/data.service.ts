import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import { URLSearchParams } from '@angular/http'

import * as _underscore from 'underscore';

@Injectable()
export class DataService {

	result:any;
	constructor(private _http: Http) { }

	getVolumes() {
	
		return this._http.get("http://127.0.0.1:3000/api/volumes")
			.map(result => this.result = result.json());
	}

	getArticles(filter) {
		
		let params = new URLSearchParams();
		for(let key in filter.params) if (key != 'type') params.set(key, filter.params[key])

		return this._http.get("http://127.0.0.1:3000/api/articles?" + params.toString())
			.map(result => this.result = result.json());
	}

	getSearchResults(filter) {

		let params = new URLSearchParams();
		for(let key in filter.params) if (key != 'type') params.set(key, filter.params[key])
			
		return this._http.get("http://127.0.0.1:3000/api/search?" + params.toString())
			.map(result => this.result = result.json());
	}

	getIssueArticles(volume, part) {
	
		return this._http.get("http://127.0.0.1:3000/api/articles?volume=" + volume + "&part=" + part)
			.map(result => this.result = result.json());
	}

	getArticlesLetterWise(letter) {
	
		return this._http.get("http://127.0.0.1:3000/api/articles?title=@^" + letter)
			.map(result => this.result = result.json());
	}
	
	getAllAuthors() {
	
		return this._http.get("http://127.0.0.1:3000/api/authors")
			.map(result => this.result = result.json());
	}
	

	getAuthorsLetterWise(letter) {
	
		return this._http.get("http://127.0.0.1:3000/api/authors/" + letter)
			.map(result => this.result = result.json());
	}

	getTranslatorsLetterWise(letter) {
	
		return this._http.get("http://127.0.0.1:3000/api/translators/" + letter)
			.map(result => this.result = result.json());
	}

	getAllTranslators() {
	
		return this._http.get("http://127.0.0.1:3000/api/translators")
			.map(result => this.result = result.json());
	}

	getFeaturesList() {
	
		return this._http.get("http://127.0.0.1:3000/api/distinct/feature")
			.map(result => this.result = result.json());
	}

	getSeriesList() {
	
		return this._http.get("http://127.0.0.1:3000/api/distinct/series")
			.map(result => this.result = result.json());
	}

	getVolumesList() {
	
		return this._http.get("http://127.0.0.1:3000/api/distinct/volume")
			.map(result => this.result = result.json());
	}

	getCoversList() {
	
		return this._http.get("http://127.0.0.1:3000/api/covers")
			.map(result => this.result = result.json());
	}

	getPartsByYear(year) {
	
		return this._http.get("http://127.0.0.1:3000/api/parts?year=" + year)
			.map(result => this.result = result.json());
	}

	getTextSearchResultsByVolume(filter, volume): Observable<any> {

		let params = new URLSearchParams();
		for(let key in filter.params) if (key != 'type') params.set(key, filter.params[key])

		let searchResult = [];
		params.delete('fulltext');
		return this._http.get("http://127.0.0.1:3000/api/search/text/" + filter.params['fulltext'] + '/' + volume)
			.map(res => res.json()) // convert to object[]
			.map(res => res.map(fulltextResult => fulltextResult.ref)) // get all pageids
			.mergeMap(pageids => {

				let searchResult = [];

				let titleids = pageids.map((id) => id.split('|')[0]);
				let titleidFilter = titleids.join('|');
				let req;

				if(titleidFilter)
					req = this._http.get("http://127.0.0.1:3000/api/search?" + params.toString() + "&titleid=" + titleidFilter);
				else
					req = Observable.of({});

				searchResult.push(req);
				return Observable.forkJoin(searchResult);
			})
			.map(res => { // we have array of Response Object

				return res.map((x:Response) => {
					
					if(_underscore.isEmpty(x)) return [];
					return x.json();
				}); // Array.map not Observable map operator
			});
	}

	getStaticContent(fileName) {

		console.log(fileName);
		return this._http.get(fileName)
			.map(result => this.result = result.text());
	}

}
