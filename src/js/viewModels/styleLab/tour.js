/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojtabs", "ojs/ojmodule-element"], function() {
  function ViewModel(params) {}
    this.variableType = [
      //{id: 'variablelist', label: 'Files' },
      //{id: 'createpalette', label: 'Palette' },
      //{id: 'colormappings', label: 'Color Mappings' },
      {id: 'variableNames', label: 'Variable Names' },
      {id: 'migration', label: 'Migration' }
      // {id: 'generalVars', label: 'General Vars' }
    ];

  return ViewModel;
});
