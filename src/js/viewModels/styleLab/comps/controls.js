/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojcore', 'knockout', 'jquery',
        './MockProgressItem',
        'ojs/ojknockout',
        'ojs/ojcollapsible',
        'ojs/ojbutton',
        'ojs/ojmenu',
        'ojs/ojmenuselectmany',
        'ojs/ojprogress-bar',
        'ojs/ojprogress-circle',
        'ojs/ojconveyorbelt',
        'ojs/ojfilmstrip',
        'ojs/ojpagingcontrol',
        'ojs/ojaccordion',
        'ojs/ojtrain',
        'ojs/ojfilepicker',
        'ojs/ojarraytabledatasource',
        'ojs/ojavatar',
        'ojs/ojinputtext',
        'ojs/ojmessages',
        'ojs/ojmessage',
        'ojs/ojformlayout'],

function(oj, ko, $, ProgressItem)
{
  var viewModel = function()
  {
    var self = this;
    self.disableButtons = ko.observableArray();
    //For TRAIN
    var trainStepsNormal = [{label:"Step One", visited:true, id:"stp1"},
            {label:"Step Two has a very long label to show whether there is wrapping or not", id:"stp2"},
            {label:"Step Three", id:"stp3"},
            {label:"Step Four", id:"stp4"}];
    var trainStepsDisabled = [{label:"Step One", disabled:true, id:"stp1"},
            {label:"Step Two has a very long label to show whether there is wrapping or not", disabled:true,id:"stp2"},
            {label:"Step Three", disabled:true, id:"stp3"},
            {label:"Step Four", disabled:true, id:"stp4"}];
    self.trainDisabled = ko.observableArray();
    self.trainSteps = ko.computed(function() {
      if(self.trainDisabled().length > 0) {
        return trainStepsDisabled;
      }
      return trainStepsNormal;
    })
    var trainMessageStepsNormal = [{label:"Error", messageType: "error", id:"stpA"},
            {label:"Warning", messageType: "warning", id:"stpB"},
            {label:"Info", messageType: "info", id:"stpC"},
            {label:"Confirmation", messageType: "confirmation", id:"stpD"}];
    var trainMessageStepsDisabled = [{label:"Error", messageType: "error", disabled:true, id:"stpA"},
            {label:"Warning", messageType: "warning", disabled:true, id: "stpB"},
            {label:"Info", messageType: "info", disabled:true, id:"stpC"},
            {label:"Confirmation", messageType: "confirmation", disabled:true, id:"stpD"}];
    self.trainMessageDisabled = ko.observableArray();
    self.trainMessageSteps = ko.computed(function() {
      if(self.trainMessageDisabled().length > 0) {
        return trainMessageStepsDisabled;
      }
      return trainMessageStepsNormal;
    })

    //For Film Strip
    self.filmStripPagingModel = ko.observable(null);

    self.transitionCompleted = function()
    {
      var filmStrip = document.getElementById('filmStrip');
      var busyContext = oj.Context.getContext(filmStrip).getBusyContext();
      busyContext.whenReady().then(function ()
      {
        // Set the Paging Control pagingModel
        self.filmStripPagingModel(filmStrip.getPagingModel());
      });
    };

    // Form layout configs
    self.labelEdge = ko.observable();
    self.maxColumnsString = ko.observable('1');
    self.maxColumns = ko.computed(function () {
      return parseInt(self.maxColumnsString(), 10);
    }.bind(self));
    self.direction = ko.observable();
    self.labelWrap = ko.observable('wrap');
    self.userAssistanceDensity = ko.observable("efficient");

  }

  self.menuSelectManyValue = ko.observableArray(['zoomTextOnly']);

  return viewModel;

});
