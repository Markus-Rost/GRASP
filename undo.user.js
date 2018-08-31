// ==UserScript==
// @name GRASP undo
// @version 1.0
// @description Undo with link to GRASP
// @author MarkusRost
// @include https://*.gamepedia.com/*
// @grant none
// ==/UserScript==

var $Summary = $( '#wpSummary input[type=text],#wpSummary[type=text]' );
if ( $('.mw-undo-success').length ) $Summary.val( '[[gphelp:GRASP|GRASP]]: ' + $Summary.val() );