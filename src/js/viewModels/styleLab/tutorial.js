/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define([
  "ojs/ojmodulerouter-adapter",
  "ojs/ojknockoutrouteradapter",
  "ojs/ojarraydataprovider",
  "ojs/ojnavigationlist",
  "ojs/ojmodule-element"
], function(ModuleRouteradapter, KnockoutRouterAdapter, ArrayDataProvider) {
  function ViewModel(args) {
    const routes = [
      { path: "variableNames", detail: { label: "Variable Names" } },
      { path: "migration", detail: { label: "Migration" } }
    ];
    const router = args.parentRouter.createChildRouter(
      routes.concat([{ path: "", redirect: "variableNames" }])
    );
    this.moduleAdapter = new ModuleRouteradapter(router, {
      viewPath: "views/styleLab/comps/",
      viewModelPath: "viewModels/styleLab/comps/"
    });
    this.selection = new KnockoutRouterAdapter(router);
    this.dataProvider = new ArrayDataProvider(routes, {
      keyAttributes: "path"
    });
  }

  return ViewModel;
});
