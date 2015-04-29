"use strict";

function item(text) {

    this.text = ko.observable("");
    this.placeholder = ko.observable(text);
    this.checked = ko.observable(false);
}

function todoList(items) {

    var self = this;
    
    self.todos = ko.observableArray(items);

    self.addItem = function() {
	self.todos.push(new item("write here..."));
    };
    
    self.deleteItem = function(item) {
	self.todos.remove(item);
    };

    self.onEnter = function(d, e) {
	if (e.keyCode === 13) {
	    self.addItem();
	}
	else {
	    return true;
	}
    };
}
