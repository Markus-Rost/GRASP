// ==UserScript==
// @name GRASP editableRollback
// @version 1.4
// @description Edit rollback summary with link to GRASP
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/editableRollback.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/editableRollback.user.js
// @include https://*.gamepedia.com/*
// @exclude https://*.gamepedia.com/api.php*
// @exclude https://www.gamepedia.com/*
// @run-at document-idle
// @grant GM_addStyle
// ==/UserScript==

function editableRollback() {

GM_addStyle (`
@import "/load.php?modules=mediawiki.ui.input|mediawiki.ui.button&only=styles";
.grasp-edit-rollback {
	display: inline-block;
	width: 10px;
	height: 10px;
	margin-left: 2px;
	background: url(https://minecraft.gamepedia.com/media/minecraft.gamepedia.com/6/6c/Edit_pencil.png) no-repeat;
	cursor: pointer;
}
#grasp-rollback-summary {
	display: flex;
	align-items: center;
	position: absolute;
	left: 1em;
	right: 1em;
	padding: 0.8em;
	border: 1px solid #CCC;
	background-color: #F9F9F9;
	z-index: 99;
	box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
}
#grasp-rollback-summary > *:first-child {
	flex: auto;
	margin-right: 1em;
}
#grasp-rollback-summary > .grasp-rollback-submit-button {
	flex: none;
}
`);

$( function() {
'use strict';

$( '.mw-rollback-link > a' ).after( $( '<span>' ).addClass( 'grasp-edit-rollback' ).prop( 'title', 'GRASP: Edit rollback summary' ) );
$( '#mw-content-text' ).on( 'click', '.grasp-edit-rollback', function() {
	var $rollback = $( '#grasp-rollback-summary' );

	if ( $( this ).parent().is( $rollback.parent() ) ) {
		$rollback.toggle();
	} else {
		$rollback.remove();

		var name = decodeURIComponent( $( this ).prevAll( 'a' ).slice(-1).prop( 'href' ).match( /&from=(.+)&token/ )[1].replace( /\+/g, ' ' ) );
		$rollback = $( '<div id="grasp-rollback-summary">' ).append(
			$( '<input type="text">' ).addClass( 'mw-ui-input grasp-rollback-text' ).prop( { maxlength: 250, spellcheck: true } ).val(
				'[[gphelp:GRASP|GRASP]]: Reverted edits by [[Special:Contributions/' + name + '|' + name + ']] ([[User talk:' + name + '|talk]])'
			),
			$( '<input type="button">' ).addClass( 'mw-ui-button mw-ui-constructive grasp-rollback-submit-button' ).val( 'Rollback' )
		).insertAfter( this );
	}

	// This puts the cursor at the end of the text
	var $text = $rollback.find( '.grasp-rollback-text' );
	var summary = $text.val();
	$text.focus().val( '' ).val( summary );
} );

$( '#mw-content-text' ).on( 'click', '.grasp-rollback-submit-button', function() {
	var $link = $( this ).closest( '.mw-rollback-link' );
	window.location = $link.find( 'a' ).prop( 'href' ) + '&summary=' + encodeURIComponent( $link.find( '.grasp-rollback-text' ).val() );
} );

// Allow rollback to be submitted by pressing enter while focused on the input field
$( '#mw-content-text' ).on( 'keypress', '.grasp-rollback-text', function( e ) {
	if ( e.which !== 13 ) {
		return;
	}
	e.preventDefault();
	$( '.grasp-rollback-submit-button' ).click();
} );

// Close rollback if clicked anywhere else
$( window ).click( function( e ) {
	if ( !$( e.target ).is( '#grasp-rollback-summary, .grasp-edit-rollback' ) && !$( '#grasp-rollback-summary' ).has( e.target ).length ) {
		$( '#grasp-rollback-summary' ).hide();
	}
} );


} );


}
function checkjQ() {
	if (!document.getElementsByClassName('mediawiki').length) return clearInterval(wait_for_it);
	if ($) {
		clearInterval(wait_for_it);
		if ( $( '.mw-rollback-link' ).length ) editableRollback();
	} else {
		return false;
	}
}
var wait_for_it = setInterval(checkjQ, 20);
