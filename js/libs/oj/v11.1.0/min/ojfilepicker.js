/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojdomutils","ojs/ojvcomponent","preact","ojs/ojtranslation","ojs/ojfilepickerutils","ojs/ojfocusutils"],function(e,t,i,r,l,s,n,o){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o;var a=function(e,t,i,r){var l,s=arguments.length,n=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var o=e.length-1;o>=0;o--)(l=e[o])&&(n=(s<3?l(n):s>3?l(t,i,n):l(t,i))||n);return s>3&&n&&Object.defineProperty(t,i,n),n};e.FilePicker=class extends l.Component{constructor(e){super(e),this.rootRef=l.createRef(),this._handleSelectingFiles=e=>{var t;if("click"===e.type||"keypress"===e.type&&"Enter"===e.code){this.selecting=!0,e.preventDefault();const i=this.props;return n.pickFiles(this._handleFileSelected,{accept:i.accept,selectionMode:i.selectionMode,capture:null!==(t=i.capture)&&void 0!==t?t:"none"}),!0}return!1},this._handleFileSelected=e=>{this._fileSelectedHelper(e)},this._handleDragEnter=e=>{e.preventDefault(),e.stopPropagation()},this._handleDragOver=e=>{e.preventDefault(),e.stopPropagation();const i=e.dataTransfer;if(this.inDropZone)return;const r=t.AgentUtils.getAgentInfo();if(this.inDropZone=!0,this.isDroppable=!0,r.browser!==t.AgentUtils.BROWSER.SAFARI&&r.browser!==t.AgentUtils.BROWSER.IE){const t=i.items;let r=[];const l=this._validateSelectionMode(t),n=this._validateTypes(t);l&&0===n.rejected.length?this.setState({validity:"valid"}):(this.isDroppable=!1,l?r=this._getMimeTypeValidationMessages(n.rejected):r.push({severity:"error",summary:s.getTranslatedString("oj-ojFilePicker.singleFileUploadError")}),this._fireInvalidSelectAction(r,e,!0))}else this.setState({validity:"valid"})},this._handleDragLeave=(e,t=!1)=>{this.inDropZone&&(e.preventDefault(),e.stopPropagation(),this.rootRef.current.contains(e.relatedTarget)||(this.inDropZone=!1,this.setState({validity:"NA"}),this.isDroppable||t||(this.dragPromiseResolver(),this.dragPromiseResolver=null)))},this._handleFileDrop=e=>{if(this.inDropZone){e.preventDefault(),e.stopPropagation();const t=this._createFileList(e.dataTransfer.files);let i=!1;if(this.isDroppable){let r=[];if(this._validateSelectionMode(t)){const e=this._validateTypes(t);e.rejected.length>0&&(r=this._getMimeTypeValidationMessages(e.rejected),i=!0)}else r.push({severity:"error",summary:s.getTranslatedString("oj-ojFilePicker.singleFileUploadError")});r.length>0&&(this.isDroppable=!1,this._fireInvalidSelectAction(r,e,!1)),this.isDroppable&&this._handleFilesAdded(t,e)}this._handleDragLeave(e,i)}},this._handleFocusIn=()=>{this.selecting||this.setState({focus:!i.recentPointer()})},this._handleFocusOut=()=>{this.selecting||this.setState({focus:!1})},this._handleFocus=e=>{var t;null===(t=this.rootRef.current)||void 0===t||t.dispatchEvent(new FocusEvent("focus",{relatedTarget:e.relatedTarget}))},this._handleBlur=e=>{var t;null===(t=this.rootRef.current)||void 0===t||t.dispatchEvent(new FocusEvent("blur",{relatedTarget:e.relatedTarget}))},this.state={focus:!1,validity:"NA"}}_doSelectHelper(e){const t=new Promise(e=>{this.elementPromiseResolver=e});return this._fileSelectedHelper(e),t}_fileSelectedHelper(e){if(e.length>0){const t=this._validateTypes(e).rejected;t.length>0?this._fireInvalidSelectAction(this._getMimeTypeValidationMessages(t),null,!1):this._handleFilesAdded(e,null)}this.selecting=!1}focus(){o.focusFirstTabStop(this.rootRef.current)}blur(){const e=document.activeElement;this.rootRef.current.contains(e)&&e.blur()}render(e){const t=e.trigger;if(e.disabled)return this._renderDisabled(e,t);const i="drop"!==e.selectOn?this._handleSelectingFiles:void 0;return t?this._renderWithCustomTrigger(e,t,i):this._renderWithDefaultTrigger(e,i)}_renderDisabled(e,t){const i=t?"oj-filepicker":"oj-filepicker oj-filepicker-no-trigger";return l.h(r.Root,{class:i},l.h("div",{class:"oj-filepicker-disabled oj-filepicker-container"},t||this._renderDefaultTriggerContent(e)))}_renderWithCustomTrigger(e,t,i){const s=this._getDndHandlers(e);return l.h(r.Root,{class:"oj-filepicker "+this._getFocusClass(),ref:this.rootRef,onfocusin:this._handleFocusIn,onfocusout:this._handleFocusOut,onFocus:this._handleFocus,onBlur:this._handleBlur,role:this._getRole(e,i),"aria-label":this._getAriaLabel(e,i)},l.h("div",{onClick:i,onKeyPress:this._handleSelectingFiles,onDragEnter:s.handleDragEnter,onDragOver:s.handleDragOver,onDragLeave:s.handleDragLeave,onDragEnd:s.handleDragLeave,onDrop:s.handleFileDrop,class:"oj-filepicker-container"},t))}_renderWithDefaultTrigger(e,t){const i=this.state.validity,s="valid"===i?"oj-valid-drop":"invalid"===i?"oj-invalid-drop":"",n=this._getDndHandlers(e);return l.h(r.Root,{class:"oj-filepicker oj-filepicker-no-trigger",ref:this.rootRef,role:this._getRole(e,t),"aria-label":this._getAriaLabel(e,t)},l.h("div",{onClick:t,onKeyPress:this._handleSelectingFiles,class:"oj-filepicker-container"},l.h("div",{tabIndex:0,class:`oj-filepicker-dropzone ${s} ${this._getFocusClass()}`,onDragEnter:n.handleDragEnter,onDragOver:n.handleDragOver,onDragLeave:n.handleDragLeave,onDragEnd:n.handleDragLeave,onDrop:n.handleFileDrop,onfocusin:this._handleFocusIn,onfocusout:this._handleFocusOut,onFocus:this._handleFocus,onBlur:this._handleBlur},this._renderDefaultTriggerContent(e))))}_renderDefaultTriggerContent(e){return[l.h("div",{class:"oj-filepicker-text"},this._getPrimaryText(e)),l.h("div",{class:"oj-filepicker-secondary-text"},this._getSecondaryText(e))]}_getRole(e,t){const i=t?"button":void 0;return e.role?e.role:i}_getAriaLabel(e,t){const i=t?e.trigger?"Add Files.":`Add Files. ${this._getPrimaryText(e)}. ${this._getSecondaryText(e)}`:void 0;return e["aria-label"]?e["aria-label"]:i}_getPrimaryText(e){const t=e.primaryText;let i;if(t)if("string"==typeof t)i=t;else{i=t()}else i=s.getTranslatedString("oj-ojFilePicker.dropzonePrimaryText");return i}_getSecondaryText(e){const t="single"===e.selectionMode,i=e.secondaryText;let r;if(i)if("string"==typeof i)r=i;else{r=i({selectionMode:e.selectionMode})}else r=s.getTranslatedString(t?"oj-ojFilePicker.secondaryDropzoneText":"oj-ojFilePicker.secondaryDropzoneTextMultiple");return r}_getDndHandlers(e){return"click"!==e.selectOn?{handleDragEnter:this._handleDragEnter,handleDragOver:this._handleDragOver,handleDragLeave:this._handleDragLeave,handleFileDrop:this._handleFileDrop}:{}}_getFocusClass(){return this.state.focus?"oj-focus-highlight":""}_validateSelectionMode(e){return"single"!==this.props.selectionMode||1===e.length}_validateTypes(e){const t=[],i=[];let r,l;if(e)for(let n=0;n<e.length;n++){r=e[n];const o=r.name;if(l=s.getTranslatedString("oj-ojFilePicker.unknownFileType"),o){let e=o.split(".");l=e.length>1?"."+e.pop():l}l=r.type?r.type:l,-1===t.indexOf(l)&&-1===i.indexOf(l)&&(this._acceptFile(r)?t.push(l):i.push(l))}return{accepted:t,rejected:i}}_getMimeTypeValidationMessages(e){const t=[];return 1===e.length?t.push({severity:"error",summary:s.getTranslatedString("oj-ojFilePicker.singleFileTypeUploadError",{fileType:e[0]})}):t.push({severity:"error",summary:s.getTranslatedString("oj-ojFilePicker.multipleFileTypeUploadError",{fileTypes:e.join(s.getTranslatedString("oj-converter.plural-separator"))})}),t}_acceptFile(e){const i=this.props.accept;if(!i||0===i.length||!e)return!0;let r;for(let l=0;l<i.length;l++){if(r=t.StringUtils.trim(i[l]),!r)return!0;if(r.startsWith(".",0)){if(!e.name||e.name&&e.name.endsWith(r))return!0}else{if(!e.type)return!1;if("image/*"===r){if(e.type.startsWith("image/",0))return!0}else if("video/*"===r){if(e.type.startsWith("video/",0))return!0}else if("audio/*"===r){if(e.type.startsWith("audio/",0))return!0}else if(e.type===r)return!0}}return!1}_handleFilesAdded(e,t){var i,r;const l=this._createFileList(e);null===(r=(i=this.props).onOjBeforeSelect)||void 0===r||r.call(i,{files:l,originalEvent:t}).then(()=>{var e,i;null===(i=(e=this.props).onOjSelect)||void 0===i||i.call(e,{files:l,originalEvent:t}),this.elementPromiseResolver&&(this.elementPromiseResolver(),this.elementPromiseResolver=null)},e=>{this._fireInvalidSelectAction(e,t,!1)})}_fireInvalidSelectAction(e,t,i){var r,l;i&&this.setState({validity:"invalid"});const s=i?new Promise(e=>{this.dragPromiseResolver=e}):null;null===(l=(r=this.props).onOjInvalidSelect)||void 0===l||l.call(r,{messages:e,originalEvent:t,until:s}),this.elementPromiseResolver&&(this.elementPromiseResolver(),this.elementPromiseResolver=null)}_createFileList(e){const t={length:{value:e.length},item:{value(e){return this[e]}}};for(let i=0;i<e.length;i++)t[i]={value:e[i],enumerable:!0};return Object.create(FileList.prototype,t)}},e.FilePicker.defaultProps={accept:null,capture:"none",disabled:!1,selectOn:"auto",selectionMode:"multiple"},e.FilePicker.metadata={properties:{accept:{type:"Array<string>|null"},capture:{type:"string|null",enumValues:["user","environment","implementation","none"]},disabled:{type:"boolean"},primaryText:{type:"string|function"},secondaryText:{type:"string|function"},selectOn:{type:"string",enumValues:["auto","click","clickAndDrop","drop"]},selectionMode:{type:"string",enumValues:["multiple","single"]}},slots:{trigger:{}},events:{ojBeforeSelect:{cancelable:!0},ojInvalidSelect:{},ojSelect:{}},extension:{_OBSERVED_GLOBAL_PROPS:["aria-label","role"]},methods:{_doSelectHelper:{},focus:{},blur:{}}},e.FilePicker=a([r.customElement("oj-file-picker")],e.FilePicker),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojfilepicker.js.map