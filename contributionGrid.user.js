// ==UserScript==
// @name contributionGrid
// @version 1.0
// @description Contribution grid (starting week with Monday)
// @author MarkusRost
// @updateURL https://github.com/Markus-Rost/GRASP/raw/master/contributionGrid.user.js
// @downloadURL https://github.com/Markus-Rost/GRASP/raw/master/contributionGrid.user.js
// @include https://*.gamepedia.com/UserProfile:*
// @run-at document-idle
// ==/UserScript==

function contributionGrid() {

mw.loader.using(['site','mediawiki.util','mediawiki.api']).then(function() {
	if (mw.config.get("wgNamespaceNumber") != 202) return;
	var user = mw.config.get("wgPageName").slice(12);
	var a = new mw.Api();
	var startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
	var contribs = [];
	var dateContribs = [];
	var testDate = startDate;
	while (testDate.slice(0,10) <= new Date().toISOString().slice(0,10)) {
		dateContribs.push({date:testDate.slice(0,10),contribs:0});
		testDate = new Date(new Date(testDate).getTime() + 86400000).toISOString();
	}
	function findIndex(date) {
		for (var i in dateContribs) {
			if (dateContribs[i].date == date) return i;
		}
		return -1;
	}
	function processData() {
		for (var c in contribs) {
			dateContribs[findIndex(contribs[c].timestamp.slice(0,10))].contribs++;
		}
		var numWeeks = dateContribs.length / 7;
		var gridOutput = "";
		var urlBase = '/index.php?title=Special%3AContributions&contribs=user&target='+encodeURIComponent(user.replace(/ /g,'_'))+'&start=';
		var firstDay = new Date(dateContribs[0].date).getUTCDay();
		for (var d=0;d<dateContribs.length;d++) {
			var da = dateContribs[d];
			var date = new Date(da.date);
			var dayNum = date.getUTCDay();
			var weekNum = Math.floor((date.getTime() - new Date(dateContribs[0].date).getTime())/(1000*60*60*24*7)) + 1 + ((dayNum < (new Date(dateContribs[0].date).getUTCDay()))?1:0);
			if (dayNum == 0) {
				dayNum = 7;
				weekNum--;
			}
			if (firstDay == 0) weekNum++;
			var bgColor = "#9999997d";
			if (da.contribs > 0) bgColor = "#F3B67D";
			if (da.contribs > 10) bgColor = "#F3B679";
			if (da.contribs > 25) bgColor = "#e29b59";
			if (da.contribs > 50) bgColor = "#F39A48";
			if (da.contribs > 75) bgColor = "#de8135";
			if (da.contribs > 100) bgColor = "#F37F20";
			if (da.contribs > 250) bgColor = "#ff7c06";
			if (da.contribs > 500) bgColor = "#ff8c00";
			gridOutput += '<a title="'+date.toLocaleString(undefined, {year:'numeric',month:'short',day:'numeric'})+': '+da.contribs+' Contributions" style="border:1px dashed '+(date.getMonth()%2?'green':'red')+';background-color:'+bgColor+'; grid-area:'+dayNum+' / '+weekNum+' / '+(dayNum+1)+' / '+(weekNum+1)+';" href="'+urlBase+da.date+'&end='+da.date+'"></a>';
			numWeeks = weekNum;
		}
		$("#gridOutput-global").css({
			"display":"grid",
			"grid-gap":"2px",
			"grid-template":"repeat(7,1fr) / repeat("+Math.ceil(numWeeks)+",1fr)"
		});
		$("#gridOutput-global").html(gridOutput);
	}
	function getData(uccontinue) {
		if ($("#gridOutput-global").length == 0) $(".curseprofile .activity").after('<div class="contribution-grid section"><h3>Recent Contributions</h3><div id="gridOutput-global" style="width:100%; height:120px;">Loading...</div></div>');
		var params = {action:"query",list:"usercontribs",ucuser:user,ucend:startDate,uclimit:"max"};
		if (uccontinue !== "") params.uccontinue = uccontinue;
		a.get(params).done(function (data) {
			contribs = contribs.concat(data.query.usercontribs);
			if (data["continue"] !== undefined) {
				if (data["continue"].uccontinue !== undefined) {
					getData(data["continue"].uccontinue);
					return;
				}
			}
			processData();
		});
	}
	getData("");
});


}
function checkjQ() {
	if (!document.getElementsByClassName('mediawiki').length) return clearInterval(wait_for_it);
	if ($&&$('body.mediawiki').length&&mw&&mw.loader&&mw.loader.using) {
		clearInterval(wait_for_it);
		contributionGrid();
	} else {
		return false;
	}
}
var wait_for_it = setInterval(checkjQ, 20);
