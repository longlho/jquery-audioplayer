/*jslint laxcomma:true*/
var express = require('express')
, app = express()
, fs = require('fs')
, PORT = 8081
, MUSIC_PATH = 'music/'
, songs;

var Playlist = (function () {
  return {
    getSong: function(name) {
      return fs.readdirSync(__dirname + '/public/' + MUSIC_PATH + name);
    }
  };
})();

var Controller = {
  handlePlaylist: function(req, res) {
    if (!songs) {
      songs = Playlist.getSong(req.param('playlist'));
    }
    var index = req.param('song');
    if (index && index >= 0 && index < songs.length) {
      return res.send({ 'result': MUSIC_PATH + 'kpop/' + songs[index] });
    }
    return res.send({ 'filenames': songs });
  }
};

app.use(express.static(__dirname + '/public', { maxAge: 86400000 }));
app.all('/playlist', Controller.handlePlaylist);

  
console.log("Server running at port " + PORT);
app.listen(PORT);
