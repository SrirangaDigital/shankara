jQuery(document).ready(function($){
	
	//open-close submenu on mobile
	$('.cd-main-nav').on('click', function(event){
		if($(event.target).is('.cd-main-nav')) $(this).children('ul').toggleClass('is-visible');
	});

	// browser window scroll (in pixels) after which the "menu" link is shown
	var offset = 20;

	var navigationContainer = $('#cd-sec-nav'),
		mainNavigation = navigationContainer.find('#cd-sec-main-nav ul');

	//hide or show the "menu" link
	checkMenu();
	$(window).scroll(function(){
		checkMenu();
	});

	//open or close the menu clicking on the bottom "menu" link
	$('body').on('click', '.cd-sec-nav-trigger', function(){

		var navigationContainer = $('#cd-sec-nav'),
			mainNavigation = navigationContainer.find('#cd-sec-main-nav ul');

		$(this).toggleClass('menu-is-open');
		//we need to remove the transitionEnd event handler (we add it when scolling up with the menu open)
		mainNavigation.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend').toggleClass('is-visible');

	});

	function checkMenu() {

		var navigationContainer = $('#cd-sec-nav'),
			mainNavigation = navigationContainer.find('#cd-sec-main-nav ul');

		if( $(window).scrollTop() > offset && !navigationContainer.hasClass('is-fixed')) {
			navigationContainer.addClass('is-fixed').find('.cd-sec-nav-trigger').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				mainNavigation.addClass('has-transitions');
			});
			$('.scroll-top').fadeIn(100);
		} else if ($(window).scrollTop() <= offset) {

			$('.scroll-top').fadeOut(100);
			//check if the menu is open when scrolling up
			if( mainNavigation.hasClass('is-visible')  && !$('html').hasClass('no-csstransitions') ) {
				//close the menu with animation
				mainNavigation.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					//wait for the menu to be closed and do the rest
					mainNavigation.removeClass('is-visible is-hidden has-transitions');
					navigationContainer.removeClass('is-fixed');
					$('.cd-sec-nav-trigger').removeClass('menu-is-open');
				});
			//check if the menu is open when scrolling up - fallback if transitions are not supported
			} else if( mainNavigation.hasClass('is-visible')  && $('html').hasClass('no-csstransitions') ) {
					mainNavigation.removeClass('is-visible has-transitions');
					navigationContainer.removeClass('is-fixed');
					$('.cd-sec-nav-trigger').removeClass('menu-is-open');
			//scrolling up with menu closed
			} else {
				navigationContainer.removeClass('is-fixed');
				mainNavigation.removeClass('has-transitions');
			}
		} 
	}

	$('nav a[href^="#"], .moreNav[href^="#"]').on("click", function(e) {
        e.preventDefault();
        var t = $(this.hash);
        $("body,html").animate({
            scrollTop: t.offset().top
        }, 900, "swing")
    });

    $(document).on('click', ".prefaceTabs a", function() {

    	$('.prefaceTabs a').removeClass('active');

    	var showDiv = $(this).attr('class').replace('nav-item nav-link ', '').replace('active ', '');

    	$(this).addClass('active');

    	$('.prefaceTabsContent div').removeClass('show active');
    	$('.prefaceTabsContent div.' + showDiv).addClass('show active');
    });

    $(document).on('click', ".triggerClick a", function() {

    	var target = $(this).attr('class');
    	target = target.replace(/ .*/, '');
    	console.log(target);
    	$('#navbarNav .' + target)[0].click();
    });
});
