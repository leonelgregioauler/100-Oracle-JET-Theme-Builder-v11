/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojarraytabledatasource'],

function(oj, ko, $) {
  var viewModel = function() {

    var self = this;
    
    // var collectValues = [], collectAll = [];
    // var styles = getComputedStyle(document.documentElement);
    // 
    // var allCSS = [].slice.call(document.styleSheets).reduce(function(prev, styleSheet) {
    //   if (styleSheet.cssRules) {
    //     return prev + [].slice.call(styleSheet.cssRules).reduceRight(function(prev, cssRule) {        
    //         if (cssRule.selectorText == ':root') {
    //           var css = cssRule.cssText.split('{');
    //           css = css[1].replace('}','').split(';');
    //           for (var i = 0; i < css.length; i++) {
    //             var prop = css[i].split(':');
    //             if (prop.length == 2 && prop[1].indexOf('--') == -1) {
    //               if(prop[1].indexOf('#') == -1 || prop[1].indexOf('transparent') == -1) {
    //                 collectAll.push(css[i]);
    //                 collectValues.push({name:prop[0].replace(/ /g, ''),cvalue:styles.getPropertyValue(prop[0].replace(/ /g, '')),ColorId:i});
    //               }
    //             }              
    //           }
    //         }
    //     }, '');
    //   }
    // }, '');
    // console.log(collectAll);
    // self.noncolordatasource = new oj.ArrayDataProvider(collectValues, {keyAttributes: 'ColorId'});
    // 
    // self.columnArray = [{"headerText": "CSS Custom Property Name",
    //                      "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_name", true)},
    //                     {"headerText": "Value",
    //                      "renderer": oj.KnockoutTemplateUtils.getRenderer("cp_value", true)}
    //                    ];
    // var generalVarsMap = oj.ThemeUtils.parseJSONFromFontFamily("demo-general-vars-map");
    // 
    // self.generalVarsDataArray = generalVarsMap.map(function (category) {
    //   return {
    //     'name': category.name,
    //     'map': new oj.ArrayTableDataSource(category.map, {idAttribute: 'name'})
    //   }
    // });
    // 
    // self.columnArray = [
    //   {
    //     "headerText": "Value", 
    //     "field": "value"
    //   },
    //   {
    //     "headerText": "General Var", 
    //     "field": "name"
    //   },
    //   {
    //     "headerText": "Vars", 
    //     "renderer": oj.KnockoutTemplateUtils.getRenderer("mapped_vars", true)
    //   }
    // ];
  }

  return viewModel;
});
