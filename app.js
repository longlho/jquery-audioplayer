var express = require('express');
var app = express.createServer();
var fs = require('fs');

var PORT = 8080;
var MUSIC_PATH = 'music/';
var songs;
app.use(express.static(__dirname + '/public', {maxAge : 86400000}));


app.post('/playlist', function(req, res){
	console.log("Request from:" + req.connection.remoteAddress);
	Controller.handlePlaylist(req, res);
});


var Playlist = {	
	
	get : function(name) {
		return fs.readdirSync(__dirname + '/public/' + MUSIC_PATH + name);	
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
app.listen(PORT);
