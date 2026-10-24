/// <reference path="../pb_data/types.d.ts" />

// While no SMTP server is configured, emails cannot be sent. Instead of failing silently, print
// the password-reset link in this terminal so reset can still be tried and used in development.
// Once SMTP is set up (PocketBase dashboard, Settings, Mail) this does nothing and emails go out.
//
// The link opens the shop. Set SHOP_URL if it isn't running at http://localhost:5173.
onMailerRecordPasswordResetSend((e) => {
	if ($app.settings().smtp.enabled) return e.next();

	const shop = $os.getenv('SHOP_URL') || 'http://localhost:5173';
	const href = (e.message.html.match(/href="([^"]+)"/) || [])[1] || '';
	const path = href.slice(href.indexOf('/?auth='));
	console.log(
		'\n[dev] Password reset for ' + e.record.get('email') + '\n[dev] Open: ' + shop + path + '\n'
	);
	// Not calling e.next() skips the real send, which would fail without SMTP.
});
