(function () {
    'use strict';

    var app = {
	
	loadItems: function() {

	    var items = [];
	    items.push(new item("Test1"));

	    return items;
	}
    };
    
    var items = app.loadItems();
    ko.applyBindings(new todoList(items));
})();
