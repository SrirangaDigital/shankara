const express = require('express');
const _und = require("underscore")
const router = express.Router();

const elasticlunr = require('elasticlunr');
const fs = require('fs');
const path = require('path');

// Bring in Volume Model
let Volume = require('../models/volume');

router.get('/volumes', function(req, res){

	// Remove keys with null values
	req.query = _und.pick(req.query, _und.identity);


	var query = {};
	var sort = {};
	sort['volume'] = 1;

	Volume.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/toc', function(req, res){

	// Remove keys with null values
	req.query = _und.pick(req.query, _und.identity);

	var query = {};
	_und.each(req.query, function(value, key) {

		// Values beginning with an '@' are treated as regular expressions
		query[key] = (value.match(/^@/)) ? new RegExp(value.replace('@', ''), 'i') : value;
	});
	
	var sort = {};
	sort['volume'] = 1;

	Volume.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/search', function(req, res){

	// Remove keys with null values
	req.query = _und.pick(req.query, _und.identity);

	var query = {};
	_und.each(req.query, function(value, key) {

		if(key == 'year') {

			var yearBoundary = getYearBoundary(value);
			query['year'] = {'$gte' : yearBoundary['left'], '$lte' : yearBoundary['right']};
		}
		else{

			value = value.replace(/\s+$/, '');
			value = value.replace(/^\s+/, '');

			query[key] = new RegExp(value.replace(' ', '.*'), 'i');
		}
	});

	if(_und.isEmpty(query)) return res.json([]);

	var sort = {}; sort['volume'] = 1; sort['part'] = 1; sort['page'] = 1;

	Volume.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/search/text/:term/:volume', function(req, res){

	// Bring in SearchIndex Model
	// Only one index is loaded at a time

	var volIndex = ('000' + req.params.volume).substr(-3);

	if ((parseInt(volIndex) < 0) || (parseInt(volIndex) > 56))
		return res.json([]);

	let SearchIndex = require('../models/searchIndex')(volIndex);
	
	let term = req.params.term;

    var result = SearchIndex.search(term, {
        fields: {
            // title: {boost: 1, expand: true}
            text: {boost: 1, expand: false}
        }
    });

	return res.json(result);
});

router.get('/textSearch', function(req, res){

	// Remove keys with null values
	req.query = _und.pick(req.query, _und.identity);

	var pages = [];

	_und.each(req.query.id.split(';'), function(pageid) {

		var pieces = pageid.replace(/sg_.*?\|/, '');
		pages.push(pieces);
	});

	pages = _und.sortBy(pages);

	var query = {};

	query['id'] = req.query.id.replace(/\|.*/, '');

	if(_und.isEmpty(query)) return res.json([]);

	var sort = {}; sort['volume'] = 1; sort['part'] = 1; sort['page'] = 1;

	Volume.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else{

			result[0]['toc'] = '';
			result[0]['pageList'] = pages;

			return res.json(result);
		}
	});

});

router.get('/wordsearch/text/:term/:volume', function(req, res){

	// Bring in WordIndex Model
	// Only one index is loaded at a time

	var volIndex = ('000' + req.params.volume).substr(-3);

	//~ if ((parseInt(volIndex) < 0) || (parseInt(volIndex) > 56))
		//~ return res.json([]);

	let WordIndex = require('../models/wordIndex')(volIndex);
	
	let term = req.params.term;

    var result = WordIndex.search(term, {
        fields: {
            // title: {boost: 1, expand: true}
            word: {boost: 1, expand: false}
        }
    });

	//~ console.log(result.length);
	var matches = []
	for(var i = 0; i < result.length; i++) {
		
		var wordMetaData = result[i]['ref'].split("|");		

		var temp = {};
		temp["text"] = "{{{Text}}} Found in";
		temp["par"] = [{"page": Number(wordMetaData[1]), "boxes": [ {"l": (wordMetaData[2]/2700)*1000, "t": (wordMetaData[3]/4000)*1200, "r": (wordMetaData[4]/2700)*1000, "b": (wordMetaData[5]/4000)*1200}]}];

		matches.push(temp);
	}

	var finalJSON = {};
	finalJSON["matches"] = matches;

	if(matches.length > 0){
		finalJSON["error"] = 0;
	}
	else{
		finalJSON["error"] = 1;
	}
	

	//console.log(finalJSON);	
	//~ console.log(res.json(result));

	//~ console.log("In word search!! " + volIndex);

	return res.json(finalJSON);
});


