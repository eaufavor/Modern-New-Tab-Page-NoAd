
var allLoaded = false;
window.addEventListener('load', init, false);

function byId(id) { return document.getElementById(id) }

function init() {
	allLoaded = true;
	byId("dontsupport").checked = (localStorage.support == "false");
	byId("dontsupport").onchange = save;
}

function save() {
	if (!allLoaded) return;
	localStorage.support = !(document.getElementById("dontsupport").checked);
}
