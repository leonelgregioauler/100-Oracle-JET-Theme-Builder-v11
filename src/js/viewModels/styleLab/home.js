/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "appController",
  "ojs/ojmodulerouter-adapter",
  "ojs/ojknockoutrouteradapter",
  "ojs/ojmodule-element",
  "ojs/ojknockout",
  "ojs/ojnavigationlist",
  "ojs/ojbutton",
  "ojs/ojdialog",
  "ojs/ojpopup",
  "ojs/ojmodule",
  "ojs/ojrouter",
  "ojs/ojselectcombobox",
  "ojs/ojoffcanvas"
], function(oj, ko, $, app, ModuleRouterAdapter, KnockoutRouterAdapter) {
  var viewModel = function(params) {
    var self = this;

    // ------- START TOUR RELATED---------

    var tourParams = {};

    // create the tour stops

    var mashup = {
      modulename: "tour/stops/mashup",
      launcher: "#mashup",
      position: { my: "center bottom", at: "center top", collision: "flipfit" },
      // if I set the tail to none the popup ends up under the glass pane!
      tail: "simple"
    };
    var builderInstructions = {
      modulename: "tour/stops/builderinstructions",
      launcher: "#library",
      position: { at: "center bottom", my: "end top", collision: "flipfit" }
    };

    var tourStops = [builderInstructions, mashup];

    self.startTour = function() {
      // todo: hack! the tour is in another module,
      // how can I tell the tour to start without knowing the popup id?
      $("#tourPop").ojPopup("open");
    };

    // whether to pulse the tour button when the page is first loaded
    self.tourPulse = false;

    try {
      var tourPulseKey = "tourPulse4";
      self.tourPulse =
        localStorage.getItem(tourPulseKey) == null ? true : false;
      localStorage.setItem(tourPulseKey, false);
    } catch (e) {
      console.log(
        "exception thrown: likely cause is private browsing mode which doesn't allow saving to local or session storage"
      );
      console.log(e);
    }

    self.isLaunchMenuVisible = function(edge) {
      return $("#" + edge).css("display") !== "none";
    };

    self.isOffcanvasOpen = function(offcanvas) {
      return $(offcanvas.selector).hasClass("oj-offcanvas-open");
    };

    self._toggleOpenClose = function(edge) {};

    this.labitem = ko.observable("");
    
    const childRouter = params.parentRouter.createChildRouter(
      // Add a default route to redirect to 'comps'
      [{ path: "comps", detail: { label: "Components", labitem: this.labitem } },
       { path: "", redirect: "comps" }]
    );
    this.moduleAdapter = new ModuleRouterAdapter(childRouter, {
      viewPath: "views/styleLab/",
      viewModelPath: "viewModels/styleLab/"
    });
    this.selection = new KnockoutRouterAdapter(childRouter);

    this.tourConfig = app.createConfigGetter("tour/tour.html", "tour/tour", {
      tourStops: tourStops,
      tourParams: tourParams
    });

  };

  return viewModel;
});
