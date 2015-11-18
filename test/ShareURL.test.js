/*global describe,beforeEach,afterEach,it*/

import expect from 'expect.js';

import * as fixtures from './helpers/fixtures';
import Share from './../main';
let testShare;
let shareEl;

describe('share url behaviour', function() {

	beforeEach(function() {
		fixtures.insertShareLinks();
		shareEl = document.querySelector('[data-o-component=labs-o-share]');
		testShare = new Share(shareEl);
	});

	afterEach(function() {
		testShare.destroy();
		fixtures.reset();
	});

	it('share URL tool - copies to clipboard', function() {
		var spy = createSpy();
		document.execCommand = spy;

		const ev = document.createEvent('Event');
		ev.initEvent('click', true, true);
		testShare.rootEl.querySelector('.labs-o-share__btncopy').dispatchEvent(ev);

		expect(spy.callCount).to.be(1);
		expect(spy.calledWith[0][0]).to.be('copy');
	});

	it('share URL tool - copied notification', function() {
		const ev = document.createEvent('Event');
		ev.initEvent('copy', true, true);
		testShare.rootEl.querySelector('.labs-o-share__urlbox').dispatchEvent(ev);
		expect(document.querySelector('.labs-o-share-tooltip__text').innerText).to.be('Link copied to clipboard');
	});

});

function createSpy() {
	function spy () {
		spy.callCount++;
		spy.calledWith.push(Array.prototype.slice.call(arguments));
	}

	spy.callCount = 0;
	spy.calledWith = [];

	return spy;
}
