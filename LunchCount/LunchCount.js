function LunchCount() {
    this.id;
    this.userid;
    this.teacherName;
    this.count;
    this.date;
	this.status;
	this.notes;
}
Metis.define(LunchCount, "LunchCounts", "id", "userid", "teacherName", "count", "date", "status", "notes");
Metis.defineSortColumn(LunchCount, "teacherName", "asc");
Metis.createGettersAndSetters(LunchCount);