router.get('/createindex', function(req, res){

	var pad = "000";
    var outFile = 1;
    var outFileStr = '';
	// var indexData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/index/searchIndex001.json'), 'utf8'));
	// var searchIndex = elasticlunr.Index.load(indexData);

	var searchIndex = elasticlunr(function () {

	    this.addField('text');
	    this.setRef('pageid');
	    this.saveDocument(false);
	});

	for(i=1;i<=20;i++) {

		searchIndex.pipeline.remove(elasticlunr.stemmer);
		searchIndex.pipeline.remove(elasticlunr.stopWordFilter);
		searchIndex.pipeline.remove(elasticlunr.trimmer);

		var str = "" + i;
		var id = pad.substring(0, pad.length - str.length) + str;
		
		var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/source/' + id + '.json'), 'utf8'))

		for(j=0;j<volumeData.length;j++) {

				//console.log(volumeData[j]['pageid']);
				searchIndex.addDoc(volumeData[j]);
			}
		
			outFileStr = "" + outFile;
			outFileStr = pad.substring(0, pad.length - outFileStr.length) + outFileStr;
			console.log(outFileStr);
			//console.log("Count ->" + path.join(__dirname, '../../public/index/searchIndex' + outFileStr + '.json'));
			fs.writeFileSync(path.join(__dirname, '../../public/index/searchIndex' + outFileStr + '.json'), JSON.stringify(searchIndex));
			searchIndex = elasticlunr(function () {

				this.addField('text');
				this.setRef('pageid');
				this.saveDocument(false);
			});

			outFile++;
	}

	//console.log("index creation completed");
	var finalJSON = {};
	finalJSON["result"] = "index creation completed";

	return res.json(finalJSON);


});

router.get('/createwordindex', function(req, res){

	var pad = "000";
    var outFile = 1;
    var outFileStr = '';
	// var indexData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/index/searchIndex001.json'), 'utf8'));
	// var searchIndex = elasticlunr.Index.load(indexData);

	var wordIndex = elasticlunr(function () {

	    this.addField('word');
	    this.setRef('pageid');
	    this.saveDocument(false);
	});

	for(i=1;i<=20;i++) {

		wordIndex.pipeline.remove(elasticlunr.stemmer);
		wordIndex.pipeline.remove(elasticlunr.stopWordFilter);
		wordIndex.pipeline.remove(elasticlunr.trimmer);

		var str = "" + i;
		var id = pad.substring(0, pad.length - str.length) + str;	
		var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/wordsource/' + id + '.json'), 'utf8'))

		for(j=0;j<volumeData.length;j++) {

				//console.log(volumeData[j]['pageid']);
				wordIndex.addDoc(volumeData[j]);

		}
		
		outFileStr = "" + outFile;
		outFileStr = pad.substring(0, pad.length - outFileStr.length) + outFileStr;
		//console.log(outFileStr);
		//console.log("Count ->" + path.join(__dirname, '../../public/index/searchIndex' + outFileStr + '.json'));
		fs.writeFileSync(path.join(__dirname, '../../public/wordindex/wordIndex' + outFileStr + '.json'), JSON.stringify(wordIndex));
		wordIndex = elasticlunr(function () {

			this.addField('word');
			this.setRef('pageid');
			this.saveDocument(false);
		});

		outFile++;
	}

	//console.log("word index creation completed");
	var finalJSON = {};
	finalJSON["result"] = "word index creation completed";

	return res.json(finalJSON);
});

router.get('/fulltext', function(req, res){
	
	console.log("HERE!!");
});	

function getYearBoundary(searchString) {

	let yearBoundary = [];
	let years = searchString;

	years = years.replace(/[\:]/, '-');
	years = years.replace(/\s/, '');
	years = years.replace(/\-+/, '-');

	// Make 88 as 1988
	years = years.replace(/^(\d{4})$/, "$1-$1");
	years = years.replace(/^(\d{2})\-/, "19$1-");
	years = years.replace(/\-(\d{2})$/, "-19$1");

	// Sort range
	years = _und.sortBy(years.split('-'));

	yearBoundary['left'] = years[0];
	yearBoundary['right'] = (typeof years[1] == 'undefined') ? '2018' : years[1];

	return yearBoundary;
}

module.exports = router;
