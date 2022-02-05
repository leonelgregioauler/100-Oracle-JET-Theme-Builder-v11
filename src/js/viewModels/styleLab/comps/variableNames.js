/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 
  'ojs/ojbootstrap', 'ojs/ojarraydataprovider', "ojs/ojlistdataproviderview", 'ojs/ojknockout', 'ojs/ojtable', , 'ojs/ojinputtext'],
function (oj, ko, $, Bootstrap, ArrayDataProvider, ListDataProviderView) 
{
  // this callback gets executed when all required modules are loaded
  return (async() => {
    try {
      var self = this;
      self.filter = ko.observable();
      self.handleValueChanged = () => {
         self.filter(document.getElementById("filter").rawValue);
      };
      // Get all computed styles
      var styles = getComputedStyle(document.documentElement);
      // Retrive all settings variable data from generated json file from data folder
      let response = await fetch(`./data/cssvars-list.json`);
      // Wait until the response is back
      let varsList = await response.json();
      // Array initiated to hold table dataset
      let cssVars = [];
      // Iterate the json object and place in array object
      for (var i = 0; i < varsList.length; i++) {
        let custPropValue = styles.getPropertyValue(varsList[i].varKey);
        cssVars.push({name:varsList[i].varKey,cvalue:custPropValue,ColorId:i,
          bgColor:(varsList[i].varValue.indexOf('rgb') !== -1 || varsList[i].varValue.indexOf('#') !== -1) ? `${varsList[i].varValue}` : `rgb(${varsList[i].varValue})`});
      }
      // Load all data at once in data table
      self.scrollPolicyValue = ko.observable('loadAll');
      // Computed function to filter the data in table
      self.variableCategory = ko.computed(function () {
         const filterRegEx = new RegExp(self.filter(), "i");
         const filterCriterions = {
             op: "$or",
             criteria: [
                 { op: "$regex", value: { name: filterRegEx } }
             ],
         };
         const arrayDataProvider = new ArrayDataProvider(cssVars, { keyAttributes: "ColorId" });
         return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterions });
       }, self);
    } catch (e) {
        console.log(`Error Catch: ${e}`);
    }
  })();
});