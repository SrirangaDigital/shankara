var os = require('os');
var fs = require('fs');

var commonPath = '';

var commomFolderName = 'vvjcommon';
var discName = 'VIVEK-JYOTI';

switch(os.platform()) {

    case "win32":

    	if(fs.existsSync("J:\\" + commomFolderName)) commonPath = "J:\\" + commomFolderName;
    	if(fs.existsSync("I:\\" + commomFolderName)) commonPath = "I:\\" + commomFolderName;
    	if(fs.existsSync("H:\\" + commomFolderName)) commonPath = "H:\\" + commomFolderName;
    	if(fs.existsSync("G:\\" + commomFolderName)) commonPath = "G:\\" + commomFolderName;
    	if(fs.existsSync("F:\\" + commomFolderName)) commonPath = "F:\\" + commomFolderName;
    	if(fs.existsSync("E:\\" + commomFolderName)) commonPath = "E:\\" + commomFolderName;
    	if(fs.existsSync("D:\\" + commomFolderName)) commonPath = "D:\\" + commomFolderName;
    	if(fs.existsSync("C:\\" + commomFolderName)) commonPath = "C:\\" + commomFolderName;
        break;

    case "linux":

		commonPath = '/media/' + os.userInfo().username + '/' + discName + '/' + commomFolderName;
        break;

    case "darwin":

		commonPath = '/Volumes/' + discName + '/' + commomFolderName;
        break;
}

console.log(commonPath);
module.exports = commonPath;