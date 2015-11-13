labs-o-share [![Build Status](https://travis-ci.org/ftlabs/o-share.png?branch=master)](https://travis-ci.org/ftlabs/o-share)
=======

Social media and URL sharing buttons.

- Provides the ability to share a URL provided by the product
- Uses a standard set of social media icons.
- Provides a copyable representation of a link
- Integrates with the gift URL service to provide gifting options

## Browser Support

Tested and working on:

|  Browsers  | Primary Experience | Core Experience |
|:----------:|:------------------:|:---------------:|
|   Chrome   |        35+         |       35+       |
|   Firefox  |        30+         |       30+       |
|   Safari   |        7+          |       7+        |
|   IE       |        8+          |       8+        |

Known issues:

* IE8+ need the [polyfill service](https://github.com/Financial-Times/polyfill/service)

## Getting started

A simple example of the markup is shown in the `standard.mustache` demo file in `/demos/src`.

The options are:

* `url`: The URL to be shared.
* `title`: The title of the content to be shared
* `titleExtra`: Any additional text relating to the title, e.g. site _section_.
* `summary`: Summary text to be shared.
* `relatedTwitterAccounts`: Comma-separated list of Twitter accounts to encourage the user to follow. See [Twitter intents](https://dev.twitter.com/docs/intents) for more info.

The social networks are (in the order suggested by the design team):

* Twitter
* Facebook
* Linkedin
* Whatsapp (note: this link does nothing if Whatsapp is not installed)

The following networks are available, but are considered superfluous for most FT products.
* Google+ (written as 'googleplus' in the `links` config option)
* Reddit
* Pinterest
* URL (for copy/paste)
* Mail (for email)


### Instantiation

#### Javascript
To instantiate the JavaScript:

```javascript
var oShare = require('o-share');
var oShareInstance = new oShare(document.querySelector('[data-o-component=o-share]'));
```

You can also instantiate all instances in your page by running `oShare.init` which returns an array with all of them.

Alternatively, an `o.DOMContentLoaded` event can be dispatched on the `document` to run `#init()`:

```javascript
document.addEventListener("DOMContentLoaded", function() {
    document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
```

Check out the [API docs](http://registry.origami.ft.com/components/labs-o-share#docs-js)

#### Sass

```scss
@import 'labs-o-share/main';
```

We also support silent mode. So if you want to use all the default `labs-o-share` classes, you need to set it to false:

```scss
$labs-o-share-is-silent: false;
```

If not, you can just use our mixins to set you custom class.

Check out the [API docs](http://registry.origami.ft.com/components/labs-o-share#docs-css)

## Core experience

To support core experience, you need to include the [complete markup](https://github.com/ftlabs/o-share/blob/master/main.mustache) directly.

Social media share buttons will function as plain `<a>` elements (and can be set to `target="_blank"` if the product wishes.

## Custom element

It also registers the custom `<o-share>` element which you can use. And you can use it via JavaScript by using the `#element` attribute like this:

```
var labsOShare = require('labs-o-share');
var labsOShareElement = new labsOShare.Element();
// Set all the data attributes
document.body.appendChild(labsOShareElement);
var labsOShareInstance = new labsOShare(labsOShareElement);
```

## Events

This module will trigger the following events on its root element:

* `labsOShare.ready` - when a share links behaviour has been initialised
* `labsOShare.open` - when a share link has been opened (popup/flyout opened as a result of button click)
* `labsOShare.copy` - when the URL has been copied

----

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
