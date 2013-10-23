function Announcements() {
    
	this.today = new Date();
	this.startDate = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate());
	this.endDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate());
	
    new PageHeaderWidget("Post Board");
    
    this.filters = [new BetweenFilter("postDate", this.startDate, this.today)];
	this.filters.push(new BetweenFilter("removeDate", this.today, this.endDate));
        
	var section = new SoftSectionWidget();
	
	new TextWidget("See active posts for:");
	new SpaceWidget();
	var typeSelector = new DropDownWidget(["All", "Teachers", "Parents", "Students"]);
	typeSelector.onChange(this, function() {
		var val = typeSelector.getValue();
		if(val == "All") {
			this.filters[2] = new BetweenFilter("removeDate", this.today, this.endDate);
		} else if(val == "Teachers") {
			this.filters[2] = new EqFilter("type", "Teacher");
		} else if(val == "Parents") {
			this.filters[2] = new EqFilter("type", "Parent");
		} else if(val == "Students") {
			this.filters[2] = new EqFilter("type", "Student");
		}
		this.renderTable();
	});
	
	section.finish();
    
    this.marker = new MarkerWidget();
    this.renderTable();
}

Announcements.prototype.renderTable = function() {
    this.marker.activate();
    
    var ml = new MetisLoader("Posts");
    ml.setFilters(this.filters);
    
    Metis.load(ml, this, function() {
        var posts = ml.getList();
        
        if(posts.length == 0) {
            new TextWidget("There are currently no announcements available.");
            return;
        }
        
        for(var i=0; i<posts.length; i++) {
            var post = posts[i];
   			new TextWidget(post.getTitle(), {"font-size": "2em"});
            new LineBreakWidget(0);
   			new TextWidget("Posted by: ", {"font-style": "italic"});
   			new TextWidget(post.getUserName(), {"font-style": "italic", "font-weight": "bold"});
   			new TextWidget(" on ", {"font-style": "italic"});
   			new TextWidget(post.getPostDate().toDateString(), {"font-style": "italic", "font-weight": "bold"});
			var postSection = new SoftSectionWidget();
            new TextWidget(post.getDescription());
			postSection.finish();
        }
    });
};