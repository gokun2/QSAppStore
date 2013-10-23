function AddLink(addOrEdit, typeName, type, link) {
    ClassUtil.mixin(AddLink, this, Refreshable);
    ClassUtil.mixin(AddLink, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
    this.typeName = typeName;
    this.type = type;
    this.link = link;
    
    if (this.addOrEdit == "add") {
        this.dialog = new Dialog("Add Link for " + typeName);
		this.dialog.setOkCancel(this, "clickedSave", "Add");
	} else {
		this.dialog = new Dialog("Edit Link");
		this.dialog.setOkCancel(this, "clickedSave", "Update");
	}
    
    var panel = new QueryPanelWidget(140);
    this.queryFields = new QueryFields(panel, this.link);

	panel.addLabel("Name");
	this.queryFields.put("name", new InputFieldWidget(), ["notEmpty"]);

	panel.addLabel("Description");
	this.queryFields.put("description", new TextAreaWidget().setGrowable(100, 1));

	panel.addLabel("Link URL", function() {
        new InfoLink("This is the actual URL, starting with http://");
	});
	this.queryFields.put("url", new InputFieldWidget(), ["notEmpty"]);

    panel.finish();
    
    if(this.addOrEdit == "edit") {
        new DeleteOption("Delete", "Click below to delete this link.", this, function() {
            Metis.remove(this.link, this, function() {
                this.closeDialogBox();
    		    this.refreshAction.call();
            });
    	});
    }

	this.dialog.reposition();
}

AddLink.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
    if(this.addOrEdit == "add") {
        this.link = new Link(this.type);
    }
    
    this.link.setName(this.queryFields.getValue("name"));
    this.link.setDescription(this.queryFields.getValue("description"));
    this.link.setUrl(this.queryFields.getValue("url"));
    
    Metis.save(this.link, this, function() {
        this.refreshAction.call();
        this.closeDialogBox;
    });
};