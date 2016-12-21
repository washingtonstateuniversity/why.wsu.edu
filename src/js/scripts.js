( function( $, window, document ) {

	"use strict";

	// Check for `mix-blend-mode` support and add a class to the HTML tag accordingly.
	document.addEventListener( "DOMContentLoaded", function() {
		var supportsMixBlendMode = window.getComputedStyle( document.body ).mixBlendMode;
		if ( "undefined" === typeof supportsMixBlendMode ) {
			document.documentElement.classList.add( "no-mix-blend-mode" );
		}
	}, false );

	// Fire intro text effects.
	function introText() {
		$( ".intro p span" ).each( function( i ) {
			var span = $( this );

			setTimeout( function() {
				span.addClass( "show" );
			}, i * 250 );
		} );
	}

	// Check if the list is in the viewport.
	function inViewport( list ) {
		var listTop = list.getBoundingClientRect().top,
			listBottom = list.getBoundingClientRect().bottom;

		return ( listTop >= 0 ) && ( listBottom <= window.innerHeight );
	}

	// Add the "show" class to list items at short intervals.
	function showItems( list ) {
		list.children( "li" ).each( function( i ) {
			var item = $( this );

			setTimeout( function() {
				item.addClass( "show" );
			}, i * 250 );
		} );
	}

	// Show list items if they are in the viewport.
	function animateListItems() {
		$( ".animate" ).each( function() {
			var list = this;

			$( list ).children( "li" ).each( function() {
				$( this ).wrapInner( "<div></div>" );
			} );

			// Show items if the list is in the viewport on page load.
			if ( inViewport( list ) ) {
				showItems( $( list ) );
			}

			// Show items if the list is scrolled into the viewport.
			$( document ).on( "scroll", function() {
				if ( inViewport( list ) ) {
					showItems( $( list ) );
				}
			} );
		} );
	}

	/**
	 * Set up variables for:
	 * 		Tracking the number of videos playing at any given time. @type {number}
	 * 		Tracking the initial position of a video on the screen. @type {number}
	 *      Tracking the IDs of the videos currently playing. @type {Array}
	 */
	var scroll_event_set = 0,
		video_off_screen_position = [],
		video_ids_playing = [];

	/**
	 * Place a playing video into an on-page or off-page state depending on
	 * its location in the page when scrolling.
	 */
	var handle_scroll_event = function() {
		var video, video_off_screen;

		for ( var video_id in video_off_screen_position ) {
			if ( video_off_screen_position.hasOwnProperty( video_id ) ) {
				video = $( "#wsuwp-youtube-video-" + video_id ).closest( ".wsuwp-youtube-wrap-outer" );
				video_off_screen = ( 0 <= $( window ).scrollTop() - video_off_screen_position[ video_id ] );

				if ( video_off_screen && false === video.hasClass( "video-in-scroll" ) && true === video_ids_playing[ video_id ] ) {
					video.addClass( "video-in-scroll" );
				}

				if ( !video_off_screen && video.hasClass( "video-in-scroll" ) ) {
					video.removeClass( "video-in-scroll" );
				}
			}
		}
	};

	/**
	 * Callback function expected by the YouTube Iframe API. Without a function
	 * with this name available in the global space, our use of the YouTube API
	 * does not work.
	 *
	 * Loop through each of the inline YouTube Videos, gather the video information,
	 * and set up objects representing the videos.
	 */
	window.onYouTubeIframeAPIReady = function() {
		$( ".wsuwp-youtube-embed" ).each( function() {
			var video_id = $( this ).data( "video-id" ),
				video_height = $( this ).data( "video-height" ),
				video_width = $( this ).data( "video-width" ),
				video_autoplay = $( this ).data( "video-autoplay" ),
				video_controls = $( this ).data( "video-control" ),
				video_end = $( this ).data( "video-end" ),
				video_loop = $( this ).data( "video-loop" ),
				video_modestbranding = $( this ).data( "video-modestbranding" ),
				video_playsinline = $( this ).data( "video-playsinline" ),
				video_rel = $( this ).data( "video-rel" ),
				video_showinfo = $( this ).data( "video-showinfo" ),
				video_start = $( this ).data( "video-start" );

			new window.YT.Player( "wsuwp-youtube-video-" + video_id, {
				height: video_height,
				width: video_width,
				videoId: video_id,
				playerVars: {
					autoplay: video_autoplay,
					controls: video_controls,
					end: video_end,
					loop: video_loop,
					modestbranding: video_modestbranding,
					playsinline: video_playsinline,
					rel: video_rel,
					showinfo: video_showinfo,
					start: video_start
				},
				events: {
					"onReady": window.onPlayerReady,
					"onStateChange": window.onPlayerStateChange
				}
			} );
		} );
	};

	/**
	 * Callback function expected by the YouTube iFrame API based on our specification
	 * in the events data above.
	 *
	 * @param event
	 */
	window.onPlayerReady = function( e ) {
		var video_id = $( e.target.h ).data( "video-id" );

		$( ".wsuwp-youtube-wrap-inner" ).on( "click", function() {
			e.target.playVideo();
		} );

		video_off_screen_position[ video_id ] = $( "#wsuwp-youtube-video-" + video_id ).offset().top;
		video_ids_playing[ video_id ] = false;
	};

	/**
	 * Bind and unbind the scrolling event when the state of a video changes
	 * between play and anything else.
	 *
	 * @param event
	 */
	window.onPlayerStateChange = function( event ) {
		if ( "undefined" === typeof event ) {
			return;
		}

		var video_id = $( event.target.h ).data( "video-id" ),
			video_wrapper = $( "#wsuwp-youtube-video-" + video_id ).closest( ".wsuwp-youtube-wrap-outer" );

		if ( 1 === event.data && false === video_ids_playing[ video_id ] ) {
			video_ids_playing[ video_id ] = true;
			video_wrapper.addClass( "playing" );
		} else if ( 2 === event.data && true === video_ids_playing[ video_id ] ) {
			video_ids_playing[ video_id ] = false;
		}

		if ( 1 === event.data && 0 < scroll_event_set ) {
			scroll_event_set++;
		} else if ( 1 === event.data && 0 === scroll_event_set ) {
			$( document ).on( "scroll", handle_scroll_event );
			scroll_event_set = 1;
		} else if ( 2 === event.data && 1 < scroll_event_set ) {
			scroll_event_set--;
		} else if ( 2 === event.data && 1 === scroll_event_set ) {
			$( document ).unbind( "scroll", handle_scroll_event );
			scroll_event_set = 0;
		}
	};

	// Fix the header element
	function fix_header() {
		var $header = $( ".why-header" ),
			dist = 193 - $( window ).scrollTop(), // 193 is the height of the pillar
			width = $( window ).width();

		if ( width <= 990 && !$header.hasClass( "fixed" ) ) {
			$header.addClass( "fixed" );
		}

		if ( width > 990 && dist <= 58 && !$header.hasClass( "fixed" ) ) {
			$header.addClass( "fixed" );
		}

		if ( width > 990 && dist > 58 && $header.hasClass( "fixed" ) ) {
			$header.removeClass( "fixed" );
		}
	}

	// Fire functions once the document is ready.
	$( document ).ready( function() {
		introText();
		animateListItems();
	} );

	$( window ).on( "load scroll resize", fix_header );
}( jQuery, window, document ) );
