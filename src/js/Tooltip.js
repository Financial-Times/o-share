/*global module*/

/**
 * @class Tooltip
 *
 * @param {string} text
 * @param {HTMLElement} refEl
 */
function Tooltip(text, refEl) {
	this.cssClass = 'o-share-tooltip';

	/**
	 * Creates a tooltip element
	 *
	 * @private
	 * @returns {HTMLElement}
	 */
	function createTooltip(cssClass) {
		const tipEl = document.createElement('div');
		tipEl.className = cssClass;
		tipEl.innerHTML = '<div class="' + cssClass + '__arrow"></div><div class="' + cssClass + '__text">' + text + '</div>';
		return tipEl;
	}

	/**
	 * Renders a tooltip element
	 *
	 * @private
	 * @param {HTMLElement} tipEl - a tooltip element returned by {@link createTooltip}
	 */
	function renderTooltip(tipEl) {
		var os = offset(refEl);
		document.body.appendChild(tipEl);
		tipEl.style.width = tipEl.clientWidth + "px"; // Set width based on initial text
		tipEl.style.top = (os.y + refEl.offsetHeight) + 'px';
		tipEl.style.left = (os.x - (tipEl.offsetWidth / 2) + (refEl.offsetWidth / 2)) + "px";
		tipEl.style.opacity = 1;
	}

	// Return the offset of the element from the top left of the document
	function offset(el) {
		var os = {x:0, y:0}, treeEl = el;
		while (treeEl) {
			os.y += treeEl.offsetTop;
			os.x += treeEl.offsetLeft;
			treeEl = treeEl.offsetParent;
		}
		return os;
	}

	this.tooltipEl = createTooltip(this.cssClass);
	renderTooltip(this.tooltipEl);
}

/**
 * Set the text on the tooltip
 *
 * @param {string} text
 */
Tooltip.prototype.setText = function(text) {
	this.tooltipEl.querySelector('.' + this.cssClass + '__text').innerText = text;
};

/**
 * Destroys the tooltip, removing it from the DOM
 */
Tooltip.prototype.destroy = function() {
	this.tooltipEl.parentElement.removeChild(this.tooltipEl);
	this.tooltipEl = undefined;
	return undefined;
};

module.exports = Tooltip;
