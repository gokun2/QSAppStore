function TopicList() {
    
	this.today = new Date();
	this.startDate = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate());
	this.endDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());
	
    new PageHeaderWidget("Topics for Discussion");
    
    this.filters = [new OrFilter("statusGroup", [
		new EqFilter("status", "Active"),
		new EqFilter("status", "Read-Only")
	])];
        
	var section = new SoftSectionWidget();
	
	new TextWidget("See active topics posted by:");
	new SpaceWidget();
	var typeSelector = new DropDownWidget(["All", "Teachers", "Parents", "Students"]);
	typeSelector.onChange(this, function() {
		var val = typeSelector.getValue();
		if(val == "All") {
			this.filters[1] = new OrFilter("statusGroup", [
				new EqFilter("status", "Active"),
				new EqFilter("status", "Read-Only")
			]);
		} else if(val == "Teachers") {
			this.filters[1] = new EqFilter("type", "Teacher");
		} else if(val == "Parents") {
			this.filters[1] = new EqFilter("type", "Parent");
		} else if(val == "Students") {
			this.filters[1] = new EqFilter("type", "Student");
		}
		this.renderTable();
	});
	
	section.finish();
    
    this.marker = new MarkerWidget();
    this.renderTable();
}

TopicList.prototype.renderTable = function() {
    this.marker.activate();
    
    var ml = new MetisLoader("Topics");
    ml.setFilters(this.filters);
    
    Metis.load(ml, this, function() {
        var topics = ml.getList();
        
        if(topics.length == 0) {
            new TextWidget("There are currently no discussions available.");
            return;
        }
		
		//new TextWidget("Click on a topic to participate in the discussions");
		//new SeparatorWidget();
        
        for(var i=0; i<topics.length; i++) {
            var post = topics[i];
   			new TextWidget(post.getTitle(), {"font-size": "2em"});
            new LineBreakWidget(0);
   			new TextWidget("Posted by: ", {"font-style": "italic"});
   			new TextWidget(post.getUserName(), {"font-style": "italic", "font-weight": "bold"});
   			new TextWidget(" on ", {"font-style": "italic"});
   			new TextWidget(post.getPostDate().toDateString(), {"font-style": "italic", "font-weight": "bold"});
			var postSection = new SoftSectionWidget();
            new TextWidget(post.getDescription());
			new SeparatorWidget();
			new TextWidget("Comments:", {"text-decoration": "underline", "font-weight": "bold"});
			if (post.getLastModifiedDate() != null) {
				new TextWidget(" (Last Updated: ", {"font-style": "italic"});
				new TextWidget(post.getLastModifiedDate().toDateString() + ")", {"font-style": "italic"});
			}
			new LineBreakWidget(1);
            new TextWidget(post.getComments());
			if (post.getStatus() == "Active") {
				new LineBreakWidget(1);
				new LinkInListWidget("Add Comment", this, "addComment", post);
			} else {
				new LineBreakWidget(1);
				new TextWidget("This discussion is no longer active", {"font-style": "italic"});
			}
			postSection.finish();
        }
    });
};

TopicList.prototype.addComment = function(post) {
	var dialog = new AddComment(post);
	dialog.setRefreshHandler(this, function() {
		this.renderTable();
	});
}