/**global require,module*/

const DomDelegate = require('ftdomdelegate');
const Tooltip = require('./Tooltip');

const socialUrls = {
	twitter: "https://twitter.com/intent/tweet?url={{url}}&amp;text={{title}}&amp;related={{relatedTwitterAccounts}}&amp;via=FT",
	facebook: "http://www.facebook.com/sharer.php?u={{url}}&amp;t={{title}}+|+{{titleExtra}}",
	linkedin: "http://www.linkedin.com/shareArticle?mini=true&amp;url={{url}}&amp;title={{title}}+|+{{titleExtra}}&amp;summary={{summary}}&amp;source=Financial+Times",
	googleplus: "https://plus.google.com/share?url={{url}}",
	reddit: "http://reddit.com/submit?url={{url}}&amp;title={{title}}",
	pinterest: "http://www.pinterest.com/pin/create/button/?url={{url}}&amp;description={{title}}",
	url: "{{url}}",
	email: "mailto:?subject=See this article on FT.com&body={{title}}%0A{{url}}"
};

/**
  * @class Share
  *
  * @param {(HTMLElement|string)} [rootEl=document.body] - Element where to search for an o-share component. You can pass an HTMLElement or a selector string
  * @param {Object} config - Optional
  * @param {string} config.url - Optional, url to share
  * @param {string} config.title - Optional, title to be used in social network sharing
  * @param {string} config.titleExtra - Optional, extra bit to add to the title for some social networks
  * @param {string} config.summary - Optional, summary of the page that's being shared
  * @param {string} config.relatedTwitterAccounts - Optional, extra information for sharing on Twitter
  * @param {Object[]} config.links - Optional, array of strings of supported social network names that you want rendered
  */
