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
			}, i * 500 );
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

	// Fire functions once the document is ready.
	$( document ).ready( function() {
		introText();
		animateListItems();
	} );
}( jQuery, window, document ) );
