// ==UserScript==
// @name GRASP fastDelete
// @version 3.4
// @description Fast delete a page
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/fastDelete.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/fastDelete.user.js
// @include https://*.gamepedia.com/*
// @exclude https://*.gamepedia.com/api.php*
// @exclude https://www.gamepedia.com/*
// @run-at document-idle
// @grant GM_addStyle
// ==/UserScript==

function fastDelete() {

GM_addStyle (`
@import "/load.php?modules=mediawiki.ui.input|mediawiki.ui.button&only=styles";
#fast-delete-summary {
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
.fast-delete-div {
	display: flex;
}
.fast-delete-text, .fast-block-text {
	flex: auto;
	margin-right: 1em;
}
.fast-delete-submit-button, .fast-block-submit-button {
	flex: none;
}
`);

$( function() {
'use strict';

mw.loader.using(['site','mediawiki.util','mediawiki.api']).done(function() {
	$(mw.util.addPortletLink('p-cactions', 'javascript:;', "Fast delete", 'ca-fast-delete', "Fast delete this page")).click(function() {
		var $fastdelete = $( '#fast-delete-summary' );

		if ( $fastdelete.length ) {
			$fastdelete.toggle();
		} else {
			$fastdelete.remove();

			$fastdelete = $( '<div id="fast-delete-summary">' ).append(
				$( '<div>' ).addClass( 'fast-delete-div' ).append(
					$( '<input type="text" list="fast-delete-reason">' ).addClass( 'mw-ui-input fast-delete-text' ).prop( { maxlength: 250, spellcheck: true } ).val(
						'[[gphelp:GRASP|GRASP]]: '
					),
					$( '<datalist id="fast-delete-reason">' ).append(
						$( '<option>' ).addClass( 'mw-ui-input fast-delete-reason-option' ).val( '[[gphelp:GRASP|GRASP]]: Spam article' ),
						$( '<option>' ).addClass( 'mw-ui-input fast-delete-reason-option' ).val( '[[gphelp:GRASP|GRASP]]: Vandalism' ),
						$( '<option>' ).addClass( 'mw-ui-input fast-delete-reason-option' ).val( '[[gphelp:GRASP|GRASP]]: Empty page' )
					),
					$( '<input type="button">' ).addClass( 'mw-ui-button mw-ui-constructive fast-delete-submit-button' ).val( 'Delete page' )
				),
				$( '<div>' ).addClass( 'fast-delete-div' ).append(
					$( '<input type="text" list="fast-block-reason">' ).addClass( 'mw-ui-input fast-block-text' ).prop( { maxlength: 250, spellcheck: true } ).val(
						'[[gphelp:GRASP|GRASP]]: Creating spam articles'
					),
					$( '<datalist id="fast-block-reason">' ).append(
						$( '<option>' ).addClass( 'fast-block-reason-option' ).val( '[[gphelp:GRASP|GRASP]]: Creating spam articles' ),
						$( '<option>' ).addClass( 'fast-block-reason-option' ).val( '[[gphelp:GRASP|GRASP]]: Spam bot' ),
						$( '<option>' ).addClass( 'fast-block-reason-option' ).val( '[[gphelp:GRASP|GRASP]]: Vandalism' )
					),
					$( '<input type="button">' ).addClass( 'mw-ui-button mw-ui-constructive fast-block-submit-button' ).val( 'Delete page and block page creator' )
				)
			).insertBefore( '#p-cactions' );
		}
	});

	$( '#right-navigation' ).on( 'click', '.fast-block-submit-button', function() {
		$( '#fast-delete-summary' ).hide();
		new mw.Api().get({action:'query',list:'recentchanges',rctype:'new',rcprop:'title|user'}).done(function(data){
			var creation = data.query.recentchanges.find( edit => edit.title.replace(/ /g,'_') == mw.config.get("wgPageName") );
			if ( creation ) {
				new mw.Api().postWithToken('csrf',{action:'block',user:creation.user,expiry:'2 weeks',reason:$( '.fast-block-text' ).val(),anononly:true,nocreate:true,autoblock:true,allowusertalk:true}).done(function(data){
					$( '.fast-delete-submit-button' ).click();
				}).fail(function(code, data){
					alert("Couldn't block the user. Reason: " + code);
					$( '.fast-delete-submit-button' ).click();
				});
			} else {
				alert("Couldn't block the user. Reason: Page is too old, couldn't fetch creator");
				$( '.fast-delete-submit-button' ).click();
			}
		}).fail(function(code, data){
			alert("Couldn't block the user. Reason: " + code);
			$( '.fast-delete-submit-button' ).click();
		});
	});

	$( '#right-navigation' ).on( 'click', '.fast-delete-submit-button', function() {
		$( '#fast-delete-summary' ).hide();
		new mw.Api().postWithToken('csrf',{action:"delete",title:mw.config.get("wgPageName"),reason:$( '.fast-delete-text' ).val(),watchlist:"nochange"}).done(function(data){
			window.location = '/' + data.delete.title;
		}).fail(function(code, data){
			alert("Could not delete this page. Reason: " + code);
			location.reload();
		});
	});

	// Allow to be submitted by pressing enter while focused on the input field
	$( '#right-navigation' ).on( 'keypress', '.fast-delete-text', function( e ) {
		if ( e.which !== 13 ) {
			return;
		}
		e.preventDefault();
		$( '.fast-delete-submit-button' ).click();
	});
	$( '#right-navigation' ).on( 'keypress', '.fast-block-text', function( e ) {
		if ( e.which !== 13 ) {
			return;
		}
		e.preventDefault();
		$( '.fast-block-submit-button' ).click();
	});

	// Close if clicked anywhere else
	$( window ).click( function( e ) {
		if ( !$( e.target ).is( '#fast-delete-summary, #ca-fast-delete > a' ) && !$( '#fast-delete-summary' ).has( e.target ).length ) {
			$( '#fast-delete-summary' ).hide();
		}
	});
});

});

}
function checkjQ() {
	if (!document.getElementsByClassName('mediawiki').length) return clearInterval(wait_for_it);
	if ($&&mw&&mw.loader&&mw.loader.using) {
		clearInterval(wait_for_it);
		if ( $( '#ca-delete' ).length ) fastDelete();
	} else {
		return false;
	}
}
var wait_for_it = setInterval(checkjQ, 20);
