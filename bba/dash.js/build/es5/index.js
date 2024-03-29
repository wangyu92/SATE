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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _index_mediaplayerOnly=require('./index_mediaplayerOnly');var _srcStreamingMetricsMetricsReporting=require('./src/streaming/metrics/MetricsReporting');var _srcStreamingMetricsMetricsReporting2=_interopRequireDefault(_srcStreamingMetricsMetricsReporting);var _srcStreamingProtectionProtection=require('./src/streaming/protection/Protection');var _srcStreamingProtectionProtection2=_interopRequireDefault(_srcStreamingProtectionProtection);var _srcStreamingMediaPlayerFactory=require('./src/streaming/MediaPlayerFactory');var _srcStreamingMediaPlayerFactory2=_interopRequireDefault(_srcStreamingMediaPlayerFactory);dashjs.Protection = _srcStreamingProtectionProtection2['default'];dashjs.MetricsReporting = _srcStreamingMetricsMetricsReporting2['default'];dashjs.MediaPlayerFactory = _srcStreamingMediaPlayerFactory2['default'];exports['default'] = dashjs;exports.MediaPlayer = _index_mediaplayerOnly.MediaPlayer;exports.Protection = _srcStreamingProtectionProtection2['default'];exports.MetricsReporting = _srcStreamingMetricsMetricsReporting2['default'];exports.MediaPlayerFactory = _srcStreamingMediaPlayerFactory2['default'];
//# sourceMappingURL=index.js.map
