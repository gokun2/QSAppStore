function GoogleCalendar() {
    ClassUtil.inherit(GoogleCalendar, this, Widget);
    this._super("GoogleCalendar");
    	
	new PageHeaderWidget("Calendar");
	
	this.load();
    
};

// Write class methods like this
GoogleCalendar.prototype.load = function() {
    
    var metisLoader = new MetisLoader("HTML");
    Metis.load(metisLoader, this, function() {
        this.html = metisLoader.get();
        log("Load Html: ", this.html);
		if (this.html != null) {
			this.widget = this.html.getText();
			this.attach();
		} else {
    	    this.widget = "Calendar has not been set up. Please contact your administrator.";
            this.attach();
		}
    });

};