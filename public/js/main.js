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

Player = {
	init : function(div, song) {

        	var $next = $(div + ' button.playback-next');
	        var $prev = $(div + ' button.playback-prev');
	        var $play = $(div + ' button.playback-play');
		var $trackInfo = $(div + ' p.track-info');
		var $songProgress = $trackInfo.find('.song-progress');
		var $loading = $songProgress.find('.loading');
		var $timeLeft = $trackInfo.find('.timeleft');
		var $slider = $songProgress.find('.ui-slider');
		var $handle = $slider.find('.ui-slider-handle');
		$songProgress.find('input[type="number"]').hide();
		var $title = $(div + ' h1.ui-title');
	        var $audio = $(div + ' audio');
		var audio = $audio.get(0);
	        console.log(song);
		Player.getSongPath(song, $audio, $title);


		var $loading = $slider.find('div.loading');
		if (!$loading.get(0)) {
			$handle.before('<div class="ui-slider loading" style="width: 3%; float: left; top: 0; left: -3%; background-color: buttonface;"></div>');
			$loading = $slider.find('div.loading');
		}
		$audio.bind('progress', function() {
			var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100) + 3, 10);
			$loading.css({ width : loaded + '%'});
		});
		var manualSeek = false;
		var loaded = false;
		$handle.css({top : '-50%' });
		$audio.bind('timeupdate', function() {
			var rem = parseInt(audio.duration - audio.currentTime, 10),
			    pos = Math.floor((audio.currentTime / audio.duration) * 100),
			    mins = Math.floor(rem/60, 10),
			    secs = rem - mins * 60;

			$timeLeft.text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
			if (!manualSeek) { $handle.css({left: pos + '%'}); }
			if (!loaded) {
				loaded = true;
			}
		});

		$audio.attr('data-current', song);
		$audio.attr('data-state', 'play');
	        $play.click(function(ev) { 
        	        var $buttonText = $(this).parent().find('.ui-btn-text');
	                if (audio.paused) {
				$audio.attr('data-state', 'play');
        	                audio.play();
                	        $buttonText.text("||");
	                } else {
				$audio.attr('data-state', 'pause');
        	                audio.pause();
                	        $buttonText.text("Play");
	                }
        	});
	        $next.click(function(ev) {
			var state = $audio.attr('data-state');
			var current = parseInt($audio.attr('data-current'));
			Player.getSongPath(current + 1, $audio, $title, function() {
				$audio.attr('data-current', current + 1);
                                if (state == 'play') {
                                      audio.play();
                                }
                        });
	        });
        	$prev.click(function(ev) {
	        	var state = $audio.attr('data-state');
                        var current = parseInt($audio.attr('data-current'));
                        Player.getSongPath(current - 1, $audio, $title, function() {
                                $audio.attr('data-current', current - 1);
                                if (state == 'play') {
                                      audio.play();
                                }
                        });
		});
		$audio.bind('ended', function(ev) {
			$next.click();
		});
	},

	getSongPath : function(index, $audio, $title, fn) {
		$.post('playlist?song=' + index, null, function(data){
			console.log(data);
			$audio.attr('src', data.result);
			var filenameArr = data.result.split('/');
			var filename = filenameArr[filenameArr.length - 1];
			$title.text(filename);
			if ($.isFunction(fn)) {
				fn();
			}
		}, 'json');
	}
}

Portfolio = {
	

	init: function() {
		$('#main-content > ul > li > details').dialog({
			width: 500,
			modal: true,
			autoOpen: false
		});
		//Setup fancybox image viewer
			$("a[rel=metadb], a[rel=compart], a[rel=mauthner], a[rel=ilaf], a[rel=damtycoon]").fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
				    return '<span id="fancybox-title-over"> ' +  title + '</span>';
				}
			});

		$('#sidebar a').fancybox({
			'width'				: '75%',
				'height'			: '75%',
				'autoScale'			: false,
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'type'				: 'iframe',
				titlePosition		: 'over'

		});

	
		$('#main-content > ul > li').click(function(ev, ui){
			var target = $(ev.target).attr('data-details');
			var title = $(ev.target).find('div').html();
			if (target == '' || target === undefined) {
				target = $(ev.target).parents('li:first').attr('data-details');
				title = $(ev.target).html();
			}
			$('details[data-id='+target+']').dialog('option', 'title', title);
			$('details[data-id='+target+']').dialog('open');
		});
	},

	setupNav: function($target) {

	}
}
