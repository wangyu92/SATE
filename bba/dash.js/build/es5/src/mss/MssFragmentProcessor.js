/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _MssFragmentMoofProcessor=require('./MssFragmentMoofProcessor');var _MssFragmentMoofProcessor2=_interopRequireDefault(_MssFragmentMoofProcessor);var _MssFragmentMoovProcessor=require('./MssFragmentMoovProcessor');var _MssFragmentMoovProcessor2=_interopRequireDefault(_MssFragmentMoovProcessor);var _MssEvents=require('./MssEvents');var _MssEvents2=_interopRequireDefault(_MssEvents); // Add specific box processors not provided by codem-isoboxer library
function arrayEqual(arr1,arr2){return arr1.length === arr2.length && arr1.every(function(element,index){return element === arr2[index];});}function saioProcessor(){this._procFullBox();if(this.flags & 1){this._procField('aux_info_type','uint',32);this._procField('aux_info_type_parameter','uint',32);}this._procField('entry_count','uint',32);this._procFieldArray('offset',this.entry_count,'uint',this.version === 1?64:32);}function saizProcessor(){this._procFullBox();if(this.flags & 1){this._procField('aux_info_type','uint',32);this._procField('aux_info_type_parameter','uint',32);}this._procField('default_sample_info_size','uint',8);this._procField('sample_count','uint',32);if(this.default_sample_info_size === 0){this._procFieldArray('sample_info_size',this.sample_count,'uint',8);}}function sencProcessor(){this._procFullBox();this._procField('sample_count','uint',32);if(this.flags & 1){this._procField('IV_size','uint',8);}this._procEntries('entry',this.sample_count,function(entry){this._procEntryField(entry,'InitializationVector','data',8);if(this.flags & 2){this._procEntryField(entry,'NumberOfEntries','uint',16);this._procSubEntries(entry,'clearAndCryptedData',entry.NumberOfEntries,function(clearAndCryptedData){this._procEntryField(clearAndCryptedData,'BytesOfClearData','uint',16);this._procEntryField(clearAndCryptedData,'BytesOfEncryptedData','uint',32);});}});}function uuidProcessor(){var tfxdUserType=[0x6D,0x1D,0x9B,0x05,0x42,0xD5,0x44,0xE6,0x80,0xE2,0x14,0x1D,0xAF,0xF7,0x57,0xB2];var tfrfUserType=[0xD4,0x80,0x7E,0xF2,0xCA,0x39,0x46,0x95,0x8E,0x54,0x26,0xCB,0x9E,0x46,0xA7,0x9F];var sepiffUserType=[0xA2,0x39,0x4F,0x52,0x5A,0x9B,0x4f,0x14,0xA2,0x44,0x6C,0x42,0x7C,0x64,0x8D,0xF4];if(arrayEqual(this.usertype,tfxdUserType)){this._procFullBox();if(this._parsing){this.type = 'tfxd';}this._procField('fragment_absolute_time','uint',this.version === 1?64:32);this._procField('fragment_duration','uint',this.version === 1?64:32);}if(arrayEqual(this.usertype,tfrfUserType)){this._procFullBox();if(this._parsing){this.type = 'tfrf';}this._procField('fragment_count','uint',8);this._procEntries('entry',this.fragment_count,function(entry){this._procEntryField(entry,'fragment_absolute_time','uint',this.version === 1?64:32);this._procEntryField(entry,'fragment_duration','uint',this.version === 1?64:32);});}if(arrayEqual(this.usertype,sepiffUserType)){if(this._parsing){this.type = 'sepiff';}sencProcessor.call(this);}}function MssFragmentProcessor(config){config = config || {};var context=this.context;var metricsModel=config.metricsModel;var playbackController=config.playbackController;var eventBus=config.eventBus;var protectionController=config.protectionController;var ISOBoxer=config.ISOBoxer;var log=config.log;var instance=undefined;function setup(){ISOBoxer.addBoxProcessor('uuid',uuidProcessor);ISOBoxer.addBoxProcessor('saio',saioProcessor);ISOBoxer.addBoxProcessor('saiz',saizProcessor);ISOBoxer.addBoxProcessor('senc',sencProcessor);}function generateMoov(rep){var mssFragmentMoovProcessor=(0,_MssFragmentMoovProcessor2['default'])(context).create({protectionController:protectionController,constants:config.constants,ISOBoxer:config.ISOBoxer});return mssFragmentMoovProcessor.generateMoov(rep);}function processFragment(e,sp){if(!e){return;}var request=e.request;if(!request){return;}if(request.type === 'MediaSegment'){ // it's a MediaSegment, let's convert fragment
var mssFragmentMoofProcessor=(0,_MssFragmentMoofProcessor2['default'])(context).create({metricsModel:metricsModel,playbackController:playbackController,ISOBoxer:ISOBoxer,log:log});mssFragmentMoofProcessor.convertFragment(e,sp);}else if(request.type === 'FragmentInfoSegment'){ // it's a FragmentInfo, ask relative fragment info controller to handle it
eventBus.trigger(_MssEvents2['default'].FRAGMENT_INFO_LOADING_COMPLETED,{fragmentInfo:e,streamProcessor:sp}); // Change the sender value to stop event to be propagated (fragment info must not be added to buffer)
e.sender = null;}}instance = {generateMoov:generateMoov,processFragment:processFragment};setup();return instance;}MssFragmentProcessor.__dashjs_factory_name = 'MssFragmentProcessor';exports['default'] = dashjs.FactoryMaker.getClassFactory(MssFragmentProcessor); /* jshint ignore:line */module.exports = exports['default'];
//# sourceMappingURL=MssFragmentProcessor.js.map
