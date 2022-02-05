/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define([
'ojs/ojcore', 
'knockout', 
'jquery', 
'ojs/ojarraydataprovider',
'ojs/ojmodulerouter-adapter',
'ojs/ojknockoutrouteradapter',
'ojs/ojknockout', 
'ojs/ojtable',
'ojs/ojnavigationlist',
'ojs/ojmodule-element'],
function(oj, ko, $, ArrayDataProvider, ModuleRouteradapter, KnockoutRouterAdapter)
{   
var variablesViewModel = function(args) {
  
  const routes = [
    { path: "variableNames", detail: { label: "Variable Names" } },
    { path: "migration", detail: { label: "Migration" } }
  ];
  const router = args.parentRouter.createChildRouter(
    routes.concat([{ path: "", redirect: "variableNames" }])
  );
  self.moduleAdapter = new ModuleRouteradapter(router, {
    viewPath: "views/styleLab/comps/",
    viewModelPath: "viewModels/styleLab/comps/"
  });
  self.selection = new KnockoutRouterAdapter(router);
  self.dataProvider = new ArrayDataProvider(routes, {
    keyAttributes: "path"
  });
};
return variablesViewModel;
});