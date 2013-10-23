function Html() {
    this.id;
    this.text;
}
Metis.define(Html, "HTML", "id", "text");
Metis.createGettersAndSetters(Html);

Html.prototype.hasData = function(dataName) {
    var test = {id: true, text: true};
    if(test[dataName] == true) return true;
    else return false;
};

Html.prototype.getData = function(dataName) {
    return this[dataName];
};

Html.prototype.setData = function(dataName, value) {
    this[dataName] = value;
};