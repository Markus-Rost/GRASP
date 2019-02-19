// ==UserScript==
// @name GRASP fastDelete
// @version 1.0
// @description Fast delete a page
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/fastDelete.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/fastDelete.user.js
// @include https://*.gamepedia.com/*
// @require https://help.gamepedia.com/load.php?modules=jquery&only=scripts
// @run-at document-idle
// @grant unsafeWindow
// @grant GM_addStyle
// ==/UserScript==

if ( $( '#ca-delete' ).length ) {

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
#fast-delete-summary > div {
	display: flex;
}
#fast-delete-summary > div > .fast-delete-text, #fast-delete-summary > div > .fast-block-text {
	flex: auto;
	margin-right: 1em;
}
#fast-delete-summary > div > .fast-delete-submit-button, #fast-delete-summary > div > .fast-block-submit-button {
	flex: none;
}
`);

$( function() {
'use strict';

var mw = unsafeWindow.mw;
mw.loader.using(['site','mediawiki.util']).done(function() {
	$(mw.util.addPortletLink('p-cactions', 'javascript:;', "Fast delete", 'ca-fast-delete', "Fast delete this page")).click(function() {
		var $rollback = $( '#fast-delete-summary' );

		if ( $rollback.length ) {
			$rollback.toggle();
		} else {
			$rollback.remove();

			$rollback = $( '<div id="fast-delete-summary">' ).append(
				$( '<div>' ).append(
					$( '<input type="text">' ).addClass( 'mw-ui-input fast-delete-text' ).prop( { maxlength: 250, spellcheck: true } ).val(
						'[[gphelp:GRASP|GRASP]]: Spam article'
					),
					$( '<input type="button">' ).addClass( 'mw-ui-button mw-ui-constructive fast-delete-submit-button' ).val( 'Delete page' )
				),
				$( '<div>' ).append(
					$( '<input type="text">' ).addClass( 'mw-ui-input fast-block-text' ).prop( { maxlength: 250, spellcheck: true } ).val(
						'[[gphelp:GRASP|GRASP]]: Creating spam articles'
					),
					$( '<input type="button">' ).addClass( 'mw-ui-button mw-ui-constructive fast-block-submit-button' ).val( 'Delete page and block page creator' )
				)
			).insertBefore( '#p-cactions' );
		}
	});

	$( '#right-navigation' ).on( 'click', '.fast-block-submit-button', function() {
		$( '#fast-delete-summary' ).hide();
		new mw.Api().get({action:'query',list:'recentchanges',rctype:'new',rcprop:'title|user'}).done(function(data){
			var creation = data.query.recentchanges.find( edit => edit.title == mw.config.get("wgPageName") );
			if ( creation ) {
				new mw.Api().postWithToken('csrf',{action:'block',user:creation.user,expiry:'2 weeks',reason:$( '.fast-block-text' ).val(),anononly:true,nocreate:true,autoblock:true,allowusertalk:true}).done(function(data){
					$( '.fast-delete-submit-button' ).click();
				}).fail(function(code, data){
					alert("Couldn't block the user. Reason: ", code);
					$( '.fast-delete-submit-button' ).click();
				});
			}
		}).fail(function(code, data){
			alert("Couldn't block the user. Reason: ", code);
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

	// Close if clicked anywhere else
	$( window ).click( function( e ) {
		if ( !$( e.target ).is( '#fast-delete-summary, #ca-fast-delete > a' ) && !$( '#fast-delete-summary' ).has( e.target ).length ) {
			$( '#fast-delete-summary' ).hide();
		}
	});
});

});

}