function Share(rootEl, config) {
	const oShare = this;
	const openWindows = {};
	const shareUrlPromises = {};

	/**
	  * Helper function to dispatch oShare namespaced events
	  *
	  * @private
	  */
	function dispatchCustomEvent(name, data) {
		oShare.rootEl.dispatchEvent(new CustomEvent('oShare.' + name, {
			detail: data || {},
			bubbles: true
		}));
	}

	/**
	  * Click event handler that checks the event target is an o-share action, and acts depending on if it's a social network or a link
	  *
	  * @private
	  */
	function handleClick(ev) {
		const actionEl = ev.target.closest('li.o-share__action');

		if (ev.target.matches('.o-share__btncopy')) {
			var urlEl = rootEl.querySelector('.o-share__urlbox');
			ev.preventDefault();

			new Tooltip("Copy this link for sharing", urlEl);
			urlEl.setSelectionRange(0, urlEl.value.length);

			/*	onCopy: function() {
					dispatchCustomEvent('copy', {
						share: oShare,
						action: "url",
						url: url
					});
				},
			*/
			dispatchCustomEvent('open', {
				share: oShare,
				action: "url",
				url: url
			});
		} else if (rootEl.contains(actionEl) && actionEl.querySelector('a[href]')) {
			ev.preventDefault();
			shareSocial(actionEl.querySelector('a[href]').href);
		} else if (ev.target.matches('.o-share__btnemail')) {
			ev.preventDefault();
			generateSocialUrl('email').then(function(destUrl) {
				location.href = destUrl;
			})
		}
	}

	/**
	  * Event handler for social network actions. Opens up a new window for that social network and dispatched the 'oShare.open' event
	  *
	  * @private
	  * @param {string} url - URL to be loaded in the new window
	  */
	function shareSocial(url) {
		if (url) {
			if (openWindows[url] && !openWindows[url].closed) {
				openWindows[url].focus();
			} else {
				openWindows[url] = window.open(url, '', 'width=646,height=436');
			}

			dispatchCustomEvent('open', {
				share: oShare,
				action: "social",
				url: url
			});
		}
	}

	/**
	  * Fetches the share destination for share actions made from this page (fetch one per )
	  *
	  * @private
	  */
	function getShareUrl() {
		let maxShares = rootEl.querySelector('input.o-share__giftoption:checked').value;
		if (maxShares === 'cfg') {
			maxShares = rootEl.querySelector('input.o-share__customgift').value
		}
		if (shareUrlPromises[maxShares]) return shareUrlPromises[maxShares];
		shareUrlPromises[maxShares] = /*fetch('https://ftlabs-urlsharing-sharecode.herokuapp.com/generate', {
			method:'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				target: location.href,
				shareEventId: (new Date()).getTime(),
				maxShares: maxShares
			})
		})
		.then(function(responseStream) { responseStream.json(); });*/
Promise.resolve('http://on.ft.com/'+maxShares+'-blah');
		return shareUrlPromises[maxShares];
	}

	/**
	  * Transforms the default social urls
	  *
	  * @private
	  * @param {string} socialNetwork - Name of the social network that we support (twitter, facebook, linkedin, googleplus, reddit, pinterest, url)
	  */
	function generateSocialUrl(socialNetwork) {
		return getShareUrl()
		.then(function(shareUrl) {
			let templateString = socialUrls[socialNetwork];
			return templateString.replace('{{url}}', shareUrl)
				.replace('{{title}}', encodeURIComponent(config.title))
				.replace('{{titleExtra}}', encodeURIComponent(config.titleExtra))
				.replace('{{summary}}', encodeURIComponent(config.summary))
				.replace('{{relatedTwitterAccounts}}', encodeURIComponent(config.relatedTwitterAccounts))
			;
		});
	}

	/**
	  * Updates the list of share links with the latest share code
	  *
	  * @private
	  */
	function render() {
		let socialLinkEl;
		Promise.all(config.links.map(function(network) {
			socialLinkEl = rootEl.querySelector('.o-share__action--'+network);
			if (socialLinkEl) {
				return generateSocialUrl(network).then(function(destUrl) {
					socialLinkEl.href = destUrl;
				});
			} else {
				return true;
			}
		}));
		generateSocialUrl('url').then(function(destUrl) {
			rootEl.querySelector('.o-share__urlbox').value = destUrl;
		});
	}

	/**
	  * Initialises the Share class, rendering the o-share element if it's empty with {@link config} options,
	  * or from corresponding data attributes and sets up dom-delegates.
	  * Dispatches 'oShare.ready' at the end
	  */
	function init() {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}

		const rootDelegate = new DomDelegate(rootEl);
		rootDelegate.on('click', handleClick);
		rootEl.setAttribute('data-o-share--js', '');

		oShare.rootDomDelegate = rootDelegate;
		oShare.rootEl = rootEl;

		config = Object.assign({
			links: rootEl.hasAttribute('data-o-share-links') ? rootEl.getAttribute('data-o-share-links').split(' ') : [],
			url: rootEl.getAttribute('data-o-share-url') || '',
			title: rootEl.getAttribute('data-o-share-title') || '',
			titleExtra: rootEl.getAttribute('data-o-share-titleExtra') || '',
			summary: rootEl.getAttribute('data-o-share-summary') || '',
			relatedTwitterAccounts: rootEl.getAttribute('data-o-share-relatedTwitterAccounts') || ''
		}, config || {});

		render();

		dispatchCustomEvent('ready', {
			share: oShare
		});
	}

	init();
}

/**
  * Destroys the Share instance, disables dom-delegates
  */
Share.prototype.destroy = function() {
	this.rootDomDelegate.destroy();
	// Should destroy remove its children? Maybe setting .innerHTML to '' is faster
	for (let i = 0; i < this.rootEl.children; i++) {
		this.rootEl.removeChild(this.rootEl.children[i]);
	}

	this.rootEl.removeAttribute('data-o-share--js');
	this.rootEl = undefined;
};

/**
  * Initialises all o-share components inside the element passed as the first parameter
  *
  * @param {(HTMLElement|string)} [el=document.body] - Element where to search for o-share components. You can pass an HTMLElement or a selector string
  * @returns {Array} - An array of Share instances
  */
Share.init = function(el) {
	const shareInstances = [];

	if (!el) {
		el = document.body;
	} else if (!(el instanceof HTMLElement)) {
		el = document.querySelector(el);
	}

	const shareElements = el.querySelectorAll('[data-o-component=o-share]');

	for (let i = 0; i < shareElements.length; i++) {
		if (!shareElements[i].hasAttribute('data-o-header--js')) {
			shareInstances.push(new Share(shareElements[i]));
		}
	}

	return shareInstances;
};

module.exports = Share;
