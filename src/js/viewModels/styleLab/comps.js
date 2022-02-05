/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define([
  "knockout",
  "ojs/ojmodulerouter-adapter",
  "ojs/ojknockoutrouteradapter",
  "ojs/ojmodule-element-utils",
  "ojs/ojlabel",
  "ojs/ojselectcombobox",
  "ojs/ojtabs",
  "ojs/ojmodule-element"
], function(
  ko,
  ModuleRouterAdapter,
  KnockoutRouterAdapter,
  ModuleElementUtils
) {
  function ViewModel(params) {
    this.componentTypes = [
      { path: "all", detail: { label: "All" } },
      { path: "controls", detail: { label: "Controls" } },
      { path: "layout", detail: { label: "Layout & Nav" } },
      { path: "forms", detail: { label: "Forms" } },
      { path: "data", detail: { label: "Collections" } },
      { path: "dvt", detail: { label: "Visualizations" } }
    ];

    const router = params.parentRouter.createChildRouter(
      this.componentTypes.concat({ path: "", redirect: "all" })
    );
    this.moduleAdapter = new ModuleRouterAdapter(router, {
      viewPath: "views/styleLab/comps/",
      viewModelPath: "viewModels/styleLab/comps/"
    });
    this.selection = new KnockoutRouterAdapter(router);
    router.sync();

    // Relay our selection change to the root's labitem observable
    this.selection.path.subscribe(path => params.routerState.detail.labitem(path));

    this.bgColor = ko.observable();
    this.bgModule = ModuleElementUtils.createConfig({
      viewPath: "views/styleLab/backgroundColor.html",
      viewModelPath: "viewModels/styleLab/backgroundColor",
      params: {
        bgColor: this.bgColor
      }
    });
  }

  return ViewModel;
});
