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
	<div data-o-component="labs-o-share" class="labs-o-share" data-labs-o-share-url='/content/{{id}}' data-labs-o-share-title="{{title}}" data-labs-o-share-links="twitter facebook linkedin whatsapp googleplus reddit">
		<div class='labs-o-share__social'>
			<h3>Share on social networks:</h3>
			<ul>
				<li class="labs-o-share__action labs-o-share__action--twitter">
					<a href="http://twitter.com/"><i>Twitter</i></a>
				</li>
				<li class="labs-o-share__action labs-o-share__action--facebook">
					<a href="http://facebook.com/"><i>Facebook</i></a>
				</li>
				<li class="labs-o-share__action labs-o-share__action--linkedin">
					<a href="http://linkedin.com/"><i>LinkedIn</i></a>
				</li>
				<li class="labs-o-share__action labs-o-share__action--whatsapp">
					<a data-trackable="whatsapp"><i>Whatsapp</i></a>
				</li>
				<li class="labs-o-share__action labs-o-share__action--googleplus">
					<a href="http://google.co.uk/"><i>Google+</i></a>
				</li>
				<li class="labs-o-share__action labs-o-share__action--reddit">
					<a href="http://reddit.com/"><i>Reddit</i></a>
				</li>
			</ul>
		</div>
		<div class='labs-o-share__link'>
			<h3>Share with friends/colleagues:</h3>
			<div>
				<input type='text' class="labs-o-share__urlbox" value="http://on.ft.com/1mUdgA2" />
				<button class='labs-o-share__btncopy'>Copy</button>
				<button class='labs-o-share__btnemail'>Email</button>
			</div>
		</div>
		<div class='labs-o-share__giftoptions o--if-js'>
			<p>This is <strong>subscriber-only</strong> content. Use <a href='http://labs.ft.com/url-sharing/'>gift credits</a> to guarantee that anyone you share with will be able to read it?</p>
			<form>
				<input type='radio' value='0' checked="true" name='labs-o-share-giftoption' class='labs-o-share__giftoption labs-o-share__giftoption--small' id='labs-o-share-giftoption-0' />
					<label class='labs-o-share__giftlabel' for='labs-o-share-giftoption-0'>No</label>
				<input type='radio' value='1' name='labs-o-share-giftoption' class='labs-o-share__giftoption labs-o-share__giftoption--small' id='labs-o-share-giftoption-1' />
					<label class='labs-o-share__giftlabel' for='labs-o-share-giftoption-1'>Just one</label>
				<input type='radio' value='-1' name='labs-o-share-giftoption' class='labs-o-share__giftoption labs-o-share__giftoption--small' id='labs-o-share-giftoption--1' />
					<label class='labs-o-share__giftlabel' for='labs-o-share-giftoption--1'>Unlimited</label>
				<input type='radio' value='cfg' name='labs-o-share-giftoption' class='labs-o-share__giftoption labs-o-share__giftoption--small' id='labs-o-share-giftoption-cfg' />
					<label class='labs-o-share__giftlabel labs-o-share__giftlabel--cfg' for='labs-o-share-giftoption-cfg'>Custom:</label>
				<input type='number' class='labs-o-share__customgift' maxlength="4" min="0" max="9999" disabled="true" />
			</form>
			<p class='labs-o-share__giftdesc labs-o-share__giftdesc--1'>The first person you share the link with will be able to read the article for free. Anyone else who gets the link may be asked to subscribe to read it. You will spend no more than 1 gift credit.</p>
			<p class='labs-o-share__giftdesc labs-o-share__giftdesc---1'>Each non-subscriber who views your shared link will cost one gift credit. When your gift credits are used up, recipients must subscribe to view the article.</p>
			<p class='labs-o-share__giftdesc labs-o-share__giftdesc--cfg'>Each non-subscriber who views your shared link will cost one gift credit. When your gift credits are used up or the limit you specify above is reached, recipients must subscribe to view the article.</p>

			<p class='labs-o-share__creditmsg'>You have <span data-labs-o-share-credit-count=""></span> remaining this month. <a href='http://labs.ft.com/url-sharing/#getmore'>Get more</a></p>
		</div>
	</div>
`;
	insert(html);
}

export {
	insertShareLinks,
	reset
};
