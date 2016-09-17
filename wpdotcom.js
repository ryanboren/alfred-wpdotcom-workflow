#!/usr/bin/env node

var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
var settings = AlfredNode.settings;
workflow.setName("alfred-wpdotcom-workflow");
var Item = AlfredNode.Item;

token = settings.get( "token" )
if ( ! token ) {
	var item1 = new Item({
    	title: 'Set your auth token with wpcomsetkey',
    	arg: '',
    	subtitle: '',
    	valid: false
	});
	workflow.addItem(item1);
	workflow.feedback();
	return;
}

var wpcom = require( 'wpcom' )( token );

(function main() {

	// Search user's sites
	actionHandler.onAction("sites", function(query) {
		var me = wpcom.me();

		me.sites({ fields: 'ID,name,URL' }, function(err, list) {
			if (err) throw err;

			// Iterate over sites
			list.sites.forEach( function(site) {
				// If site doesn't match query, move on.
				var re = new RegExp(query, "i");
				if ( ! re.test( site.name ) ) {
					return;
				}

				// Strip protocol
				url = site.URL.replace(/https?:\/\//, '');

				// Create the item
		        var item1 = new Item({
		            title: site.name,
		            arg: url,
		            subtitle: url,
		            valid: true
		        });
		        workflow.addItem(item1);
			});

			// Send it
			workflow.feedback();
		});
    });

	actionHandler.onAction("setkey", function(password) {
		settings.set("token", password);
		console.log(password);
	});

    AlfredNode.run();
})();

