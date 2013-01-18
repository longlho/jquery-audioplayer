/*jslint laxcomma:true*/
// jQuery plugins
$.extend({
  getUrlVars : function(string) {
    var vars = [];
    var hash;
    var href = string ? string : window.location.href;
    console.log(href);
    if (href.indexOf('#') > -1) {
      var hrefArr = href.split('#');
      href = hrefArr[hrefArr.length - 1];
    }
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },

  getUrlVar : function(string, name) {
    return $.getUrlVars(string)[name];
  }
});

var Player = function (div, song) {

  var _audioModel;

  var _init = function () {
    var $next = $(div + ' button.playback-next')
      , $prev = $(div + ' button.playback-prev')
      , $play = $(div + ' button.playback-play')
      , $trackInfo = $(div + ' p.track-info')
      , $songProgress = $trackInfo.find('.song-progress')
      , $loading = $songProgress.find('.loading')
      , $timeLeft = $trackInfo.find('.timeleft')
      , $slider = $songProgress.find('.ui-slider')
      , $handle = $slider.find('.ui-slider-handle')
      , $title = $(div + ' h1.ui-title')
      , $buttonText = $play.parent().find('.ui-btn-text')
      , $audio = $(div + ' audio');

    _audioModel = new JAudio($audio);
    $audio
      .on('change:src', function (ev, filename) {
        var filenameArr = filename.split('/')
          , songName = filenameArr[filenameArr.length - 1];
        $title.text(songName);
      })
      .on('change:state', function (ev, state) {
        return $buttonText.text(state === 'play' ? "||" : 'Play');
      });

    // Hide the number of the slider
    $songProgress.find('input[type="number"]').hide();

    $loading = $slider.find('div.loading');
    if (!$loading.get(0)) {
      $handle.before('<div class="ui-slider loading" style="width: 3%; float: left; top: -15px; left: -3%; background-color: buttonface;"></div>');
      $loading = $slider.find('div.loading');
    }
    _audioModel.fetch(song);

    _setupProgress({
      model: _audioModel,
      handle : $handle,
      timeLeft : $timeLeft,
      loading : $loading
    });
    _setupControls({
      model : _audioModel,
      next : $next,
      prev : $prev,
      play : $play
    });
  };

  var _setupControls = function (options) {
    var model = options.model;

    options.play.click(function () {
      switch (model.getState()) {
        case 'play':
          model.setState('pause');
          break;
        case 'pause':
          model.setState('play');
          break;
      }
    });
    options.next.click(function () {
      _audioModel.fetch(_audioModel.getCurrent() + 1);
    });
    options.prev.click(function () {
      _audioModel.fetch(_audioModel.getCurrent() - 1);
    });
  };
  
  var _setupProgress = function (options) {
    var model = options.model
      , manualSeek = false
      , loaded = false
      , audio = model.getDOMJAudio();

    options.handle.css('top', '50%');
    model.$audio
      .on('progress', function () {
        var buffered = this.buffered.end(0);
        if (!buffered) return;
        var loaded = parseInt(((buffered / this.duration) * 100) + 3, 10);
        options.loading.css('width', loaded + '%');
      })
      .on('timeupdate', function () {
        var rem = parseInt(audio.duration - audio.currentTime, 10),
        pos = Math.floor((audio.currentTime / audio.duration) * 100),
        mins = Math.floor(rem/60, 10),
        secs = rem - mins * 60;

        options.timeLeft.text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
        if (!manualSeek) { options.handle.css({left: pos + '%'}); }
        if (!loaded) {
          loaded = true;
        }
      });
  };

  _init();
};
