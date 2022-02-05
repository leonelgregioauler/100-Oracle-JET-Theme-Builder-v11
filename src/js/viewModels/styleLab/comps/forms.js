/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojbootstrap', 'ojs/ojresponsiveutils',
        'ojs/ojresponsiveknockoututils', 'jquery', 'ojs/ojarraydataprovider',
        'ojs/ojconverterutils-i18n', 'ojs/ojconverter-datetime', 'ojs/ojcolor',
        'ojs/ojknockout', 'ojs/ojselectcombobox', 'ojs/ojdatetimepicker',
        'ojs/ojinputtext', 'ojs/ojradioset', 'ojs/ojcheckboxset',
        'ojs/ojinputnumber', 'ojs/ojswitch', 'ojs/ojslider', 'ojs/ojbutton',
        'ojs/ojcolorspectrum', 'ojs/ojcolorpalette', 'ojs/ojselectsingle',
        'ojs/ojformlayout'],

function(oj, ko, Bootstrap, responsiveUtils, responsiveKnockoutUtils, $, ArrayDataProvider, ConverterUtilsI18n, DateTimeConverter, Color)
{

    var viewModel = function()
    {

      var self = this;

      self.isSmall = responsiveKnockoutUtils.createMediaQueryObservable(
        responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));

      self.isMedium = responsiveKnockoutUtils.createMediaQueryObservable(
        responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.MD_ONLY));

      // For small screens: single column layout
      // For medium screens and up: two column layout
      // For large screens and up: three column layout
      self.cols = ko.computed(function () {
        if(self.isSmall())
          return 1;
        else if(self.isMedium())
          return 2;
        else
          return 3;
      }, self);

      this.booleans = ko.observableArray([]);
      this.formState = ko.observable('enabled');
      this.valueLength = ko.observable('long');
      this.formControls = ko.observableArray([]);
      this.formControlDisabledState = ko.observable('no');
      this.readonlyFormLayout = ko.computed(function () {
        if (this.formState() === 'readonly') { return true; }
        return false;
      }.bind(this));
      this.userAssistanceDensity = ko.observable("efficient");
      this.placeholder = ko.computed(function () {
        return this.booleans.indexOf('placeholder') !== -1;
      }.bind(this));

      this.messages = ko.observableArray([]);
      var _errorMsg = {summary: 'Error summary', detail: 'Enter a value that meets the requirements of the field please.' };
      var _warningMsg = {summary: 'Warning summary', detail: 'Warning detail.', severity: 'warning' };
      var _infoMsg = {summary: 'Info summary', detail: 'Info detail', severity: 'info' };
      var _confirmationMsg = {summary: 'Confirmation summary', detail: 'Confirmation detail', severity: 'confirmation' };

      this.messages = ko.computed(function () {
        var msgs = [];

        if (this.formState() === 'enabled') {
          if (this.formControls.indexOf('error') > -1) {
            msgs.push(_errorMsg);
          }
          if (this.formControls.indexOf('warning') > -1) {
            msgs.push(_warningMsg);
          }
          if (this.formControls.indexOf('info') > -1) {
            msgs.push(_infoMsg);
          }
          if (this.formControls.indexOf('confirmation') > -1) {
            msgs.push(_confirmationMsg);
          }
        }

        return msgs;
      }.bind(this));

      this.required = ko.computed(function () {
        return this.booleans.indexOf('required') !== -1;
      }.bind(this));

      this.disableFormControls = ko.computed(function () {
        if (this.formState() === 'yes') { return true; }
        return false;
      }.bind(this));

      this.inputDateValue = ko.computed(() => {
        let nonNull = ConverterUtilsI18n.IntlConverterUtils.dateToLocalIso(new Date());
        return nonNull;
      });
      this.inputTimeValue = ko.computed(() => {
        let nonNull = ConverterUtilsI18n.IntlConverterUtils.dateToLocalIso(new Date());
        return nonNull;
      });
      this.dateTimePatternConverter =
        new DateTimeConverter.IntlDateTimeConverter({
          pattern: "EEEE, MMMM d, y,  h:mm:ss a"
        });
      this.inputDateTimeConverter = ko.computed(function () {
        return null;
      }.bind(this));

      let browsers = [
        { value: 'IE', label: 'Windows Internet Explorer Version 11' },
        { value: 'FF', label: 'Android 11 Firefox' },
        { value: 'CH', label: 'Chrome' },
        { value: 'OP', label: 'Windows 10 Opera' },
        { value: 'SA', label: 'iOS Iphone 11Pro Safari' }
                     ];
      this.browsersDP = new ArrayDataProvider(browsers, {keyAttributes: 'value'});

      this.textareaValue3 = ko.computed(function () {
        let shortText = 'textarea is a field that has rows so that a user can see more text than an input text without needing to scroll.';
        return shortText+shortText;
      }.bind(this));

      this.colorSpectrumValue = new Color('rgba(21,0,255,0.8)');

      this.colorPaletteValue = ko.observable(Color.RED);
      this.colorPickerPalette = [
      { color: new Color('#000000') },
      { color: new Color('#c0c0c0') },
      { color: new Color('#808080') },
      { color: new Color('#ffffff') },
      { color: new Color('#800000') },
      { color: new Color('#ff0000') },
      { color: new Color('#800080') },
      { color: new Color('#ff00ff') },
      { color: new Color('#008000') },
      { color: new Color('#00ff00') }
      ];

    }

    return viewModel;
});
