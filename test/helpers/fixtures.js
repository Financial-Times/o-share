let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}

function insertShareLinks() {
	const html = `
		<div data-o-component="o-share" class="o-share" data-o-share-title='Pfizer+says+its+AstraZeneca+vow+over+big+UK+presence+is+binding' data-o-share-url='http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2' data-o-share-titleExtra='FT%2Ecom+%7C+Pharmaceuticals' data-o-share-relatedTwitterAccounts="ftcompanies">
		<div class='o-share__social'>
			<h3>Share on social networks:</h3>
			<ul>
				<li class="o-share__action o-share__action--twitter">
					<a href="https://twitter.com/intent/tweet?url=http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2&amp;text=Pfizer+says+its+AstraZeneca+vow+over+big+UK+presence+is+binding&amp;related=ftcompanies&amp;via=FT"><i>Twitter</i></a>
				</li>
				<li class="o-share__action o-share__action--facebook">
					<a href="http://www.facebook.com/sharer.php?u=http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2&amp;t=Pfizer+says+its+AstraZeneca+vow+over+big+UK+presence+is+binding+|+FT%2Ecom+%7C+Pharmaceuticals"><i>Facebook</i></a>
				</li>
				<li class="o-share__action o-share__action--linkedin">
					<a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2&amp;title=Pfizer+says+its+AstraZeneca+vow+over+big+UK+presence+is+binding+|+FT%2Ecom+%7C+Pharmaceuticals&amp;summary=US+drugs+group+vows+to+maintain+big+British+presence&amp;source=Financial+Times"><i>LinkedIn</i></a>
				</li>
				<li class="o-share__action o-share__action--whatsapp">
					<a target="_blank" href="whatsapp://send?text=Pfizer+says+its+AstraZeneca+vow+over+big+UK+presence+is+binding%20-%20http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2" data-trackable="whatsapp"><i>Whatsapp</i></a>
				</li>
				<li class="o-share__action o-share__action--googleplus">
					<a href="https://plus.google.com/share?url=http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2"><i>Google+</i></a>
				</li>
				<li class="o-share__action o-share__action--reddit">
					<a href="http://reddit.com/submit?url=http:&#x2F;&#x2F;on.ft.com&#x2F;1mUdgA2&amp;title=Pfizer+says+its+AstraZeneca+vow+over+big+UK+presence+is+binding"><i>Reddit</i></a>
				</li>
			</ul>
		</div>
		<div class='o-share__link'>
			<h3>Share with friends/colleagues:</h3>
			<div>
				<input type='text' class="o-share__urlbox" value="http://on.ft.com/1mUdgA2" />
				<button class='o-share__btncopy'>Copy</button>
				<button class='o-share__btnemail'>Email</button>
			</div>
		</div>
		<div class='o-share__giftoptions o--if-js'>
			<p>This is <strong>subscriber-only</strong> content. Use <a href='#'>gift credits</a> to guarantee that anyone you share with will be able to read it?</p>
			<form>
				<input type='radio' value='0' checked name='o-share-giftoption' class='o-share__giftoption o-share__giftoption--small' id='o-share-giftoption-0'><label class='o-share__giftlabel' for='o-share-giftoption-0'>No</label>
				<input type='radio' value='1' name='o-share-giftoption' class='o-share__giftoption o-share__giftoption--small' id='o-share-giftoption-1'><label class='o-share__giftlabel' for='o-share-giftoption-1'>Just one</label>
				<input type='radio' value='-1' name='o-share-giftoption' class='o-share__giftoption o-share__giftoption--small' id='o-share-giftoption--1'><label class='o-share__giftlabel' for='o-share-giftoption--1'>Unlimited</label>
				<input type='radio' value='cfg' name='o-share-giftoption' class='o-share__giftoption o-share__giftoption--small' id='o-share-giftoption-cfg'><label class='o-share__giftlabel o-share__giftlabel--cfg' for='o-share-giftoption-cfg'>Custom:</label><input type='number' class='o-share__customgift' maxlength="4" min="0" max="9999" disabled />
			</form>
			<p class='o-share__giftdesc o-share__giftdesc--1'>The first person you share the link with will be able to read the article for free. Anyone else who gets the link may be asked to subscribe to read it. You will spend no more than 1 gift credit.</p>
			<p class='o-share__giftdesc o-share__giftdesc---1'>Each non-subscriber who views your shared link will cost one gift credit. When your gift credits are used up, recipients must subscribe to view the article.</p>
			<p class='o-share__giftdesc o-share__giftdesc--cfg'>Each non-subscriber who views your shared link will cost one gift credit. When your gift credits are used up or the limit you specify above is reached, recipients must subscribe to view the article.</p>

			<p class='o-share__creditmsg'>You have <span data-o-share-credit-count>TODO gift credits</span> remaining this month. <a href='#'>Get more</a></p>
		</div>
	</div>`;
	insert(html);
}

export {
	insertShareLinks,
	reset
};
