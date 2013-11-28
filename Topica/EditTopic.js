function EditTopic(addOrEdit, topicType, topicInfo) {
    ClassUtil.mixin(EditTopic, this, Refreshable);
    ClassUtil.mixin(EditTopic, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
	this.viewOnly = false;
	this.topicType = topicType;
    this.topicInfo = topicInfo;
	
	if (this.topicInfo != null && this.topicInfo.getUserid() != (globalVariables.userObject.getData("id"))) {
		if(!Metis.hasAccess("full-access")) {
			this.viewOnly=true;
		}
	}
    
    if(addOrEdit == "add") {
        this.dialog = new Dialog("Add Topic");
        this.dialog.setOkCancel(this, "clickedSave", "Add");
    } else {
		if (this.viewOnly) {
			this.dialog = new Dialog("View Topic");
		} else {
			this.dialog = new Dialog("Edit Topic");
			this.dialog.setOkCancel(this, "clickedSave", "Update");
		}
    }
    
	if (this.viewOnly) {
	
		new InstructionWidget("You do not have the privileges to edit/delete this record.");
        new LineBreakWidget();
		
		var panel = new QueryPanelWidget(120);
		this.queryFields = new QueryFields(panel, this.topicInfo);
		
		panel.addLabel("Poster");
		this.queryFields.put("userName", new ReadOnlyFieldWidget());
	
		panel.addLabel("Type");
		this.queryFields.put("type", new ReadOnlyFieldWidget(), this.topicType);
		
		panel.addLabel("Posted");
		this.queryFields.put("postDate", new ReadOnlyFieldWidget());
		
		panel.addLabel("Title");
		this.queryFields.put("title", new ReadOnlyFieldWidget());
		
		panel.addLabel("Description");
		this.queryFields.put("description", new ReadOnlyFieldWidget());
		
		panel.addLabel("Comments");
		this.queryFields.put("comments", new ReadOnlyFieldWidget());
		
		panel.addLabel("Last Modified");
		this.queryFields.put("lastModifiedDate", new ReadOnlyFieldWidget());
		
		panel.finish();
	
	} else {
	
		var panel = new QueryPanelWidget(120);
		this.queryFields = new QueryFields(panel, this.topicInfo);
		if(addOrEdit == "add") {
			
			panel.addLabel("Title");
			this.queryFields.put("title", new InputFieldWidget(), ["notEmpty"]);
			
			panel.addLabel("Description");
			this.queryFields.put("description", new TextAreaWidget(), ["notEmpty"]);
			
		} else {
		
			panel.addLabel("Poster");
			this.queryFields.put("userName", new ReadOnlyFieldWidget());
			
			panel.addLabel("Type");
			this.queryFields.put("type", new ReadOnlyFieldWidget());
			
			panel.addLabel("Title");
			this.queryFields.put("title", new InputFieldWidget());
			
			panel.addLabel("Description");
			this.queryFields.put("description", new TextAreaWidget());
			
			panel.addLabel("Comments");
			this.queryFields.put("comments", new TextAreaWidget());
			
			panel.addLabel("Status");
			this.queryFields.put("status", new DropDownWidget(["Active", "Read-Only", "Archive"]));
		}
		
		panel.finish();
		
		if(this.addOrEdit == "edit" && (this.topicInfo.getUserid() == globalVariables.userObject.getData("id"))) {
			new DeleteOption("Delete", "Click below to delete this record.", this, function() {
				Metis.remove(this.topicInfo, this, function() {
					this.closeDialogBox();
					this.refreshAction.call();
				});
			});
		}
	
	}
    
    this.dialog.reposition();
}

EditTopic.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
    if(this.topicInfo == null) {
        this.topicInfo = new Topic();
		this.topicInfo.setUserid(globalVariables.userObject.getData("id"));
		this.topicInfo.setUserName(globalVariables.userObject.getData("firstName"));
		this.topicInfo.setType(this.topicType);
		this.topicInfo.setNotes("");
		this.topicInfo.setPostDate(new Date());
		this.topicInfo.setStatus("Active");
		this.changed = true;
    } else {
		this.topicInfo.setStatus(this.queryFields.getValue("status"));
	}

	this.topicInfo.setTitle(this.queryFields.getValue("title"));
	this.topicInfo.setDescription(this.queryFields.getValue("description"));
	this.topicInfo.setComments(this.queryFields.getValue("comments"));
	
	Metis.save(this.topicInfo, this, function(){
		this.closeDialogBox();
		this.refreshAction.call();
	});
    
    return false;
}