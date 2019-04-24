const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');

var data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/data/volumes.json'), 'utf8'));

for (var i = 0; i < data.length; i++) {
	
	data[i].toc = fs.readFileSync(path.join(__dirname, '../../public/toc/' + data[i].volume + '.html'), 'utf8');
}

db = new Datastore({inMemoryOnly : true});
db.insert(data);

module.exports = db;
