/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojmodule-element-utils'], function(ModuleElementUtils) {
  const viewPrefix = 'views/styleLab/comps';
  const viewModelPrefix = 'viewModels/styleLab/comps';

  function ViewModel() {
    this.controlsConfig = ModuleElementUtils.createConfig({
      viewPath: `${viewPrefix}/controls.html`,
      viewModelPath: `${viewModelPrefix}/controls`
    });
    this.layoutConfig = ModuleElementUtils.createConfig({
      viewPath: `${viewPrefix}/layout.html`,
      viewModelPath: `${viewModelPrefix}/layout`
    });
    this.formsConfig = ModuleElementUtils.createConfig({
      viewPath: `${viewPrefix}/forms.html`,
      viewModelPath: `${viewModelPrefix}/forms`
    });
    this.dataConfig = ModuleElementUtils.createConfig({
      viewPath: `${viewPrefix}/data.html`,
      viewModelPath: `${viewModelPrefix}/data`
    });
    this.dvtConfig = ModuleElementUtils.createConfig({
      viewPath: `${viewPrefix}/dvt.html`,
      viewModelPath: `${viewModelPrefix}/dvt`
    });
  }
  return ViewModel;
});