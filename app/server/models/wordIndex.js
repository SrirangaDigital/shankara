module.exports = function(volume){
	
	const elasticlunr = require('elasticlunr');
	const fs = require('fs');
	const path = require('path');

	var indexData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/wordindex/wordIndex' + volume + '.json'), 'utf8'));
	var wordIndex = elasticlunr.Index.load(indexData)

	return wordIndex;
};
