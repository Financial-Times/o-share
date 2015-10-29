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
		let bodyDelegate;

		let tokenTimeout = undefined;

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
		  * Checks if a passed url has sharecode parameter in it
		  *
		  * @private
		  */

		function urlAlreadyHasShareCode(url){

			return url.indexOf("shareCode") > -1 ? true : false;

		}

		function handleCopy() {
			var urlEl = rootEl.querySelector('.o-share__urlbox');

			var tip = new Tooltip("Copy this link for sharing", urlEl);
			urlEl.setSelectionRange(0, urlEl.value.length);

			function handleCloseToolip(ev) {
				if ((ev.keyCode && ev.keyCode === 27) || !rootEl.querySelector('.o-share__link').contains(ev.target)) {
					tip.destroy();
					bodyDelegate.off();
				}
			}

			dispatchCustomEvent('open', {
				share: oShare,
				action: "url",
				url: urlEl.value
			});
			bodyDelegate.on('click', handleCloseToolip);
			bodyDelegate.on('keypress', handleCloseToolip);

			// TODO: Detect copy action and fire this event
			/*	onCopy: function() {
					dispatchCustomEvent('copy', {
						share: oShare,
						action: "url",
						url: url
					});
				},
			*/
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
			var cfgEl = rootEl.querySelector('.o-share__customgift');
			if (ev.target.value === 'cfg' && ev.target.checked) {
				if (!cfgEl.value || isNaN(cfgEl.value)) {
					cfgEl.value = 5;
				}
				cfgEl.disabled = false;
				cfgEl.focus();
			}
			if (ev.target.matches('.o-share__giftoption') && ev.target.value !== 'cfg' && ev.target.checked) {
				cfgEl.disabled = true;
			}
			render();
		}

		/**
		  * Fetches the share destination for share actions made from this page (fetch one per )
		  *
		  * @private
		  */
		function getShareUrl(shareValue) {

			let maxShares = undefined;

			if(shareValue !== undefined){

				maxShares = shareValue;

			} else {
				maxShares = rootEl.querySelector('input.o-share__giftoption:checked').value;

				if (maxShares === 'cfg') {
					maxShares = rootEl.querySelector('input.o-share__customgift').value
				}

			}

			if (shareUrlPromises[maxShares]) return shareUrlPromises[maxShares];

			var serviceURL = "http://sharecode.ft.com/generate";

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

		/**
		  * Transforms the default social urls
		  *
		  * @private
		  * @param {string} socialNetwork - Name of the social network that we support (twitter, facebook, linkedin, googleplus, reddit, pinterest, url)
		  */
		function generateSocialUrl(socialNetwork) {
			return getShareUrl()

			.then(function(shareResponse) {
				console.log(shareResponse);
				let templateString = socialUrls[socialNetwork];
				return templateString.replace('{{url}}', shareResponse.shareURL)
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

			console.log(rootEl);

			const rootDelegate = new DomDelegate(rootEl);
			rootDelegate.on('click', '.o-share__btncopy', handleCopy);
			rootDelegate.on('click', '.o-share__action', handleSocial);
			rootDelegate.on('click', '.o-share__btnemail', handleEmail);
			rootDelegate.on('change', '.o-share__giftoption', handleGiftOptionChange);
			rootDelegate.on('change', '.o-share__customgift', handleGiftOptionChange);

			bodyDelegate = new DomDelegate(document.body);

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

			if(urlAlreadyHasShareCode(window.location.href) === false){

				if(tokenTimeout === undefined){

					tokenTimeout = setTimeout(function(){
						console.log("timeoutCalled");
						getShareUrl(1)
							.then(function(data){

								if(data.shareCode !== undefined){

									var join = (window.location.href.contains("?")) ? "&" : "?";

									window.history.pushState({}, undefined, window.location.href + join + "shareCode=" + data.shareCode);

								}

							})
						;

					}, 5000);

				}

			}

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
