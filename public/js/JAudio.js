/*jslint laxcomma:true*/
/*global webkitAudioContext:true*/
(function ($) {
  // Rudimentary wrapper that acts like a model, but I don't wanna bring Backbone
  // in since this POC is simple.
  'use strict';
  var JAudio = function ($audio) {
    var self = this;
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
      self.fetch(self.getCurrent() + 1);
    });

    this.setState = function (state) {
      switch (state) {
        case 'play':
          this.getDOMJAudio().play();
          break;
        case 'pause':
          this.getDOMJAudio().pause();
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
    this.fetch = function (index, opts) {
      if (index < 0) index = 0;
      $.getJSON('playlist?song=' + index, null, function (data) {
        _reset.call(self, index, data.result);
        if (opts && $.isFunction(opts.success)) {
          opts.success();
        }
      });
    };
    this.getDOMJAudio = function () {
      return $audio.get(0);
    };
  };
})(jQuery);
