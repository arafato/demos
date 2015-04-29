(function () {
    'use strict';

    var app = {
	
	loadItems: function() {

	    var items = [];
	    items.push(new item("", "write here"));

	    return items;
	}
    };
    
    var items = app.loadItems();
    ko.applyBindings(new vm(items));
})();
