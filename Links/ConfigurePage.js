function ConfigurePage() {
    new PageHeaderWidget("Configure Links");
    
    new TextWidget("Use this page to create links that will be viewable to the various users. Links can also be activated and de-activated as desired.")
    
    new LineBreakWidget(1);
    
    this.renderSection("Teachers", "teacher");
    this.renderSection("Parents", "parent");
    this.renderSection("Students", "student");
}

ConfigurePage.prototype.renderSection = function(typeName, type) {
    var tableRef = {};
    new RecordHeaderWidget("Links for " + typeName);
    new QuickAddButtonWidget("Create new link", this, "clickedAdd", typeName, type, tableRef);
    
    new LineBreakWidget();
    
    var table = new DataTableWidget(this, type + "Table");
    tableRef.table = table;
    
    table.addHeader("Name", "name"); // "true" here means the column is searchable if you use a search widget.
    table.addColumn(function(link) {
        new TextWidget($H("<em>" + link.getName() + "</em>\n"));
        return link.getDescription();
    });
    table.addHeader("Is Active?", "isActive"); // Second "true" here means this column is sortable. BUT this must match your sort column.
    table.addColumn(function(link) {
        if(link.getIsActive() == false) {
            return "-";
        } else {
            new TextWidget("Yes\n");
            new TextWidget($H("<small>Activated on " + DateUtil.getShortFormattedDate(link.getActivationDate()) + "</small>"));
        }
    });
    table.addHeader("", "action");
    table.addColumn(function(link) {
        if(link.getIsActive() == false) {
            new ButtonWidget("Activate", this, "activate", link, table);
        } else {
            new ButtonWidget("Deactivate", this, "deactivate", link, table);
        }
    });
    table.setClickHandler(this, "clickedEdit", typeName, type, table);
    table.renderMetisData(Metis, "Links", [new EqFilter("type", type)]); 
    
    new LineBreakWidget(2);
};

ConfigurePage.prototype.clickedAdd = function(typeName, type, tableRef) {
    var table = tableRef.table;
    
    var dialog = new AddLink("add", typeName, type);
    dialog.setRefreshHandler(table, "refreshTable");
};

ConfigurePage.prototype.clickedEdit = function(link, index, typeName, type, table) {
    var dialog = new AddLink("edit", typeName, type, link);
    dialog.setRefreshHandler(table, "refreshTable");
};

ConfigurePage.prototype.activate = function(link, table) {
    link.setIsActive(true);
    link.setActivationDate(new Date());
    Metis.save(link, this, function() {
        table.refreshTable();
    });
};

ConfigurePage.prototype.deactivate = function(link, table) {
    link.setIsActive(false);
    link.setActivationDate(new Date());
    Metis.save(link, this, function() {
        table.refreshTable();
    });
};