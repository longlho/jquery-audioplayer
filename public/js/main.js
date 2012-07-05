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

// Rudimentary wrapper that acts like a model, but I don't wanna bring Backbone
// in since this POC is simple.
var Audio = function ($audio) {
  var _this = this;
  this.$audio = $audio;

  var _reset = function (index, filename) {
    if (!filename) return;
    this.$audio.data('current', parseInt(index, 10));
    this.$audio.trigger('change:index', $audio.data('current'));
    this.$audio.attr('src', filename);
    this.$audio.trigger('change:src', filename);
    this.setState($audio.data('state') || 'play');
  };

  this.$audio.on('ended', function () {
    _this.fetch(_this.getCurrent() + 1);
  });

  this.setState = function (state) {
    switch (state) {
      case 'play':
        this.getDOMAudio().play();
        break;
      case 'pause':
        this.getDOMAudio().pause();
        break;
    }
    this.$audio.data('state', state);
    this.$audio.trigger('change:state', state);
  };
  this.getState = function () {
    return this.$audio.data('state');
  };
  this.getCurrent = function () {
    return this.$audio.data('current');
  };
  this.fetch = function (index, options) {
    if (index < 0) index = 0;
    $.getJSON('playlist?song=' + index, null, function (data) {
      _reset.call(_this, index, data.result);
      if (!options) return;
      $.isFunction(options.success) && options.success();
    });
  };
  this.getDOMAudio = function () {
    return $audio.get(0);
  };
}

var Player = function (div, song) {

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
      _audio.fetch(_audio.getCurrent() + 1);
    });
    options.prev.click(function () {
      _audio.fetch(_audio.getCurrent() - 1);
    });
  }
  ,   _setupProgress = function (options) {
    var model = options.model
      , audio = model.getDOMAudio();
    model.$audio.on('progress', function () {
      console.log(this.buffered.end(0));
      console.log(this.duration);
      var loaded = parseInt(((this.buffered.end(0) / this.duration) * 100) + 3, 10);
      options.loading.css('width', loaded + '%');
    });
    var manualSeek = false;
    var loaded = false;
    options.handle.css('top', '-50%');
    model.$audio.on('timeupdate', function () {
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



  var $next = $(div + ' button.playback-next')
  ,   $prev = $(div + ' button.playback-prev')
  ,   $play = $(div + ' button.playback-play')
  ,   $trackInfo = $(div + ' p.track-info')
  ,   $songProgress = $trackInfo.find('.song-progress')
  ,   $loading = $songProgress.find('.loading')
  ,   $timeLeft = $trackInfo.find('.timeleft')
  ,   $slider = $songProgress.find('.ui-slider')
  ,   $handle = $slider.find('.ui-slider-handle')
  ,   $title = $(div + ' h1.ui-title')
  ,   $buttonText = $play.parent().find('.ui-btn-text')
  ,   $audio = $(div + ' audio');

  var _audioModel = new Audio($audio);
  $audio.on('change:src', function (ev, filename) {
    var filenameArr = filename.split('/')
    ,   songName = filenameArr[filenameArr.length - 1];
    $title.text(songName);
  });
  $audio.on('change:state', function (ev, state) {
    switch (state) {
      case 'play':
        $buttonText.text("||");
        break;
      case 'pause':
        $buttonText.text("Play");
        break;
    }
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
