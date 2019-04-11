module.exports = function(volume){
	
	const elasticlunr = require('elasticlunr');
	const fs = require('fs');
	const path = require('path');

	var indexData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/index/searchIndex' + volume + '.json'), 'utf8'));
	var searchIndex = elasticlunr.Index.load(indexData)

	return searchIndex;
};