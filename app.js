var app = require('express').createServer();
var fs = require('fs');

var public_path = 'public/';
var PORT = 8080;
var MUSIC_PATH = 'music/';
var songs;
app.get('/', function(req, res) {
	console.log("Request from:" + req.connection.remoteAddress);
	res.sendfile(public_path + 'index.html');
});

app.get('/*', function(req, res) {
	console.log("Request from:" + req.connection.remoteAddress);
	var page = req.params[0];	
	res.sendfile(public_path + page);
	
});

app.post('/playlist.html', function(req, res){
	console.log("Request from:" + req.connection.remoteAddress);
	Controller.handlePlaylist(req, res);
});


var Playlist = {	
	
	get : function(name) {
		return fs.readdirSync(public_path + MUSIC_PATH + name);	
	}
};

var Controller = {

	handlePlaylist : function(req, res) {
        	if (!songs) {
                	songs = Playlist.get(req.param('playlist'));
        	}
        	var index = req.param('song');
        	if (index && index >=0 && index < songs.length) {
                	res.send({ 'result' : MUSIC_PATH + 'kpop/' + songs[index] });
        	} else {
	        	res.send({
                     		'filenames' : songs
                	});
        	}
	}
};

console.log("Server running at port " +  PORT);
app.listen(8080);
