function EditGoogleCalendar() {
    new PageHeaderWidget("Configure Calendar");
    
    new TextWidget("Please enter HTML or iFrame code here:");
	
	this.load();
	
	new LineBreakWidget();
	new EmphasizedButtonWidget("Save", this, "clickedSave");
	new LineBreakWidget();
}

EditGoogleCalendar.prototype.clickedSave = function() {

	if (this.html == null) this.html = new Html();
    this.html.setText(this.textBox.getValue());
    
    var metisLoader = new MetisLoader("HTML");
    Metis.save(this.html, this, function() {
        log("Save Html: ", this.html);
    });
};

// Write class methods like this
EditGoogleCalendar.prototype.load = function() {
    
	this.textBox = new TextAreaWidget();
    var metisLoader = new MetisLoader("HTML");
    Metis.load(metisLoader, this, function() {
        this.html = metisLoader.get();
        log("Load Html: ", this.html);
		if (this.html != null) this.textBox.setValue(this.html.getText());
    });

};