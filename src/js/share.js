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

	const shareUrlPromises = {};

	let tokenTimeout = undefined;

	/**
	  * Checks if a passed url has sharecode parameter in it
	  *
	  * @private
	  */

	function urlAlreadyHasShareCode(url){

		return url.indexOf("share_code") > -1 ? true : false;

	}

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
		const urlEl = rootEl.querySelector('.o-share__urlbox');
		let bodyDelegate;

		var selectedAmount = undefined;

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

		function tooltip(text) {
			oShare.tip = oShare.tip || new Tooltip(text, urlEl);
			oShare.tip.setText(text);
		}

		function handleCloseToolip(ev) {
			if (!rootEl.querySelector('.o-share__link').contains(ev.target)) {
				oShare.tip = oShare.tip.destroy();
				document.body.removeEventListener('click', handleCloseToolip);
				document.body.removeEventListener('keypress', handleCloseToolip);
			}
		}

		function handleCopied(ev) {
			ev.stopImmediatePropagation();
			tooltip("Link copied to clipboard");

			document.body.addEventListener('click', handleCloseToolip);
			document.body.addEventListener('keypress', handleCloseToolip);

			return dispatchCustomEvent('copy', {
				share: oShare,
				action: "url",
				url: event.target.value
			});
		}

		function handleCopy() {

			urlEl.select();
			
			if (!document.execCommand('copy')) {
				tooltip("Copy link to clipboard");
			}
		}

		function handleSocial(ev) {
			const actionEl = ev.target.closest('.o-share__action');
			const urlEl = actionEl.querySelector('a[href]');
			if (urlEl) {
				ev.preventDefault();

				if (openWindows[urlEl.href] && !openWindows[urlEl.href].closed) {
					openWindows[urlEl.href].focus();
				} else {
					openWindows[urlEl.href] = window.open(urlEl.href, '', 'width=646,height=436');
				}

				dispatchCustomEvent('open', {
					share: oShare,
					action: "social",
					url: urlEl.href
				});
				ev.target.blur();
			}
		}

		function handleEmail() {
			generateSocialUrl('email').then(function(destUrl) {
				window.open(destUrl, 'mailto');
			})
		}

		function handleGiftOptionChange(ev) {
			const cfgEl = rootEl.querySelector('.o-share__customgift');
			const customAmountRadio = rootEl.querySelector('#o-share-giftoption-cfg');

			if (ev.target == customAmountRadio) {
				cfgEl.disabled = false;
				cfgEl.focus();

				if (!cfgEl.value || isNaN(cfgEl.value)) {
					cfgEl.value = 5;
				}

				getShareUrl(cfgEl.value)
				.then(data => {
					const shortUrl = data.data.shortUrl;
					urlEl.value = shortUrl;
				});
			} else if (ev.target === cfgEl) {
				if (!cfgEl.value || isNaN(cfgEl.value)) {
					cfgEl.value = 5;
				}

				getShareUrl(cfgEl.value)
				.then(data => {
					const shortUrl = data.data.shortUrl;
					urlEl.value = shortUrl;

				});
			} else if (ev.target.matches('.o-share__giftoption') && ev.target.checked) {
				cfgEl.disabled = true;
				getShareUrl(ev.target.value)
				.then(data => {
					const shortUrl = data.data.shortUrl;
					urlEl.value = shortUrl;
				});
			}
			render();
		}

		/**
		  * Fetches the share destination for share actions made from this page (fetch one per )
		  *
		  * @private
		  */
		
		/**
		  * Transforms the default social urls
		  *
		  * @private
		  * @param {string} socialNetwork - Name of the social network that we support (twitter, facebook, linkedin, googleplus, reddit, pinterest, url)
		  */
		function generateSocialUrl(socialNetwork) {
			return getShareUrl()
				.then(function(data) {
					if (data.success) {
						let templateString = socialUrls[socialNetwork];
						return templateString.replace('{{url}}', data.data.shortUrl)
							.replace('{{title}}', encodeURIComponent(config.title))
							.replace('{{titleExtra}}', encodeURIComponent(config.titleExtra))
							.replace('{{summary}}', encodeURIComponent(config.summary))
							.replace('{{relatedTwitterAccounts}}', encodeURIComponent(config.relatedTwitterAccounts));
					}
				});
		}

		function handleEscape(evt) {
			if (evt.keyCode == 27) {
				if (oShare.tip) {
					oShare.tip.destroy();
				}
			}
		}

		/**
		  * Updates the list of share links with the latest share code
		  *
		  * @private
		  */
		function render() {
			const giftoption = rootEl.querySelector('input.o-share__giftoption:checked').value;
			const descEl = rootEl.querySelector('.o-share__giftdesc--'+giftoption);
			
			Promise.all(Object.keys(socialUrls).map(function(network) {
				var socialLinkEl = rootEl.querySelector('.o-share__action--'+network);
				if (socialLinkEl) {
					return generateSocialUrl(network).then(function(destUrl) {
						socialLinkEl.querySelector('a').href = destUrl;
					});
				} else {
					return Promise.resolve(1);
				}
			}));

			generateSocialUrl('url').then(function(destUrl) {
				rootEl.querySelector('.o-share__urlbox').value = destUrl;
			});

			[].slice.call(rootEl.querySelectorAll('.o-share__giftdesc')).forEach(function(el) {
				el.style.display = 'none';
			});

			if (descEl) {
				descEl.style.display = 'block';
				rootEl.querySelector('.o-share__creditmsg').style.display = 'block';
			} else {
				rootEl.querySelector('.o-share__creditmsg').style.display = 'none';
			}
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
			rootDelegate.on('copy', '.o-share__urlbox', handleCopied);
			rootDelegate.on('click', '.o-share__btncopy', handleCopy);
			rootDelegate.on('click', '.o-share__action', handleSocial);
			rootDelegate.on('click', '.o-share__btnemail', handleEmail);
			rootDelegate.on('change', '.o-share__giftoption', handleGiftOptionChange);
			rootDelegate.on('change', '.o-share__customgift', handleGiftOptionChange);

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
		this.tip = this.tip? this.tip.destroy() : undefined;
		// Should destroy remove its children? Maybe setting .innerHTML to '' is faster
		for (let i = 0; i < this.rootEl.children; i++) {
			this.rootEl.removeChild(this.rootEl.children[i]);
		}

		this.rootEl.removeAttribute('data-o-share--js');
		this.rootEl = undefined;
		return undefined;
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


	function getShareUrl(shareValue) {

		let maxShares = 1;

		if (shareValue !== undefined) {

			maxShares = shareValue;

		}

		if (shareUrlPromises[maxShares]) {
			return shareUrlPromises[maxShares];
		}

		const serviceURL = "https://sharecode.ft.com/generate";

		shareUrlPromises[maxShares] = fetch(serviceURL +
					"?target=" + encodeURIComponent(location.href.split("?")[0]) +
					"&shareEventId=" + (Date.now() / 1000 | 0) +
					"&maxShares=" + maxShares
				,{credentials: 'include'})
			.then(function(response) {
				return response.text();
			}).then(function(data){
				return JSON.parse(data);
			})
		;

		return shareUrlPromises[maxShares];
	}


	Share.addShareCodeToUrl = function () {
		if (urlAlreadyHasShareCode(window.location.href) === false) {
			if (tokenTimeout === undefined) {
				tokenTimeout = setTimeout(function () {
					getShareUrl(1)
					.then(function (data) {
						if (data.success) {
							const code = data.data.shareCode;

							const join = (window.location.href.contains("?")) ? "&" : "?";

							window.history.pushState({}, undefined, window.location.href + join + "share_code=" + code);
						}
					});
				}, 5000);

			}

		}
	}

module.exports = Share;
