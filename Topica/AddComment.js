function AddComment(topicInfo) {
    ClassUtil.mixin(AddComment, this, Refreshable);
    ClassUtil.mixin(AddComment, this, Dialogable);
    
    this.topicInfo = topicInfo;
    
	if (this.topicInfo != null && this.topicInfo.getUserid() != (globalVariables.userObject.getData("id"))) {
		if(!Metis.hasAccess("full-access")) {
			this.viewOnly=true;
		}
	}
    
	this.dialog = new Dialog("Add Comment");
	this.dialog.setOkCancel(this, "clickedSave", "Save Comment");
	
	var panel = new QueryPanelWidget(120);
	this.queryFields = new QueryFields(panel, this.topicInfo);
		
	panel.addLabel("Title");
	this.queryFields.put("title", new ReadOnlyFieldWidget());
	
	panel.addLabel("Description");
	this.queryFields.put("description", new ReadOnlyTextAreaWidget());
	
	panel.addLabel("Comments");
	this.queryFields.put("comments", new ReadOnlyTextAreaWidget());
	
	panel.addLabel("Add Comment");
	this.queryFields.put("notes", new TextAreaWidget(), ["notEmpty"]);
		
	panel.finish();
    
    this.dialog.reposition();
}

AddComment.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
	this.topicInfo.setComments(this.topicInfo.getComments() + "\n\n" + globalVariables.userObject.getData("firstName") 
		+ " (" + (new Date()).toDateString() + "): " + this.queryFields.getValue("notes").trim());
	
	this.topicInfo.setLastModifiedDate(new Date());
	
	Metis.save(this.topicInfo, this, function(){
		this.closeDialogBox();
		this.refreshAction.call();
	});
    
    return false;
}