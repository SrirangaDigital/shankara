const express = require('express');
const _und = require("underscore")
const router = express.Router();

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