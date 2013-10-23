function Post() {
    this.id;
    this.userid;
    this.userName;
    this.postDate;
    this.removeDate;
    this.lastModifiedDate;
	this.type;
	this.title;
	this.description;
	this.notes;
}
Metis.define(Post, "Posts", "id", "userid", "userName", "postDate", "removeDate", "lastModifiedDate", "type", "title", "description", "notes");
Metis.defineSortColumn(Post, "postDate", "desc");
Metis.createGettersAndSetters(Post);