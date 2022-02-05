/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojkoshared","knockout","ojs/ojcore-base"],function(e,t,r){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,e.addPostprocessor({nodeHasBindings:function(e,t){return t||1===e.nodeType&&"oj-defer"===e.nodeName.toLowerCase()},getBindingAccessors:function(e,t,r){var n=r;return 1===e.nodeType&&"oj-defer"===e.nodeName.toLowerCase()&&((n=n||{})._ojDefer_=function(){}),n}}),t.bindingHandlers._ojDefer_={init:function(e,r,n,o,i){var a=e;if(a._shown)t.applyBindingsToDescendants(i,a);else if(!a._activateSubtree){for(var s=[];a.firstChild;)s.push(a.firstChild),a.removeChild(a.firstChild);a._activateSubtree=e=>{s.forEach(t=>e.appendChild(t)),t.applyBindingsToDescendants(i,e)}}return{controlsDescendantBindings:!0}}};const n={};r._registerLegacyNamespaceProp("DeferElement",n),n.register=function(){var e=Object.create(HTMLElement.prototype);Object.defineProperties(e,{_activate:{value:function(){this._activateSubtree?(this._activateSubtree(this),delete this._activateSubtree):Object.defineProperty(this,"_shown",{configurable:!1,value:!0})},writable:!1},_activateSubtree:{value:null,writable:!0,configurable:!0}});var t=function(){const e=window.Reflect;let t;return t=void 0!==e?e.construct(HTMLElement,[],this.constructor):HTMLElement.call(this),t};Object.defineProperty(e,"constructor",{value:t,writable:!0,configurable:!0}),t.prototype=e,Object.setPrototypeOf(t,HTMLElement),customElements.define("oj-defer",t)},n.register()});
//# sourceMappingURL=ojdefer.js.map