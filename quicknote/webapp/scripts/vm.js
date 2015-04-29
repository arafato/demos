"use strict";

function item(text, placeholder) {

    this.text = ko.observable(text);
    this.placeholder = ko.observable(placeholder);
}

function vm(items) {

    var self = this;
    
    self.todos = ko.observableArray(items);
    self.authenticated = ko.observable(false);
    self.name = ko.observable("");

    self.addItem = function() {
	self.todos.push(new item("", "write here..."));
    };
    
    self.deleteItem = function(item) {
	self.todos.remove(item);
    };

    self.onEnter = function(d, e) {
	if (e.keyCode === 13) {
	    self.addItem();
	}

	return true;
    };

    self.login = function() {

	FB.login(function(response){
	    if (response.status === 'connected') {

		var creds = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: Config.identityPoolId
		});

		creds.params.Logins = {};
		creds.params.Logins['graph.facebook.com'] = response.authResponse.accessToken;;
		creds.expired = true;
		AWS.config.update({
		    region: Config.region,
		    credentials: creds
		});

		FB.api('/me', function(response) {
		    self.name(response.name);
		});
			
		self.authenticated(true);
	    } else if (response.status === 'not_authorized') {
		console.log("*** not authorized");
		self.authenticated(false);
	    } else {
		self.authenticated(false);
		console.log("*** else");
	    }
	}, { scope: "public_profile"  });
    };
}
