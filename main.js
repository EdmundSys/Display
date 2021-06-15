var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var express = require('express');
var app = express();
app.use(express.static('public'));

//Get the config file
let rawdata = fs.readFileSync(path.resolve(process.cwd(), 'public/config.json'));
var config = JSON.parse(rawdata);

//List server settings
console.log('\x1b[32m' + 'Sever settings:');
for (var i = 0; i < Object.keys(config.server).length; i++){
    console.log('\x1b[36m    ' + Object.keys(config.server)[i] + ': \x1b[33m' + Object.values(config.server)[i]);    
}

//List client settings
console.log('\n\x1b[32m' + 'Client settings:');
for (var i = 0; i < Object.keys(config.client).length; i++){    
    console.log('\x1b[36m    ' + Object.keys(config.client)[i] + ': \x1b[33m' + Object.values(config.client)[i]);    
}
console.log('\x1b[37m');

//Main disply html
app.get('/', function(req, res) {    
    res.sendFile(path.join(__dirname + '/index.html'));    
});

//Send url of next image
app.get('/data', function(req, res) {    
    res.send(ChangeImage());
});

//Send client config
app.get('/config', function(req, res) {    
    res.send(config.client);
});

//Start listening
app.listen(config.server.port);
console.log('\n\x1b[32m' + 'Server listening on port ' + config.server.port + '\x1b[37m');

//Open browser
if (config.server.openbrowser){    
    childProcess.exec(config.server.browserArg + ' http://localhost:' + config.server.port);
}

var count = 0; //Total number of pictures found in images folder
var current = 0; //Index of current picture
var EXTENSION = '.jpg'; //Used to only add .jpg files to the image list
var targetFiles; //Used to hold the list of images

//Find all of the jpgs in the image folder
function GetImages() {
    var files = fs.readdirSync('public/Images/');
    targetFiles = files.filter(function(file) {        
        return path.extname(file).toLowerCase() === EXTENSION;
    });
    targetFiles = targetFiles.filter(i => i !== 'DO_NOT_DELETE.jpg'); //Remove the starting image from the list

    count = 0;
    targetFiles.forEach(element => {
        count++;    
    });    
}

GetImages();
setInterval(GetImages, config.server.checkImages);

//return the name of the next image in the list
function ChangeImage() {        
    if(count == 0) return;
    if(current + 1 > count - 1){
        current = 0;
    }
    else {
        current ++;
    }        
    return targetFiles[current].toString();    
}
