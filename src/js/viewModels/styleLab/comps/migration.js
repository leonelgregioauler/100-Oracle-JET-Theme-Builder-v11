/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojtable'],
function(oj, ko, $, ArrayDataProvider)
{   
  function migration()
  {
    var self = this;
    dataSource = ko.observable();
    $.getJSON("../public_html/data/migration-list.json", function(data) {
      dataSource(new ArrayDataProvider(data, {keyAttributes: 'varKey', implicitSort: [{attribute: 'varKey', direction: 'ascending'}]}));
    });
  }
  return migration();
});	

