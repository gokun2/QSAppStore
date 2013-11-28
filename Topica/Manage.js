function DiscussionList() {

    this.pageHeader = new PageHeaderWidget("Manage Topics");
    
	/*
	var section = new SoftSectionWidget();
	this.sectionMarker = new MarkerWidget();
	section.finish();
	*/
	
	this.topicType = "Teacher";
	if (Metis.hasAccess("parent-access")) {
		this.topicType = "Parent";
	} else if (Metis.hasAccess("student-access")) {
		this.topicType = "Student";
	}  
	
    //new SearchWidget();
    new QuickAddButtonWidget("Add New Topic", this, "clickedAddTopic");
    new LineBreakWidget();
    
    var topicTable = new DataTableWidget(this, "topicTable");
	
	topicTable.addHeader("Poster", "userName", true, 20);
	topicTable.addColumn(function(topic) {
		return topic.getUserName();
	});
    
	if(Metis.hasAccess("full-access")) {
    
		topicTable.addHeader("Type", "type", true, 20);
		topicTable.addColumn(function(topic) {
			return topic.getType();
		});
	}
    
    topicTable.addHeader("Title", "title", true, 30);
    topicTable.addColumn(function(topic) {
        return topic.getTitle();
    });
	
    topicTable.addHeader("Description", "description", true, 50);
    topicTable.addColumn(function(topic) {
        return topic.getDescription();
    });
    
	topicTable.addHeader("Posted", "topicDate", true, 10);
    topicTable.addColumn(function(topic) {
		return topic.getPostDate().toDateString();
    });
    
	topicTable.addHeader("Status", "status", true, 10);
    topicTable.addColumn(function(topic) {
        return topic.getStatus();
    });
	
	this.topicTable = topicTable;
	this.updateTopics();
    
    topicTable.setClickHandler(this, function(topic) {
		var dialog = new EditTopic("edit", this.topicType, topic);
        dialog.setRefreshHandler(this, function() {
			this.updateTopics();
        });
    });
}

DiscussionList.prototype.updateTopics = function(){

	//this.topicTable.renderMetisData(Metis, "Topics", new EqFilter("date", this.getCurrentFormattedDate()));
	var metisLoader = new MetisLoader("Topics");
	if(!Metis.hasAccess("full-access")) {
		metisLoader.setFilters([new EqFilter("userid", globalVariables.userObject.getData("id"))]);
	}
    metisLoader.setRetrievalSize(100);
    
	var totalPending = 0;
    Metis.load(metisLoader, this, function() {
        var results = metisLoader.getList();
		this.topicTable.renderList(results);
		
        //Update total count
        /*
		totalPending = 0;
		for (var i=0; i<results.length; i++) {
			totalPending += Number(results[i].getCount());
		}
		
        this.sectionMarker.activate();
        new TextWidget("Total Topic : " + totalPending);
        */
    });
	
};

DiscussionList.prototype.getCurrentFormattedDate = function(){
    return new PlainDate(this.dateSelection.getValue());
};

DiscussionList.prototype.clickedAddTopic = function() {
    var dialog = new EditTopic("add", this.topicType);
    dialog.setRefreshHandler(this, function() {
		this.updateTopics();
    });
};