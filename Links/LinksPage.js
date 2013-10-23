function LinksPage() {
    
    new PageHeaderWidget("Useful Links");
    
    this.filters = [new EqFilter("isActive", true)];
    
    if(Metis.hasAccess("full-access")) {
        this.filters.push(new EqFilter("type", "teacher"));
        
        var section = new SoftSectionWidget();
        
        new TextWidget("See active links for:");
        new SpaceWidget();
        var typeSelector = new DropDownWidget(["Teachers", "Parents", "Students"]);
        typeSelector.onChange(this, function() {
            var val = typeSelector.getValue();
            if(val == "Teachers") {
                this.filters[1] = new EqFilter("type", "teacher");
            } else if(val == "Parents") {
                this.filters[1] = new EqFilter("type", "parent");
            } else if(val == "Students") {
                this.filters[1] = new EqFilter("type", "student");
            }
            this.renderTable();
        });
        
        //new LineBreakWidget(0.5);
        //new InstructionWidget("You can preview this screen as a different kind of user because you are a link administrator. Regular users can't do this.");
        
        section.finish();
    } else if(Metis.hasAccess("teacher-view")) {
        this.filters.push(new EqFilter("type", "teacher"));
    } else if(Metis.hasAccess("parent-view")) {
        this.filters.push(new EqFilter("type", "parent"));
    } else if(Metis.hasAccess("student-view")) {
        this.filters.push(new EqFilter("type", "student"));
    }
    
    this.marker = new MarkerWidget();
    this.renderTable();
}

LinksPage.prototype.renderTable = function() {
    this.marker.activate();
    
    var ml = new MetisLoader("Links");
    ml.setFilters(this.filters);
    
    Metis.load(ml, this, function() {
        var links = ml.getList();
        
        if(links.length == 0) {
            new TextWidget("There are currently no links available.");
            return;
        }
        
        for(var i=0; i<links.length; i++) {
            var link = links[i];
            
            new LinkWidget(link.getName(), this, function(link) {
                window.open(link.getUrl(), "_blank");
            }, link);
            new LineBreakWidget(0);
            new TextWidget(link.getDescription());
            new LineBreakWidget(2);
        }
    });
};