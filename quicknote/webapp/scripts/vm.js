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

    self.syncClient = null;

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

    self.sync = function() {
	
	self.syncClient.openOrCreateDataset("QuickNote", function(err, dataset) {
	    
	    dataset.put("MyKey", ko.toJSON(self.todos), function(err, record) {
		if ( !err ) {
		    dataset.synchronize({
			onSuccess: function(dataset, newRecords) {
			    console.log("data saved to the cloud and newRecords received");
			},
			onFailure: function(err) {
			    console.log("Error while synchronizing data to the cloud: " + err);
			},
			onConflict: function(dataset, conflicts, callback) {
			    // if there are conflicts during the synchronization
			    // we can resolve them in this method
			    var resolved = [];
			    
			    for (var i=0; i < conflicts.length; i++) {
				
				// Take remote version.
				// resolved.push(conflicts[i].resolveWithRemoteRecord());
				
				// Or... take local version.
				resolved.push(conflicts[i].resolveWithLocalRecord());
				
				// Or... use custom logic.
				// var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue();
				
//				resolved.push(conflicts[i].resolveWithValue(newValue));
			    }
			    
			    dataset.resolve(resolved, function(err) {
				if ( !err ) 
				    callback(true);
			    });
			},
		    
			onDatasetDeleted: function(dataset, datasetName, callback) {
			    // Return true to delete the local copy of the dataset.
			    return callback(true);
			},
			
			onDatasetMerged: function(dataset, datasetNames, callback) {
			    // Return false to handle dataset merges outside the synchroniziation callback.
			    return callback(false);
			}
		    });
		}
	    });
	});
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
		
		AWS.config.credentials.get(function() {
		    self.syncClient = new AWS.CognitoSyncManager();
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
