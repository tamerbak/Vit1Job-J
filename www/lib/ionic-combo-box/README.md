ionic-combobox v0.0.4
=====================

This directive add modal-combobox for select from the list or add new element.

installation
------------

    $ bower install ionic-combobox
    
in index.html add:

    <link href="lib/ionic-combo-box/combo-box.css" rel="stylesheet">
    <script src="lib/ionic-combo-box/combo-box.js"></script>

in app.js:

    angular.module('getFace', ['ionic', 'comboBoxDirective'])    
    
Usage
-----

    <div ng-model="selectedItem"
        combo-box="prepopulatedItemsArray"
        cbx-placeholder="Item"
        cbx-filter-caption="used items:"
        cbxEmptyFilterCaption="No items found"
        cbx-close-on-select
        cbxHeaderClass="bar-royal"
        cbxOkCaption="Select"
        ></div>
      
    