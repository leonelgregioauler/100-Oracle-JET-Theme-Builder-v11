/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['knockout', 'ojs/ojcore', 'jquery', 'ojs/ojinputtext', 'ojs/ojbutton'],
function (ko, oj, $) {
  "use strict";
  var SourceTabsModel = function (params) {
    var self = this;
    self.config = ko.observable('Settings File');
    self.cssvalue = ko.observable("Somewhat long value");
    
    self.basecssSettingsFileUrl = ko.computed(function() {
      return 'pcss/oj/oj/all-components/themes/redwood/oj.redwood.cssvars.settings.css'
    }, this);
    
    $.get(self.basecssSettingsFileUrl(), function(data) {
      $('#settings-text-area').val(data);
      $('#settings-text-area').autofocus = false;
    });
    
    
    self.textlistener = function(event) {
      $(".oj-textarea-input").scrollTop(0);
    }
    
    self.openListener = function (event)
    {
      document.querySelector("#modelessCssVars").open();
    };
    
    
    self.applyCodeChanges = function () {
      if(document.getElementById('dynamicCSS') === null) {
        var sheet = document.createElement('style');
        sheet.setAttribute('id', "dynamicCSS");
        sheet.innerHTML = self.cssvalue();
        document.body.appendChild(sheet);
      } 
      else {
        document.getElementById('dynamicCSS').innerHTML = self.cssvalue();
      }
      var lines = document.getElementById("settings-text-area").value.split('\n');
      var string = "^\s*[^\s*/*].*";
      lines.forEach(function(line){
        line = line.trimStart();
        if(line.match(string) && line.startsWith("--"))
        {
         var split = [];
         //save the name and value in an array
         split = line.split(' ').filter(v=>v);
         var split0 = split[0];
         var split1 = split[1];
         var name = split0.substring(0, split0.length - 1);
         var value = split1.substring(0, split1.length - 1);
         // apply changes to left side panel dataprovider
         var element = document.querySelector('table.oj-collapsible-content tbody tr[title=' + '"' +  name + '"' +']');
         // background-color left side panel dataprovider
         element.getElementsByClassName("demo-var-color")[0].style["background-color"] = value;
         // value name left side panel dataprovider
         element.getElementsByClassName("demo-var-hex")[0].textContent = value;
        }
      });
    };
    
  };
  return SourceTabsModel;
});
