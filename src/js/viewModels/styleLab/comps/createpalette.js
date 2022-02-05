/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojarraydataprovider',  'ojs/ojbutton', 'ojs/ojinputtext'],

function(oj, ko, $)
{
    var colorPaletteviewModel = function()
    {
  		var self = this;
      
      var brandRampVarMap = [], neutralRampVarMap = [], textRampVarMap = [], accentRampVarMap = [],
      collectPalette = [], collectAll = [];
      var styles = getComputedStyle(document.documentElement);
      
      /*var manipulate = function(val) {
        if (val.indexOf('hsl(') == 0) {
          var getVars = val.split('(');
          var gethue = getVars[2].split(',');
          var getsat = getVars[3].split(',');
          return "hsl("+styles.getPropertyValue(gethue[0].replace(')',''))+", "+styles.getPropertyValue(getsat[0].replace(')',''))+", "+getsat[1].replace(')','').trim()+")";
        } else if (val.indexOf('hsla(') == 0) {
          var gethslVars = val.split('(');
          var gethsl = gethslVars[2].split(',');
          return "hsla("+styles.getPropertyValue(gethsl[0].replace(')',''))+", "+gethsl[1].replace(')','').trim()+")";
        } else {
          return val;
        }
      }*/
      
      function manipulate(val) {
        var value = val;
        if(value.charAt(3) === ',' || value.charAt(2) === ','){
          value = 'rgb(' + value + ')';
        }
        if(value.charAt(1) === '.'){
          value = 'rgba(0,0,0,' + value + ')';
        }
        return value;
      }

      var ruleList = document.styleSheets[0].cssRules;
      for(var l = ruleList.length; l > 0; l--) {
        if (ruleList[l-1].selectorText == ':root') {
          var css = ruleList[l-1].cssText.split('{');
          css = css[1].replace('}','').split(';');
          for (var i = 0; i < css.length; i++) {
            var prop = css[i].split(':');
            if (prop.length == 2 && prop[0].indexOf('--') == 1) {
              if(prop[0].indexOf('--oj-palette-brand') == 1) {
                if(collectPalette.indexOf(prop[0].trim()) == -1) {
                  collectPalette.push(prop[0].trim());
                  brandRampVarMap.push({name:prop[0].trim(),cvalue:manipulate(prop[1].trim()),ColorId:i});
                }
              }
              else if(prop[0].indexOf('--oj-palette-neutral') == 1) {
                if(collectPalette.indexOf(prop[0].trim()) == -1) {
                  collectPalette.push(prop[0].trim());
                  neutralRampVarMap.push({name:prop[0].trim(),cvalue:manipulate(prop[1].trim()),ColorId:i});
                }
              }
              else if(prop[0].indexOf('--oj-palette-text') == 1) {
                  if(collectPalette.indexOf(prop[0].trim()) == -1) {
                    collectPalette.push(prop[0].trim());
                    textRampVarMap.push({name:prop[0].trim(),cvalue:manipulate(prop[1].trim()),ColorId:i});
                  }
              }
              else if(prop[0].indexOf('--oj-palette') == 1) {
                if(collectPalette.indexOf(prop[0].trim()) == -1) {
                  collectPalette.push(prop[0].trim());
                  accentRampVarMap.push({name:prop[0].trim(),cvalue:manipulate(prop[1].trim()),ColorId:i});
                }
              }
            }              
          }
        }
      }
      
      self.colordatasource = new oj.ArrayDataProvider(brandRampVarMap, {keyAttributes: 'ColorId'});
      self.neutralcolordatasource = new oj.ArrayDataProvider(neutralRampVarMap, {keyAttributes: 'ColorId'});
      self.textcolordatasource = new oj.ArrayDataProvider(textRampVarMap, {keyAttributes: 'ColorId'});
      self.accentcolordatasource = new oj.ArrayDataProvider(accentRampVarMap, {keyAttributes: 'ColorId'});
      
      self.columnArray = [{"headerText": "Color",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("color_code", true)},
                          {"headerText": "CSS Custom Property Name",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_name", true)},
                          {"headerText": "Value",
                           "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_value", true)}
                         ];
    }
    return colorPaletteviewModel;
});
