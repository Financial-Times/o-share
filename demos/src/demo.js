/*global require*/
var oShare = require('../../main.js');

var shares;

document.body.addEventListener("oOverlay.destroy", function() {
	shares.forEach(function(share) {
		share.destroy();
	});
});

document.body.addEventListener("oOverlay.ready", function() {
	shares = oShare.init();
});
