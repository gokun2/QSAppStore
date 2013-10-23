function Link(type) {
    this.id;
    this.type = type; // teacher, parent or student
    this.creationDate = new Date();
    this.activationDate;
    this.isActive = false;
    
    this.name;
    this.description;
    this.url;
}
Metis.define(Link, "Links", "id", "type", "creationDate", "activationDate", "isActive", "name", "description", "url");
Metis.defineSortColumn(Link, "name", "asc");
Metis.createGettersAndSetters(Link);