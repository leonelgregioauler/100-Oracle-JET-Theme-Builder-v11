/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojarraytabledatasource',  'ojs/ojbutton', 'ojs/ojinputtext'],

function(oj, ko, $)
{
    var colorMappingviewModel = function()
    {
  		var self = this;
      
      var collectPalette = [], collectAll = [];
      //Keeps all computed css variables of documentElement
      var styles = getComputedStyle(document.documentElement);
      /***************
        Gets all stylesheet impots and aggregate into one Array
      ****************/
      var ruleList = document.styleSheets[0].cssRules;
      /***************
        1. By reducing each stylesheet import collects each css rules,
        2. All :root found through selector text
        3. Then by iterating through each property and assignments, its been collected in arrays
        4. ReduceRight is being using to pick values with is most recently used and others are removed
      ****************/
      for(var l = ruleList.length; l > 0; l--) {
        if (ruleList[l-1].selectorText == ':root') {
          var css = ruleList[l-1].cssText.split('{');
          css = css[1].replace('}','').split(';');
          for (var i = 0; i < css.length; i++) {
            var prop = css[i].split(':');
            // To check whether first argument property has -- to make sure it is an valid css variable
            if (prop.length == 2 && prop[0].indexOf('--') == 1) {
              // While looping collect all variables to match against colors
              if (prop[1].trim().indexOf('var(') == 0) {
                collectAll.push(css[i]);
              }
              // Extract only color related variables
              if(prop[0].indexOf('--oj-palette') == 1 && prop[0].indexOf('-hue') < 0 && 
                 prop[0].indexOf('-saturation') < 0 && prop[0].indexOf('-hsl') < 0) {
                // To check whether values is already present in array, if not insert 
                if(collectPalette.indexOf(prop[0].trim()) == -1) {
                  collectPalette.push(prop[0].trim());
                }
              }
            }              
          }
        }
      }
      
      var assignedVarMap = [];
      // Loop through all color variables to get associated mappings
      for (var j = 0; j < collectPalette.length; j++) {
        var collectVars = [];
        // Looping through entire collection of collected color variables
        for (var k = 0; k < collectAll.length; k++) {
          var property = collectAll[k].split(':');
          // Check whether color variables value matches the item in entier collection if yes collect and store in an array
          if(styles.getPropertyValue(property[1].replace('var(','').replace(')','').trim()).replace(/ /g,'') === styles.getPropertyValue(collectPalette[j]).replace(/ /g,'')) {
            collectVars.push(property[0].trim()+"</br>");
          }
        }
        // Once the list of used variables collected put it in associated with each colors
        assignedVarMap.push({name:collectPalette[j],cvalue:styles.getPropertyValue(collectPalette[j]),associates:collectVars.join(""),ColorId:j});
      }
      
      // Array Data source assigned to oj-table
      self.assigneddatasource = new oj.ArrayDataProvider(assignedVarMap, {keyAttributes: 'ColorId'});
      
      // Table columns and its templates defined
      self.columnArray = [{"headerText": "Color",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("color_code", true)},
                          {"headerText": "CSS Custom Property Name",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_name", true)},
                          {"headerText": "Value",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_value", true)},
                          {"headerText": "Assigned Css Custom Properties",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_assigned", true)}
                         ];
    }
    return colorMappingviewModel;
});
