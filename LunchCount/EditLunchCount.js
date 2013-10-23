function EditLunchCount(addOrEdit, lunchDate, lunchCountInfo) {
    ClassUtil.mixin(EditLunchCount, this, Refreshable);
    ClassUtil.mixin(EditLunchCount, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
	this.viewOnly = false;
	this.lunchDate = lunchDate;
    this.lunchCountInfo = lunchCountInfo;
	
	if (this.lunchCountInfo != null && this.lunchCountInfo.getUserid() != (globalVariables.userObject.getData("id"))) {
		if(!Metis.hasAccess("full-access")) {
			this.viewOnly=true;
		}
	}
    
    if(addOrEdit == "add") {
        this.dialog = new Dialog("Add Lunch Count");
        this.dialog.setOkCancel(this, "clickedSave", "Add");
    } else {
		if (this.viewOnly) {
			this.dialog = new Dialog("View Lunch Count");
		} else {
			this.dialog = new Dialog("Edit Lunch Count");
			this.dialog.setOkCancel(this, "clickedSave", "Update");
		}
    }
    
	if (this.viewOnly) {
	
		new InstructionWidget("You do not have the privileges to edit/delete this record.");
        new LineBreakWidget();
		
		var panel = new QueryPanelWidget(120);
		this.queryFields = new QueryFields(panel, this.lunchCountInfo);
		
		panel.addLabel("Teacher");
		this.queryFields.put("teacherName", new ReadOnlyFieldWidget());
		
		panel.addLabel("Count");
		this.queryFields.put("count", new ReadOnlyFieldWidget());
		
		//panel.addLabel("Date");
		//this.queryFields.put("date", new ReadOnlyFieldWidget());
		
		//panel.addLabel("Status");
		//this.queryFields.put("status", new ReadOnlyFieldWidget());
		
		panel.addLabel("Notes");
		this.queryFields.put("notes", new ReadOnlyFieldWidget());
		
		panel.finish();
	
	} else {
		var panel = new QueryPanelWidget(120);
		this.queryFields = new QueryFields(panel, this.lunchCountInfo);
		
		panel.addLabel("Teacher");
		this.queryFields.put("teacherName", new InputFieldWidget(), globalVariables.userObject.getData("firstName"), ["notEmpty"]);
		
		panel.addLabel("Count");
		this.queryFields.put("count", new InputFieldWidget(), ["notEmpty", "numberOnly"]);
		
		//panel.addLabel("Date");
		//this.queryFields.put("date", new ReadOnlyFieldWidget());
		
		//panel.addLabel("Status");
		//this.queryFields.put("status", new ReadOnlyFieldWidget());
		
		panel.addLabel("Notes");
		this.queryFields.put("notes", new InputFieldWidget());
		
		panel.finish();
		
		if(this.addOrEdit == "edit") {
			new DeleteOption("Delete", "Click below to delete this record.", this, function() {
				Metis.remove(this.lunchCountInfo, this, function() {
					this.closeDialogBox();
					this.refreshAction.call();
				});
			});
		}
	
	}
    
    this.dialog.reposition();
}

EditLunchCount.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
    if(this.lunchCountInfo == null) {
        this.lunchCountInfo = new LunchCount();
		this.lunchCountInfo.setUserid(globalVariables.userObject.getData("id"));
		this.lunchCountInfo.setDate(this.lunchDate);
		this.lunchCountInfo.setStatus("Pending");
    }
    
    this.lunchCountInfo.setTeacherName(this.queryFields.getValue("teacherName"));
    this.lunchCountInfo.setCount(this.queryFields.getValue("count"));
    this.lunchCountInfo.setNotes(this.queryFields.getValue("notes"));
    
    Metis.save(this.lunchCountInfo, this, function(){
        this.closeDialogBox();
        this.refreshAction.call();
    });
    
    return false;
}