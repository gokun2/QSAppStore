function PostBoard() {

    this.pageHeader = new PageHeaderWidget("Manage Announcements");
    
	/*
	var section = new SoftSectionWidget();
	this.sectionMarker = new MarkerWidget();
	section.finish();
	*/
	
	this.postType = "Teacher";
	if (Metis.hasAccess("parent-access")) {
		this.postType = "Parent";
	} else if (Metis.hasAccess("student-access")) {
		this.postType = "Student";
	}  
	
    //new SearchWidget();
    new QuickAddButtonWidget("Post New Announcement", this, "clickedAddPost");
    new LineBreakWidget();
    
    var postTable = new DataTableWidget(this, "postTable");
	
	postTable.addHeader("Poster", "userName", true, 20);
	postTable.addColumn(function(post) {
		return post.getUserName();
	});
    
	if(Metis.hasAccess("full-access")) {
    
		postTable.addHeader("Type", "type", true, 20);
		postTable.addColumn(function(post) {
			return post.getType();
		});
	}
    
    postTable.addHeader("Title", "title", true, 30);
    postTable.addColumn(function(post) {
        return post.getTitle();
    });
	
    postTable.addHeader("Description", "description", true, 50);
    postTable.addColumn(function(post) {
        return post.getDescription();
    });
    
	postTable.addHeader("Posted", "postDate", true, 10);
    postTable.addColumn(function(post) {
		return post.getPostDate().toDateString();
    });
    
	postTable.addHeader("Expires", "removeDate", true, 10);
    postTable.addColumn(function(post) {
        return post.getRemoveDate().toDateString();
    });
	
	this.postTable = postTable;
	this.updatePosts();
    
    postTable.setClickHandler(this, function(post) {
		var dialog = new EditPost("edit", this.postType, post);
        dialog.setRefreshHandler(this, function() {
			this.updatePosts();
        });
    });
}

PostBoard.prototype.updatePosts = function(){

	//this.postTable.renderMetisData(Metis, "Posts", new EqFilter("date", this.getCurrentFormattedDate()));
	var metisLoader = new MetisLoader("Posts");
	if(!Metis.hasAccess("full-access")) {
		metisLoader.setFilters([new EqFilter("userid", globalVariables.userObject.getData("id"))]);
	}
    metisLoader.setRetrievalSize(100);
    
	var totalPending = 0;
    Metis.load(metisLoader, this, function() {
        var results = metisLoader.getList();
		this.postTable.renderList(results);
		
        //Update total count
        /*
		totalPending = 0;
		for (var i=0; i<results.length; i++) {
			totalPending += Number(results[i].getCount());
		}
		
        this.sectionMarker.activate();
        new TextWidget("Total Post : " + totalPending);
        */
    });
	
};

PostBoard.prototype.getCurrentFormattedDate = function(){
    return new PlainDate(this.dateSelection.getValue());
};

PostBoard.prototype.clickedAddPost = function() {
    var dialog = new EditPost("add", this.postType);
    dialog.setRefreshHandler(this, function() {
		this.updatePosts();
    });
};