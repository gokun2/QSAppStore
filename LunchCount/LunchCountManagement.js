function LunchCountManagement() {

    this.pageHeader = new PageHeaderWidget("Lunch Count");
    
    this.dateSelection = new DateSelectorWidget(new Date(), this, function() {
    	this.updateLunchCounts();
	});
	//this.dateSelection.setStartAttendanceClickHandler(this, "clickedAddSchoolDay");
    this.dateSelection.finish();
	
	var section = new SoftSectionWidget();
	this.sectionMarker = new MarkerWidget();
	section.finish();
	
    //new SearchWidget();
    new QuickAddButtonWidget("Add Lunch Count", this, "clickedAddLunchCount");
    new LineBreakWidget();
    
    var lunchCountTable = new DataTableWidget(this, "lunchCountTable");
    
    lunchCountTable.addHeader("Teacher", "teacherName", true, 30);
    lunchCountTable.addColumn(function(lunchCount) {
        return lunchCount.getTeacherName();
    });
    
    lunchCountTable.addHeader("Lunch Count", "count", true, 20);
    lunchCountTable.addColumn(function(lunchCount) {
        return Number(lunchCount.getCount()).toFixed(0);
    });
    
    /*
	lunchCountTable.addHeader("Date", "date", true, 20);
    lunchCountTable.addColumn(function(lunchCount) {
        return lunchCount.getDate().toString();
    });
    
    lunchCountTable.addHeader("Status", "status", true, 20);
    lunchCountTable.addColumn(function(lunchCount) {
        return lunchCount.getStatus();
    });
    */
	
    lunchCountTable.addHeader("Notes", "notes", true, 50);
    lunchCountTable.addColumn(function(lunchCount) {
        return lunchCount.getNotes();
    });
	
	this.lunchCountTable = lunchCountTable;
	this.updateLunchCounts();
    
    lunchCountTable.setClickHandler(this, function(lunchCount) {
        var dialog = new EditLunchCount("edit", this.getCurrentFormattedDate(), lunchCount);
        dialog.setRefreshHandler(this, function() {
			this.updateLunchCounts();
        });
    });
}

LunchCountManagement.prototype.updateLunchCounts = function(){

	//this.lunchCountTable.renderMetisData(Metis, "LunchCounts", new EqFilter("date", this.getCurrentFormattedDate()));
	var metisLoader = new MetisLoader("LunchCounts");
    metisLoader.setFilters([new EqFilter("date", this.getCurrentFormattedDate())]);
    metisLoader.setRetrievalSize(100);
    
	var totalPending = 0;
    Metis.load(metisLoader, this, function() {
        var results = metisLoader.getList();
		this.lunchCountTable.renderList(results);
		
        //Update total count
        totalPending = 0;
		for (var i=0; i<results.length; i++) {
			totalPending += Number(results[i].getCount());
		}
        
        this.sectionMarker.activate();
        new TextWidget("Total Lunch Count : " + totalPending);
    });
};

LunchCountManagement.prototype.getCurrentFormattedDate = function(){
    return new PlainDate(this.dateSelection.getValue());
};

LunchCountManagement.prototype.clickedAddLunchCount = function() {
    var dialog = new EditLunchCount("add", this.getCurrentFormattedDate());
    dialog.setRefreshHandler(this, function() {
		this.updateLunchCounts();
    });
};