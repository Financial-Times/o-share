export default Share;
/**
 * The `oShare.open` open event fires when a social network share action is
 * triggered, to open a new window.
 *
 * @event "oShare.open"
 * @type {object}
 * @property {boolean} share - The o-share instance.
 * @property {boolean} action - The kind of share i.e. "social".
 * @property {boolean} url - The social share url opened.
 */
/**
 * The `oShare.ready` fires when a o-share instance has been initialised.
 *
 * @event "oShare.ready"
 * @type {object}
 * @property {boolean} share - The initialised o-share instance.
 */
/**
  * @class Share
  *
  * @param {(HTMLElement|string)} rootEl [el=document.body] - Element where to search for an o-share component. You can pass an HTMLElement or a selector string
  * @param {Object} config - Optional
  * @param {string} config.url - Optional, url to share
  * @param {string} config.title - Optional, title to be used in social network sharing
  * @param {string} config.titleExtra - Optional, extra bit to add to the title for some social networks
  * @param {string} config.summary - Optional, summary of the page that's being shared
  * @param {string} config.relatedTwitterAccounts - Optional, extra information for sharing on Twitter
  * @param {Object[]} config.links - Optional, array of strings of supported social network names that you want rendered
  */
declare function Share(rootEl: (HTMLElement | string), config: {
    url: string;
    title: string;
    titleExtra: string;
    summary: string;
    relatedTwitterAccounts: string;
    links: any[];
}): void;
declare class Share {
    /**
     * The `oShare.open` open event fires when a social network share action is
     * triggered, to open a new window.
     *
     * @event "oShare.open"
     * @type {object}
     * @property {boolean} share - The o-share instance.
     * @property {boolean} action - The kind of share i.e. "social".
     * @property {boolean} url - The social share url opened.
     */
    /**
     * The `oShare.ready` fires when a o-share instance has been initialised.
     *
     * @event "oShare.ready"
     * @type {object}
     * @property {boolean} share - The initialised o-share instance.
     */
    /**
      * @class Share
      *
      * @param {(HTMLElement|string)} rootEl [el=document.body] - Element where to search for an o-share component. You can pass an HTMLElement or a selector string
      * @param {Object} config - Optional
      * @param {string} config.url - Optional, url to share
      * @param {string} config.title - Optional, title to be used in social network sharing
      * @param {string} config.titleExtra - Optional, extra bit to add to the title for some social networks
      * @param {string} config.summary - Optional, summary of the page that's being shared
      * @param {string} config.relatedTwitterAccounts - Optional, extra information for sharing on Twitter
      * @param {Object[]} config.links - Optional, array of strings of supported social network names that you want rendered
      */
    constructor(rootEl: (HTMLElement | string), config: {
        url: string;
        title: string;
        titleExtra: string;
        summary: string;
        relatedTwitterAccounts: string;
        links: any[];
    });
    destroy(): undefined;
    rootEl: any;
}
declare namespace Share {
    function init(rootEl?: string | HTMLElement): any[];
}
