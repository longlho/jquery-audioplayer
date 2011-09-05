// JavaScript Document

Body = {
	nav: '#nav',
	content: '#content',
	header: "#header",
	main: "#main",
	sidebar: '#sidebar',
	ribbon: '.ribbon',
	randomFacts : ["My favorite show is 'America's Best Dance Crew'",
				   "I like Asian food... mainly because I'm Asian",
				   "Favorite movie... hmmm anything that is CG-heavy, like Transformers and such",
				   "Final Fantasy is definitely my all time favorite game",
				   "I actually DO know how to cook reasonably well, thanks to my mom",
				   "I used to have a dog named Milu... until my mom gave her away since we didn't clean up",
				   "I do spend a small chunk of my time on Facebook and Youtube (who doesn't... duh!)",
				   "Favorite book, hmmm probably Da Vinci Code but I hate the movie though",
				   "I drink Smirnoff as the only acoholic beverage... not Vodka",
				   "I used to have 2 fish (Boy and Girl) until they kill each other... too bad",
				   "I almost fried my processor during my first time assembling a PC... almost lost $200"],
	factDiv: '#fact',
	
	//Setup navigation and effects
	setup: function() {
		$(Body.nav +' ul li').click(function(){
			var $clickedli = $(this);
			if ($clickedli.hasClass('active'))
				return;
			$clickedli.siblings().removeClass('active')
			var target = $clickedli.attr('data-target');
			$(Body.content).fadeOut(100, function(){
				/*if (target == 'resume') {
					window.open('resume.pdf');
				} else {
					*/
					if (target =='portfolio') {
						Portfolio.load();
					}
					$('#'+target).css('display','block').siblings('div').css('display', 'none');
				//}
			})
			.fadeIn(100, function(){
				$clickedli.addClass('active');
			});
		});	
	}

},


Portfolio = {
	url : 'parts.html',
	wrapper: '#portfolio',
	//Load portfolio
	load: function() {
		$(Body.content+ ' '+ Portfolio.wrapper).load(Portfolio.url+' '+Body.content+' > .article', null, function(){
			
			//Setup fancybox image viewer
			$("a[rel=metadb], a[rel=compart], a[rel=mauthner], a[rel=ilaf], a[rel=damtycoon]").fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
				    return '<span id="fancybox-title-over"> ' +  title + '</span>';
				}
			});
			
			//Setup content accordion effects
			$('.article').find('div').css('display','none');
			$('.article').find('label').click(function(){
				var $label = $(this);
				var $parent = $label.parents('.article');
				var $prevSiblings = $parent.prevAll();
				var $nextSiblings = $parent.nextAll();
				if ($parent.hasClass('opened')) {
					$label.siblings('div:first').hide('slide',{},500, function(){
						$prevSiblings.show('blind', {}, 500);
						$nextSiblings.show('slide',{},500);														 
					});
					$parent.removeClass('opened');	
				} else {
			
					if ($nextSiblings.length == 0) {
						$prevSiblings.hide('blind', {}, 500, function(){
							$label.siblings('div').css('display','block');
							$label.siblings('div').show('slide',{},500);
						});
					} else {
						$prevSiblings.hide('blind', {}, 500);
						$nextSiblings.hide('slide',{},500, function(){
							$label.siblings('div').css('display','block');
							$label.siblings('div').show('slide',{},500);																 
						});
					}
					$parent.addClass('opened');	
				}
		
			});
		});
	}
},

Content = {
	
		
};




 