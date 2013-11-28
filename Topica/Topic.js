function Topic() {
    this.id;
    this.userid;
    this.userName;
    this.postDate;
    this.status;
    this.lastModifiedDate;
	this.type;
	this.title;
	this.description;
	this.comments;
	this.notes;
}
Metis.define(Topic, "Topics", "id", "userid", "userName", "postDate", "status", "lastModifiedDate", "type", "title", "description", "comments", "notes");
Metis.defineSortColumn(Topic, "lastModifiedDate", "desc");
Metis.createGettersAndSetters(Topic);