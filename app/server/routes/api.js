const express = require('express');
const _und = require("underscore")
const router = express.Router();

// Bring in Article Model
let Article = require('../models/article');

// Get distinct params
router.get('/distinct/:param', function(req, res){

	var param = req.params.param;
	
	var query = {};
	_und.each(req.query, function(value, key) {

		// Values beginning with an '@' are treated as regular expressions
		query[key] = (value.match(/^@/)) ? new RegExp(value.replace('@', ''), 'i') : value;
	});

	getDistinctParams(res, query, param);	
});

router.get('/articles', function(req, res){

	// Remove keys with null values
	req.query = _und.pick(req.query, _und.identity);


	var query = {};
	_und.each(req.query, function(value, key) {

		// Values beginning with an '@' are treated as regular expressions
		query[key] = (value.match(/^@/)) ? new RegExp(value.replace('@', ''), 'i') : value;
	});

	if(_und.isEmpty(query)) return res.json([]);

	var sort = {};
	if ('title' in query) sort['title'] = 1;
	sort['volume'] = 1; sort['part'] = 1; sort['page'] = 1;

	Article.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/parts', function(req, res){

	// Remove keys with null values
	req.query = _und.pick(req.query, _und.identity);

	var query = {};
	_und.each(req.query, function(value, key) {

		// Values beginning with an '@' are treated as regular expressions
		query[key] = (value.match(/^@/)) ? new RegExp(value.replace('@', ''), 'i') : value;
	});

	if(_und.isEmpty(query)) return res.json([]);

	var projection = {}; projection['date'] = 1; projection['month'] = 1; projection['volume'] = 1; projection['part'] = 1; projection['_id'] = 0;
	var sort = {}; sort['month'] = 1;

	Article.find(query, projection).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 

			return res.json(_und.uniq(result, 'part'));
	});
});

router.get('/covers', function(req, res){

	var query = {};

	var projection = {}; projection['date'] = 1; projection['month'] = 1; projection['volume'] = 1; projection['part'] = 1; projection['year'] = 1; projection['_id'] = 0;
	var sort = {}; sort['volume'] = 1; sort['part'] = 1;

	Article.find(query, projection).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 

			return res.json(_und.uniq(result, 'date'));
	});
});

router.get('/authors/:letter', function(req, res){

	// Bring in AuthorIndex model
	let AuthorIndex = require('../models/authorIndex');

	var query = {};
	var sort = {};

	if(req.params.letter == 'Featured') {

		query['count'] = {'$gt' : 50};
		sort['count'] = -1;
	}
	else{

		query['author'] = new RegExp('^' + req.params.letter, 'i');
		sort['author'] = 1;
	}


	AuthorIndex.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/authors', function(req, res){

	// Bring in AuthorIndex model
	let AuthorIndex = require('../models/authorIndex');

	var query = {};
	var sort = {};

	sort['author'] = 1;

	AuthorIndex.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/translators/:letter', function(req, res){

	// Bring in TranslatorIndex model
	let TranslatorIndex = require('../models/translatorIndex');

	var query = {};
	var sort = {};

	if(req.params.letter == 'Featured') {

		query['count'] = {'$gt' : 50};
		sort['count'] = -1;
	}
	else{

		query['translator'] = new RegExp('^' + req.params.letter, 'i');
		sort['translator'] = 1;
	}


	TranslatorIndex.find(query).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);
		else 
			return res.json(result);
	});
});

router.get('/translators', function(req, res){

	// Bring in TranslatorIndex model
	let TranslatorIndex = require('../models/translatorIndex');

	var query = {};
	var sort = {};

	sort['translator'] = 1;

	TranslatorIndex.find(query).sort(sort).exec(function(err, result){

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

	Article.find(query).sort(sort).exec(function(err, result){

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

function getDistinctParams(res, query, param) {

	var projection = {}; projection[param] = 1; projection['_id'] = 0;
	var sort = {}; sort[param] = 1;

	Article.find(query, projection).sort(sort).exec(function(err, result){

		if(err)			
			console.log(err);

		else {

			iteratee = function(row){return row[param];};

			var data = _und.map(result, iteratee);
			data = _und.without(_und.sortBy(_und.unique(_und.flatten(data))), "");

			return res.json(data);
		}
	});
}

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