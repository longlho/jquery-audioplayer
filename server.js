var express = require('express')
,   app = express.createServer()
,   fs = require('fs')
,   PORT = 8081
,   MUSIC_PATH = 'music/'
,   songs;


app.use(express.static(__dirname + '/public', { maxAge: 86400000 }));
app.all('/playlist', function(req, res) {
    console.log("Request from:" + req.connection.remoteAddress);
    Controller.handlePlaylist(req, res);
});


var Playlist = (function () {
    return {
        getSong: function(name) {
            return fs.readdirSync(__dirname + '/public/' + MUSIC_PATH + name);
        }
    }
})();

var Controller = (function () {
    return {
        handlePlaylist: function(req, res) {
            if (!songs) {
                songs = Playlist.getSong(req.param('playlist'));
            }
            var index = req.param('song');
            index && index >= 0 && index < songs.length
            ? res.send({ 'result': MUSIC_PATH + 'kpop/' + songs[index] })
            : res.send({ 'filenames': songs });
        }
    }
})();

console.log("Server running at port " + PORT);
app.listen(PORT);
