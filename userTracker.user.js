// ==UserScript==
// @name Global user tracker
// @version 1.3
// @description Track a user from the profile
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/userTracker.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/userTracker.user.js
// @include https://*.gamepedia.com/UserProfile:*
// @run-at document-idle
// ==/UserScript==

function userTracker() {

$( '.section.stats' ).find( 'dd' ).first().replaceWith( function() {
	var props = {
		href: 'https://help.gamepedia.com/Gamepedia_Help_Wiki:Global_user_tracker#' + window.location.hostname.replace( '.gamepedia.com', '' ) + '/' + $( '.headline > h1 > .mw-headline' ).text().replace(/ /g,'_'),
		title: 'Track this user globally',
		target: '_blank'
	};
	return $( '<dl>' ).append(
		$( '<dt>' ).append(
			$( '<a>' ).prop( props ).text( 'Track user' )
  ),
    $( '<dd>' ).text( $( this ).text() )
  )
} );

}
function checkjQ() {
	if (!document.getElementsByClassName('mediawiki').length) return clearInterval(wait_for_it);
	if ($) {
		clearInterval(wait_for_it);
		userTracker();
	} else {
		return false;
	}
}
var wait_for_it = setInterval(checkjQ, 20);
