// ==UserScript==
// @name GRASP undo
// @version 1.4
// @description Undo with link to GRASP
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/undo.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/undo.user.js
// @include https://*.gamepedia.com/*
// @exclude https://*.gamepedia.com/api.php*
// @exclude https://www.gamepedia.com/*
// @grant none
// ==/UserScript==

function graspUndo() {
    var $Summary = $( '#wpSummary input[type=text],#wpSummary[type=text]' );
    $Summary.val( '[[gphelp:GRASP|GRASP]]: ' + $Summary.val() );
}
function checkjQ() {
	if (!document.getElementsByClassName('mediawiki').length) return clearInterval(wait_for_it);
	if ($) {
		clearInterval(wait_for_it);
		if ( $('.mw-undo-success').length ) graspUndo();
	} else {
		return false;
	}
}
var wait_for_it = setInterval(checkjQ, 20);
