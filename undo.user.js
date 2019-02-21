// ==UserScript==
// @name GRASP undo
// @version 1.0
// @description Undo with link to GRASP
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/undo.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/undo.user.js
// @include https://*.gamepedia.com/*
// @require https://help.gamepedia.com/load.php?modules=jquery&only=scripts
// @grant none
// ==/UserScript==

var $Summary = $( '#wpSummary input[type=text],#wpSummary[type=text]' );
if ( $('.mw-undo-success').length ) $Summary.val( '[[gphelp:GRASP|GRASP]]: ' + $Summary.val() );
