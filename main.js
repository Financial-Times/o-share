/*global require, module*/
const labsOShare = require('./src/js/share');

const constructAll = function() {
	labsOShare.init();
	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

document.addEventListener('o.DOMContentLoaded', constructAll);

module.exports = labsOShare;
