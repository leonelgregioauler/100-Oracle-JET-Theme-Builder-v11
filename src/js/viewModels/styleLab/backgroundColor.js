/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojselectsingle', 'ojs/ojbinddom', 'ojs/ojlabel'],
function(oj, ko, ArrayDataProvider, HtmlUtils) {
  
  // List of all background color classes
  const colorCssClassNames = [
    'oj-bg-neutral-0',
    'oj-bg-neutral-10',
    'oj-bg-neutral-20',
    'oj-bg-neutral-30',
    'oj-bg-brand-10',
    'oj-bg-brand-20',
    'oj-bg-brand-30',
    'oj-bg-danger-10',
    'oj-bg-danger-20',
    'oj-bg-danger-30',
    'oj-bg-warning-10',
    'oj-bg-warning-20',
    'oj-bg-warning-30',
    'oj-bg-success-10',
    'oj-bg-success-20',
    'oj-bg-success-30',
    'oj-bg-info-10',
    'oj-bg-info-20',
    'oj-bg-info-30'
  ];
  
  // TODO: This function should be exposed as an util function?
  /**
   * Returns an Array of JET CSS variables.
   * @return {Object[]}
   */
  function getJetCssVars() {
    const cssVars = [];
    const documentComputedStyles = getComputedStyle(document.documentElement);
    const rules = Array.from(document.styleSheets[0].cssRules);
    const rootRules = rules.filter(rule => rule.selectorText === ':root');
    rootRules.forEach(rule => {
      const props = rule.cssText.replace(':root', '').replace('{', '').replace('}', '').split(';');
      props.forEach(prop => {
        const propFields = prop.split(':');
        const propName = propFields[0] && propFields[0].trim();
        if(propFields.length === 2 && propName.match(/^--oj/)) {
          cssVars.push({
            key: propName,
            value: documentComputedStyles.getPropertyValue(propName).trim()
          });
        }
      });
    });
    return cssVars;
  }
  
  /**
   * Returns an Array with JET background classes,
   * and background-color values in classes
   * @return {Object[]}
   */
  function getBgClassValues() {
    const docStyleHolder = getComputedStyle(document.documentElement);
    const cssRules = Array.from(document.styleSheets[0].cssRules);
    let cssVarsArray = [];
    colorCssClassNames.forEach(className => {
      const getcssClass = cssRules.find((post, index) => {
        if(post.selectorText === `.${className}`) {
          return true;
        }
      });
      const getCssProperty = getcssClass.cssText.match(/background.+\)/gi);
      const getCssVariable = getCssProperty[0].match(/\-\-.+\)/gi).toString().slice(0, -2);
      cssVarsArray.push({
        variableName:`${getCssVariable}`,
        className:`.${className}`
      });
    });
    return cssVarsArray;
  }
  

  const viewModel  = function(params) {
    this.currentBgColor = params.bgColor;
    this.HtmlUtils = HtmlUtils;
    
    const colorCssVarNames = getBgClassValues();
    const cssVars = getJetCssVars();
    const bgColorsArray = ko.observableArray();
    
    colorCssVarNames.forEach(colorCssVarName => {
      const cssVar = cssVars.find(cssVar => cssVar.key === colorCssVarName.variableName);
      if(!cssVar) return;
      bgColorsArray.push({
        label: colorCssVarName.className,
        backgroundColor: `rgb(${cssVar.value})`
      });
    });

    this.dataProvider = new ArrayDataProvider(bgColorsArray, {
      keyAttributes: 'label',
      textFilterAttributes: ['label']
    });

    this.highlight = function(unhighlightedText, searchText) {
      if (searchText && searchText.length) {
        return unhighlightedText.replace(new RegExp(searchText, 'gi'),
            '<span class="demo-result-highlight">$&</span>');
      }
      return unhighlightedText;
    };

    this.getItemText = function(itemContext) {
      return itemContext.data.label;
    };

    this.selectedValue = ko.observable('.oj-bg-neutral-0');

    this.valueChangedHandler = function(event) {
      const value = event.detail.value;
      if(value === 'oj-bg-neutral-0') {
        this.currentBgColor(value);
      } else {
        const classVar = colorCssVarNames.find(colorCssVarName => colorCssVarName.className === value);
        const cssVar = cssVars.find(cssVar => cssVar.key === classVar.variableName);
        if(cssVar) this.currentBgColor(`rgb(${cssVar.value})`);
      }
    }.bind(this);
  };

  return viewModel;
});