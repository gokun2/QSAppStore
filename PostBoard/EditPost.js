function EditPost(addOrEdit, postType, postInfo) {
    ClassUtil.mixin(EditPost, this, Refreshable);
    ClassUtil.mixin(EditPost, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
	this.viewOnly = false;
	this.postType = postType;
    this.postInfo = postInfo;
	
	if (this.postInfo != null && this.postInfo.getUserid() != (globalVariables.userObject.getData("id"))) {
		if(!Metis.hasAccess("full-access")) {
			this.viewOnly=true;
		}
	}
    
    if(addOrEdit == "add") {
        this.dialog = new Dialog("Add Post");
        this.dialog.setOkCancel(this, "clickedSave", "Add");
    } else {
		if (this.viewOnly) {
			this.dialog = new Dialog("View Post");
		} else {
			this.dialog = new Dialog("Edit Post");
			this.dialog.setOkCancel(this, "clickedSave", "Update");
		}
    }
    
	if (this.viewOnly) {
	
		new InstructionWidget("You do not have the privileges to edit/delete this record.");
        new LineBreakWidget();
		
		var panel = new QueryPanelWidget(120);
		this.queryFields = new QueryFields(panel, this.postInfo);
		
		panel.addLabel("Poster");
		this.queryFields.put("userName", new ReadOnlyFieldWidget());
	
		panel.addLabel("Type");
		this.queryFields.put("type", new ReadOnlyFieldWidget(), this.postType);
		
		panel.addLabel("Posted");
		this.queryFields.put("postDate", new ReadOnlyFieldWidget());
		
		panel.addLabel("Expires");
		this.queryFields.put("removeDate", new ReadOnlyFieldWidget());
		
		panel.addLabel("Title");
		this.queryFields.put("title", new ReadOnlyFieldWidget());
		
		panel.addLabel("Description");
		this.queryFields.put("description", new ReadOnlyFieldWidget());
		
		panel.addLabel("Last Modified");
		this.queryFields.put("lastModifiedDate", new ReadOnlyFieldWidget());
		
		panel.finish();
	
	} else {
	
		var panel = new QueryPanelWidget(120);
		this.queryFields = new QueryFields(panel, this.postInfo);
		if(addOrEdit == "add") {
			
			panel.addLabel("Title");
			this.queryFields.put("title", new InputFieldWidget(), ["notEmpty"]);
			
			panel.addLabel("Description");
			this.queryFields.put("description", new TextAreaWidget(), ["notEmpty"]);
		
			panel.addLabel("Post Date");
			this.queryFields.put("postDate", new DateWidget(), ["notEmpty","validDate"]);
		
			panel.addLabel("Expiry Date");
			this.queryFields.put("removeDate", new DateWidget(), ["notEmpty","validDate"]);
			
		} else {
		
			panel.addLabel("Poster");
			this.queryFields.put("userName", new ReadOnlyFieldWidget());
			
			panel.addLabel("Type");
			this.queryFields.put("type", new ReadOnlyFieldWidget());
			
			panel.addLabel("Title");
			this.queryFields.put("title", new InputFieldWidget());
			
			panel.addLabel("Description");
			this.queryFields.put("description", new TextAreaWidget());
		
			panel.addLabel("Post Date");
			this.queryFields.put("postDate", new DateWidget(), ["notEmpty","validDate"]);
		
			panel.addLabel("Expiry Date");
			this.queryFields.put("removeDate", new DateWidget(), ["notEmpty","validDate"]);
		}
		
		panel.finish();
		
		if(this.addOrEdit == "edit" && (this.postInfo.getUserid() == globalVariables.userObject.getData("id"))) {
			new DeleteOption("Delete", "Click below to delete this record.", this, function() {
				Metis.remove(this.postInfo, this, function() {
					this.closeDialogBox();
					this.refreshAction.call();
				});
			});
		}
	
	}
    
    this.dialog.reposition();
}

EditPost.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
    if(this.postInfo == null) {
        this.postInfo = new Post();
		this.postInfo.setUserid(globalVariables.userObject.getData("id"));
		this.postInfo.setUserName(globalVariables.userObject.getData("firstName"));
		this.postInfo.setType(this.postType);
		this.postInfo.setNotes("");
		this.changed = true;
    } 

	this.postInfo.setPostDate(this.queryFields.getValue("postDate"));
	this.postInfo.setRemoveDate(this.queryFields.getValue("removeDate"));
	this.postInfo.setTitle(this.queryFields.getValue("title"));
	this.postInfo.setDescription(this.queryFields.getValue("description"));
	
	Metis.save(this.postInfo, this, function(){
		this.closeDialogBox();
		this.refreshAction.call();
	});
    
    return false;
}