const express = require('express');
const router = express.Router();
const elasticlunr = require('elasticlunr');
const fs = require('fs');
const path = require('path');

// Create index and store it to a file
router.get('/', function(req, res){

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

			console.log(volumeData[j]['pageid']);
	        searchIndex.addDoc(volumeData[j]);
	    }
		
	    if ((i % 1 == 0) || (i == 20)) {

			outFileStr = "" + outFile;
			outFileStr = pad.substring(0, pad.length - outFileStr.length) + outFileStr;

			fs.writeFileSync(path.join(__dirname, '../../public/index/searchIndex' + outFileStr + '.json'), JSON.stringify(searchIndex));
			searchIndex = elasticlunr(function () {

			    this.addField('text');
			    this.setRef('pageid');
			    this.saveDocument(false);
			});
			outFile++;
	    }
	}

});

module.exports = router;