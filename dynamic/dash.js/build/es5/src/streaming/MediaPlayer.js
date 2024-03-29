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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _constantsConstants=require('./constants/Constants');var _constantsConstants2=_interopRequireDefault(_constantsConstants);var _constantsMetricsConstants=require('./constants/MetricsConstants');var _constantsMetricsConstants2=_interopRequireDefault(_constantsMetricsConstants);var _dashVoUTCTiming=require('../dash/vo/UTCTiming');var _dashVoUTCTiming2=_interopRequireDefault(_dashVoUTCTiming);var _controllersPlaybackController=require('./controllers/PlaybackController');var _controllersPlaybackController2=_interopRequireDefault(_controllersPlaybackController);var _controllersStreamController=require('./controllers/StreamController');var _controllersStreamController2=_interopRequireDefault(_controllersStreamController);var _controllersMediaController=require('./controllers/MediaController');var _controllersMediaController2=_interopRequireDefault(_controllersMediaController);var _ManifestLoader=require('./ManifestLoader');var _ManifestLoader2=_interopRequireDefault(_ManifestLoader);var _utilsErrorHandler=require('./utils/ErrorHandler');var _utilsErrorHandler2=_interopRequireDefault(_utilsErrorHandler);var _utilsCapabilities=require('./utils/Capabilities');var _utilsCapabilities2=_interopRequireDefault(_utilsCapabilities);var _textTextTracks=require('./text/TextTracks');var _textTextTracks2=_interopRequireDefault(_textTextTracks);var _utilsRequestModifier=require('./utils/RequestModifier');var _utilsRequestModifier2=_interopRequireDefault(_utilsRequestModifier);var _textTextController=require('./text/TextController');var _textTextController2=_interopRequireDefault(_textTextController);var _modelsURIQueryAndFragmentModel=require('./models/URIQueryAndFragmentModel');var _modelsURIQueryAndFragmentModel2=_interopRequireDefault(_modelsURIQueryAndFragmentModel);var _modelsManifestModel=require('./models/ManifestModel');var _modelsManifestModel2=_interopRequireDefault(_modelsManifestModel);var _modelsMediaPlayerModel=require('./models/MediaPlayerModel');var _modelsMediaPlayerModel2=_interopRequireDefault(_modelsMediaPlayerModel);var _modelsMetricsModel=require('./models/MetricsModel');var _modelsMetricsModel2=_interopRequireDefault(_modelsMetricsModel);var _controllersAbrController=require('./controllers/AbrController');var _controllersAbrController2=_interopRequireDefault(_controllersAbrController);var _modelsVideoModel=require('./models/VideoModel');var _modelsVideoModel2=_interopRequireDefault(_modelsVideoModel);var _utilsDOMStorage=require('./utils/DOMStorage');var _utilsDOMStorage2=_interopRequireDefault(_utilsDOMStorage);var _coreDebug=require('./../core/Debug');var _coreDebug2=_interopRequireDefault(_coreDebug);var _coreEventBus=require('./../core/EventBus');var _coreEventBus2=_interopRequireDefault(_coreEventBus);var _coreEventsEvents=require('./../core/events/Events');var _coreEventsEvents2=_interopRequireDefault(_coreEventsEvents);var _MediaPlayerEvents=require('./MediaPlayerEvents');var _MediaPlayerEvents2=_interopRequireDefault(_MediaPlayerEvents);var _coreFactoryMaker=require('../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _coreVersion=require('./../core/Version'); //Dash
var _dashDashAdapter=require('../dash/DashAdapter');var _dashDashAdapter2=_interopRequireDefault(_dashDashAdapter);var _dashModelsDashManifestModel=require('../dash/models/DashManifestModel');var _dashModelsDashManifestModel2=_interopRequireDefault(_dashModelsDashManifestModel);var _dashDashMetrics=require('../dash/DashMetrics');var _dashDashMetrics2=_interopRequireDefault(_dashDashMetrics);var _dashUtilsTimelineConverter=require('../dash/utils/TimelineConverter');var _dashUtilsTimelineConverter2=_interopRequireDefault(_dashUtilsTimelineConverter);var _voMetricsHTTPRequest=require('./vo/metrics/HTTPRequest');var _externalsBase64=require('../../externals/base64');var _externalsBase642=_interopRequireDefault(_externalsBase64);var _codemIsoboxer=require('codem-isoboxer');var _codemIsoboxer2=_interopRequireDefault(_codemIsoboxer); /**
 * @module MediaPlayer
 * @description The MediaPlayer is the primary dash.js Module and a Facade to build your player around.
 * It will allow you access to all the important dash.js properties/methods via the public API and all the
 * events to build a robust DASH media player.
 */function MediaPlayer(){var STREAMING_NOT_INITIALIZED_ERROR='You must first call initialize() and set a source before calling this method';var PLAYBACK_NOT_INITIALIZED_ERROR='You must first call initialize() and set a valid source and view before calling this method';var ELEMENT_NOT_ATTACHED_ERROR='You must first call attachView() to set the video element before calling this method';var SOURCE_NOT_ATTACHED_ERROR='You must first call attachSource() with a valid source before calling this method';var MEDIA_PLAYER_NOT_INITIALIZED_ERROR='MediaPlayer not initialized!';var MEDIA_PLAYER_BAD_ARGUMENT_ERROR='MediaPlayer Invalid Arguments!';var context=this.context;var eventBus=(0,_coreEventBus2['default'])(context).getInstance();var debug=(0,_coreDebug2['default'])(context).getInstance();var log=debug.log;var instance=undefined,source=undefined,protectionData=undefined,mediaPlayerInitialized=undefined,streamingInitialized=undefined,playbackInitialized=undefined,autoPlay=undefined,abrController=undefined,timelineConverter=undefined,mediaController=undefined,protectionController=undefined,metricsReportingController=undefined,mssHandler=undefined,adapter=undefined,metricsModel=undefined,mediaPlayerModel=undefined,errHandler=undefined,capabilities=undefined,streamController=undefined,playbackController=undefined,dashMetrics=undefined,dashManifestModel=undefined,manifestModel=undefined,videoModel=undefined,textController=undefined,domStorage=undefined; /*
    ---------------------------------------------------------------------------

        INIT FUNCTIONS

    ---------------------------------------------------------------------------
    */function setup(){mediaPlayerInitialized = false;playbackInitialized = false;streamingInitialized = false;autoPlay = true;protectionController = null;protectionData = null;adapter = null;_coreEventsEvents2['default'].extend(_MediaPlayerEvents2['default']);mediaPlayerModel = (0,_modelsMediaPlayerModel2['default'])(context).getInstance();videoModel = (0,_modelsVideoModel2['default'])(context).getInstance();} /**
     * Configure media player with customs controllers. Helpful for tests
     *
     * @param {object=} config controllers configuration
     * @memberof module:MediaPlayer
     * @instance
     */function setConfig(config){if(!config){return;}if(config.capabilities){capabilities = config.capabilities;}if(config.streamController){streamController = config.streamController;}if(config.playbackController){playbackController = config.playbackController;}if(config.mediaPlayerModel){mediaPlayerModel = config.mediaPlayerModel;}if(config.abrController){abrController = config.abrController;}if(config.mediaController){mediaController = config.mediaController;}} /**
     * Upon creating the MediaPlayer you must call initialize before you call anything else.
     * There is one exception to this rule. It is crucial to call {@link module:MediaPlayer#extend extend()}
     * with all your extensions prior to calling initialize.
     *
     * ALL arguments are optional and there are individual methods to set each argument later on.
     * The args in this method are just for convenience and should only be used for a simple player setup.
     *
     * @param {HTML5MediaElement=} view - Optional arg to set the video element. {@link module:MediaPlayer#attachView attachView()}
     * @param {string=} source - Optional arg to set the media source. {@link module:MediaPlayer#attachSource attachSource()}
     * @param {boolean=} AutoPlay - Optional arg to set auto play. {@link module:MediaPlayer#setAutoPlay setAutoPlay()}
     * @see {@link module:MediaPlayer#attachView attachView()}
     * @see {@link module:MediaPlayer#attachSource attachSource()}
     * @see {@link module:MediaPlayer#setAutoPlay setAutoPlay()}
     * @memberof module:MediaPlayer
     * @instance
     */function initialize(view,source,AutoPlay){if(!capabilities){capabilities = (0,_utilsCapabilities2['default'])(context).getInstance();}errHandler = (0,_utilsErrorHandler2['default'])(context).getInstance();if(!capabilities.supportsMediaSource()){errHandler.capabilityError('mediasource');return;}if(mediaPlayerInitialized)return;mediaPlayerInitialized = true; // init some controllers and models
timelineConverter = (0,_dashUtilsTimelineConverter2['default'])(context).getInstance();if(!abrController){abrController = (0,_controllersAbrController2['default'])(context).getInstance();}if(!playbackController){playbackController = (0,_controllersPlaybackController2['default'])(context).getInstance();}if(!mediaController){mediaController = (0,_controllersMediaController2['default'])(context).getInstance();}adapter = (0,_dashDashAdapter2['default'])(context).getInstance();dashManifestModel = (0,_dashModelsDashManifestModel2['default'])(context).getInstance({mediaController:mediaController,timelineConverter:timelineConverter,adapter:adapter});manifestModel = (0,_modelsManifestModel2['default'])(context).getInstance();dashMetrics = (0,_dashDashMetrics2['default'])(context).getInstance({manifestModel:manifestModel,dashManifestModel:dashManifestModel});metricsModel = (0,_modelsMetricsModel2['default'])(context).getInstance();textController = (0,_textTextController2['default'])(context).getInstance();domStorage = (0,_utilsDOMStorage2['default'])(context).getInstance({mediaPlayerModel:mediaPlayerModel});adapter.setConfig({dashManifestModel:dashManifestModel});metricsModel.setConfig({adapter:adapter});restoreDefaultUTCTimingSources();setAutoPlay(AutoPlay !== undefined?AutoPlay:true);if(view){attachView(view);}if(source){attachSource(source);}log('[dash.js ' + getVersion() + '] ' + 'MediaPlayer has been initialized');} /**
     * Sets the MPD source and the video element to null. You can also reset the MediaPlayer by
     * calling attachSource with a new source file.
     *
     * Calling this method is all that is necessary to destroy a MediaPlayer instance.
     *
     * @memberof module:MediaPlayer
     * @instance
     */function reset(){attachSource(null);attachView(null);protectionData = null;if(protectionController){protectionController.reset();protectionController = null;}if(metricsReportingController){metricsReportingController.reset();metricsReportingController = null;}} /**
     * The ready state of the MediaPlayer based on both the video element and MPD source being defined.
     *
     * @returns {boolean} The current ready state of the MediaPlayer
     * @see {@link module:MediaPlayer#attachView attachView()}
     * @see {@link module:MediaPlayer#attachSource attachSource()}
     * @memberof module:MediaPlayer
     * @instance
     */function isReady(){return !!source && !!videoModel.getElement();} /**
     * Use the on method to listen for public events found in MediaPlayer.events. {@link MediaPlayerEvents}
     *
     * @param {string} type - {@link MediaPlayerEvents}
     * @param {Function} listener - callback method when the event fires.
     * @param {Object} scope - context of the listener so it can be removed properly.
     * @memberof module:MediaPlayer
     * @instance
     */function on(type,listener,scope){eventBus.on(type,listener,scope);} /**
     * Use the off method to remove listeners for public events found in MediaPlayer.events. {@link MediaPlayerEvents}
     *
     * @param {string} type - {@link MediaPlayerEvents}
     * @param {Function} listener - callback method when the event fires.
     * @param {Object} scope - context of the listener so it can be removed properly.
     * @memberof module:MediaPlayer
     * @instance
     */function off(type,listener,scope){eventBus.off(type,listener,scope);} /**
     * Current version of Dash.js
     * @returns {string} the current dash.js version string.
     * @memberof module:MediaPlayer
     * @instance
     */function getVersion(){return (0,_coreVersion.getVersionString)();} /**
     * Use this method to access the dash.js logging class.
     *
     * @returns {Debug}
     * @memberof module:MediaPlayer
     * @instance
     */function getDebug(){return debug;} /*
    ---------------------------------------------------------------------------

        PLAYBACK FUNCTIONS

    ---------------------------------------------------------------------------
    */ /**
     * Causes the player to begin streaming the media as set by the {@link module:MediaPlayer#attachSource attachSource()}
     * method in preparation for playing. It specifically does not require a view to be attached with {@link module:MediaPlayer#attachSource attachView()} to begin preloading.
     * When a view is attached after preloading, the buffered data is transferred to the attached mediaSource buffers.
     *
     * @see {@link module:MediaPlayer#attachSource attachSource()}
     * @see {@link module:MediaPlayer#attachView attachView()}
     * @memberof module:MediaPlayer
     * @instance
     */function preload(){if(videoModel.getElement() || streamingInitialized){return false;}if(source){initializePlayback();}else {throw SOURCE_NOT_ATTACHED_ERROR;}} /**
     * The play method initiates playback of the media defined by the {@link module:MediaPlayer#attachSource attachSource()} method.
     * This method will call play on the native Video Element.
     *
     * @see {@link module:MediaPlayer#attachSource attachSource()}
     * @memberof module:MediaPlayer
     * @instance
     */function play(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}if(!autoPlay || isPaused() && playbackInitialized){playbackController.play();}} /**
     * This method will call pause on the native Video Element.
     *
     * @memberof module:MediaPlayer
     * @instance
     */function pause(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}playbackController.pause();} /**
     * Returns a Boolean that indicates whether the Video Element is paused.
     * @return {boolean}
     * @memberof module:MediaPlayer
     * @instance
     */function isPaused(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}return playbackController.isPaused();} /**
     * Sets the currentTime property of the attached video element.  If it is a live stream with a
     * timeShiftBufferLength, then the DVR window offset will be automatically calculated.
     *
     * @param {number} value - A relative time, in seconds, based on the return value of the {@link module:MediaPlayer#duration duration()} method is expected
     * @see {@link module:MediaPlayer#getDVRSeekOffset getDVRSeekOffset()}
     * @memberof module:MediaPlayer
     * @instance
     */function seek(value){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}if(typeof value !== 'number' || isNaN(value)){throw MEDIA_PLAYER_BAD_ARGUMENT_ERROR;}var s=playbackController.getIsDynamic()?getDVRSeekOffset(value):value;playbackController.seek(s);} /**
     * Returns a Boolean that indicates whether the media is in the process of seeking to a new position.
     * @return {boolean}
     * @memberof module:MediaPlayer
     * @instance
     */function isSeeking(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}return playbackController.isSeeking();} /**
     * Returns a Boolean that indicates whether the media is in the process of dynamic.
     * @return {boolean}
     * @memberof module:MediaPlayer
     * @instance
     */function isDynamic(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}return playbackController.getIsDynamic();} /**
     * Use this method to set the native Video Element's playback rate.
     * @param {number} value
     * @memberof module:MediaPlayer
     * @instance
     */function setPlaybackRate(value){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}getVideoElement().playbackRate = value;} /**
     * Returns the current playback rate.
     * @returns {number}
     * @memberof module:MediaPlayer
     * @instance
     */function getPlaybackRate(){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}return getVideoElement().playbackRate;} /**
     * Use this method to set the native Video Element's muted state. Takes a Boolean that determines whether audio is muted. true if the audio is muted and false otherwise.
     * @param {boolean} value
     * @memberof module:MediaPlayer
     * @instance
     */function setMute(value){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}getVideoElement().muted = value;} /**
     * A Boolean that determines whether audio is muted.
     * @returns {boolean}
     * @memberof module:MediaPlayer
     * @instance
     */function isMuted(){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}return getVideoElement().muted;} /**
     * A double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
     * @param {number} value
     * @memberof module:MediaPlayer
     * @instance
     */function setVolume(value){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}getVideoElement().volume = value;} /**
     * Returns the current audio volume, from 0.0 (silent) to 1.0 (loudest).
     * @returns {number}
     * @memberof module:MediaPlayer
     * @instance
     */function getVolume(){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}return getVideoElement().volume;} /**
     * The length of the buffer for a given media type, in seconds. Valid media
     * types are "video", "audio" and "fragmentedText". If no type is passed
     * in, then the minimum of video, audio and fragmentedText buffer length is
     * returned. NaN is returned if an invalid type is requested, the
     * presentation does not contain that type, or if no arguments are passed
     * and the presentation does not include any adaption sets of valid media
     * type.
     *
     * @param {string} type - the media type of the buffer
     * @returns {number} The length of the buffer for the given media type, in
     *  seconds, or NaN
     * @memberof module:MediaPlayer
     * @instance
     */function getBufferLength(type){var types=[_constantsConstants2['default'].VIDEO,_constantsConstants2['default'].AUDIO,_constantsConstants2['default'].FRAGMENTED_TEXT];if(!type){var buffer=types.map(function(t){return getTracksFor(t).length > 0?getDashMetrics().getCurrentBufferLevel(getMetricsFor(t)):Number.MAX_VALUE;}).reduce(function(p,c){return Math.min(p,c);});return buffer === Number.MAX_VALUE?NaN:buffer;}else {if(types.indexOf(type) !== -1){var buffer=getDashMetrics().getCurrentBufferLevel(getMetricsFor(type));return buffer?buffer:NaN;}else {log('Warning  - getBufferLength requested for invalid type');return NaN;}}} /**
     * The timeShiftBufferLength (DVR Window), in seconds.
     *
     * @returns {number} The window of allowable play time behind the live point of a live stream.
     * @memberof module:MediaPlayer
     * @instance
     */function getDVRWindowSize(){var metric=getDVRInfoMetric();if(!metric){return 0;}return metric.manifestInfo.DVRWindowSize;} /**
     * This method should only be used with a live stream that has a valid timeShiftBufferLength (DVR Window).
     * NOTE - If you do not need the raw offset value (i.e. media analytics, tracking, etc) consider using the {@link module:MediaPlayer#seek seek()} method
     * which will calculate this value for you and set the video element's currentTime property all in one simple call.
     *
     * @param {number} value - A relative time, in seconds, based on the return value of the {@link module:MediaPlayer#duration duration()} method is expected.
     * @returns {number} A value that is relative the available range within the timeShiftBufferLength (DVR Window).
     * @see {@link module:MediaPlayer#seek seek()}
     * @memberof module:MediaPlayer
     * @instance
     */function getDVRSeekOffset(value){var metric=getDVRInfoMetric();var liveDelay=playbackController.getLiveDelay();if(!metric){return 0;}var val=metric.range.start + value;if(val > metric.range.end - liveDelay){val = metric.range.end - liveDelay;}return val;} /**
     * Current time of the playhead, in seconds.
     *
     * If called with no arguments then the returned time value is time elapsed since the start point of the first stream, or if it is a live stream, then the time will be based on the return value of the {@link module:MediaPlayer#duration duration()} method.
     * However if a stream ID is supplied then time is relative to the start of that stream, or is null if there is no such stream id in the manifest.
     *
     * @param {string} streamId - The ID of a stream that the returned playhead time must be relative to the start of. If undefined, then playhead time is relative to the first stream.
     * @returns {number} The current playhead time of the media, or null.
     * @memberof module:MediaPlayer
     * @instance
     */function time(streamId){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}var t=getVideoElement().currentTime;if(streamId !== undefined){t = streamController.getTimeRelativeToStreamId(t,streamId);}else if(playbackController.getIsDynamic()){var metric=getDVRInfoMetric();t = metric === null?0:duration() - (metric.range.end - metric.time);}return t;} /**
     * Duration of the media's playback, in seconds.
     *
     * @returns {number} The current duration of the media.
     * @memberof module:MediaPlayer
     * @instance
     */function duration(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}var d=getVideoElement().duration;if(playbackController.getIsDynamic()){var metric=getDVRInfoMetric();var range=undefined;if(!metric){return 0;}range = metric.range.end - metric.range.start;d = range < metric.manifestInfo.DVRWindowSize?range:metric.manifestInfo.DVRWindowSize;}return d;} /**
     * Use this method to get the current playhead time as an absolute value, the time in seconds since midnight UTC, Jan 1 1970.
     * Note - this property only has meaning for live streams. If called before play() has begun, it will return a value of NaN.
     *
     * @returns {number} The current playhead time as UTC timestamp.
     * @memberof module:MediaPlayer
     * @instance
     */function timeAsUTC(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}if(time() < 0){return NaN;}return getAsUTC(time());} /**
     * Use this method to get the current duration as an absolute value, the time in seconds since midnight UTC, Jan 1 1970.
     * Note - this property only has meaning for live streams.
     *
     * @returns {number} The current duration as UTC timestamp.
     * @memberof module:MediaPlayer
     * @instance
     */function durationAsUTC(){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}return getAsUTC(duration());} /*
    ---------------------------------------------------------------------------

        AUTO BITRATE

    ---------------------------------------------------------------------------
    */ /**
     * When switching multi-bitrate content (auto or manual mode) this property specifies the maximum bitrate allowed.
     * If you set this property to a value lower than that currently playing, the switching engine will switch down to
     * satisfy this requirement. If you set it to a value that is lower than the lowest bitrate, it will still play
     * that lowest bitrate.
     *
     * You can set or remove this bitrate cap at anytime before or during playback.  To clear this setting you must use the API
     * and set the value param to NaN.
     *
     * This feature is typically used to reserve higher bitrates for playback only when the player is in large or full-screen format.
     *
     * @param {string} type - 'video' or 'audio' are the type options.
     * @param {number} value - Value in kbps representing the maximum bitrate allowed.
     * @memberof module:MediaPlayer
     * @instance
     */function setMaxAllowedBitrateFor(type,value){abrController.setMaxAllowedBitrateFor(type,value);} /**
     * When switching multi-bitrate content (auto or manual mode) this property specifies the minimum bitrate allowed.
     * If you set this property to a value higher than that currently playing, the switching engine will switch up to
     * satisfy this requirement. If you set it to a value that is lower than the lowest bitrate, it will still play
     * that lowest bitrate.
     *
     * You can set or remove this bitrate limit at anytime before or during playback. To clear this setting you must use the API
     * and set the value param to NaN.
     *
     * This feature is used to force higher quality playback.
     *
     * @param {string} type - 'video' or 'audio' are the type options.
     * @param {number} value - Value in kbps representing the minimum bitrate allowed.
     * @memberof module:MediaPlayer
     * @instance
     */function setMinAllowedBitrateFor(type,value){abrController.setMinAllowedBitrateFor(type,value);} /**
     * @param {string} type - 'video' or 'audio' are the type options.
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setMaxAllowedBitrateFor setMaxAllowedBitrateFor()}
     * @instance
     */function getMaxAllowedBitrateFor(type){return abrController.getMaxAllowedBitrateFor(type);} /**
     * @param {string} type - 'video' or 'audio' are the type options.
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setMinAllowedBitrateFor setMinAllowedBitrateFor()}
     * @instance
     */function getMinAllowedBitrateFor(type){return abrController.getMinAllowedBitrateFor(type);} /**
     * When switching multi-bitrate content (auto or manual mode) this property specifies the maximum representation allowed,
     * as a proportion of the size of the representation set.
     *
     * You can set or remove this cap at anytime before or during playback. To clear this setting you must use the API
     * and set the value param to NaN.
     *
     * If both this and maxAllowedBitrate are defined, maxAllowedBitrate is evaluated first, then maxAllowedRepresentation,
     * i.e. the lowest value from executing these rules is used.
     *
     * This feature is typically used to reserve higher representations for playback only when connected over a fast connection.
     *
     * @param {string} type - 'video' or 'audio' are the type options.
     * @param {number} value - number between 0 and 1, where 1 is allow all representations, and 0 is allow only the lowest.
     * @memberof module:MediaPlayer
     * @instance
     */function setMaxAllowedRepresentationRatioFor(type,value){abrController.setMaxAllowedRepresentationRatioFor(type,value);} /**
     * @param {string} type - 'video' or 'audio' are the type options.
     * @returns {number} The current representation ratio cap.
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setMaxAllowedRepresentationRatioFor setMaxAllowedRepresentationRatioFor()}
     * @instance
     */function getMaxAllowedRepresentationRatioFor(type){return abrController.getMaxAllowedRepresentationRatioFor(type);} /**
     * Gets the current download quality for media type video, audio or images. For video and audio types the ABR
     * rules update this value before every new download unless setAutoSwitchQualityFor(type, false) is called. For 'image'
     * type, thumbnails, there is no ABR algorithm and quality is set manually.
     *
     * @param {string} type - 'video', 'audio' or 'image' (thumbnails)
     * @returns {number} the quality index, 0 corresponding to the lowest bitrate
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setAutoSwitchQualityFor setAutoSwitchQualityFor()}
     * @see {@link module:MediaPlayer#setQualityFor setQualityFor()}
     * @instance
     */function getQualityFor(type){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}if(type === _constantsConstants2['default'].IMAGE){var activeStream=getActiveStream();if(!activeStream){return -1;}var thumbnailController=activeStream.getThumbnailController();if(!thumbnailController){return -1;}return thumbnailController.getCurrentTrackIndex();}return abrController.getQualityFor(type,streamController.getActiveStreamInfo());} /**
     * Sets the current quality for media type instead of letting the ABR Heuristics automatically selecting it.
     * This value will be overwritten by the ABR rules unless setAutoSwitchQualityFor(type, false) is called.
     *
     * @param {string} type - 'video', 'audio' or 'image'
     * @param {number} value - the quality index, 0 corresponding to the lowest bitrate
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setAutoSwitchQualityFor setAutoSwitchQualityFor()}
     * @see {@link module:MediaPlayer#getQualityFor getQualityFor()}
     * @instance
     */function setQualityFor(type,value){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}if(type === _constantsConstants2['default'].IMAGE){var activeStream=getActiveStream();if(!activeStream){return;}var thumbnailController=activeStream.getThumbnailController();if(thumbnailController){thumbnailController.setTrackByIndex(value);}}abrController.setPlaybackQuality(type,streamController.getActiveStreamInfo(),value);} /**
     * Update the video element size variables
     * Should be called on window resize (or any other time player is resized). Fullscreen does trigger a window resize event.
     *
     * Once windowResizeEventCalled = true, abrController.checkPortalSize() will use element size variables rather than querying clientWidth every time.
     *
     * @memberof module:MediaPlayer
     * @instance
     */function updatePortalSize(){abrController.setElementSize();abrController.setWindowResizeEventCalled(true);} /**
     * @memberof module:MediaPlayer
     * @instance
     */function getLimitBitrateByPortal(){return abrController.getLimitBitrateByPortal();} /**
     * Sets whether to limit the representation used based on the size of the playback area
     *
     * @param {boolean} value
     * @memberof module:MediaPlayer
     * @instance
     */function setLimitBitrateByPortal(value){abrController.setLimitBitrateByPortal(value);} /**
     * @memberof module:MediaPlayer
     * @instance
     */function getUsePixelRatioInLimitBitrateByPortal(){return abrController.getUsePixelRatioInLimitBitrateByPortal();} /**
     * Sets whether to take into account the device's pixel ratio when defining the portal dimensions.
     * Useful on, for example, retina displays.
     *
     * @param {boolean} value
     * @memberof module:MediaPlayer
     * @instance
     * @default {boolean} false
     */function setUsePixelRatioInLimitBitrateByPortal(value){abrController.setUsePixelRatioInLimitBitrateByPortal(value);} /**
     * Use this method to explicitly set the starting bitrate for audio | video
     *
     * @param {string} type
     * @param {number} value - A value of the initial bitrate, kbps
     * @memberof module:MediaPlayer
     * @instance
     */function setInitialBitrateFor(type,value){abrController.setInitialBitrateFor(type,value);} /**
     * @param {string} type
     * @returns {number} A value of the initial bitrate, kbps
     * @memberof module:MediaPlayer
     * @instance
     */function getInitialBitrateFor(type){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR; //abrController.getInitialBitrateFor is overloaded with ratioDict logic that needs manifest force it to not be callable pre play.
}return abrController.getInitialBitrateFor(type);} /**
     * @param {string} type
     * @param {number} value - A value of the initial Representation Ratio
     * @memberof module:MediaPlayer
     * @instance
     */function setInitialRepresentationRatioFor(type,value){abrController.setInitialRepresentationRatioFor(type,value);} /**
     * @param {string} type
     * @returns {number} A value of the initial Representation Ratio
     * @memberof module:MediaPlayer
     * @instance
     */function getInitialRepresentationRatioFor(type){return abrController.getInitialRepresentationRatioFor(type);} /**
     * @param {string} type - 'audio' | 'video'
     * @returns {boolean} Current state of adaptive bitrate switching
     * @memberof module:MediaPlayer
     * @instance
     */function getAutoSwitchQualityFor(type){return abrController.getAutoSwitchBitrateFor(type);} /**
     * Set to false to switch off adaptive bitrate switching.
     *
     * @param {string} type - 'audio' | 'video'
     * @param {boolean} value
     * @default true
     * @memberof module:MediaPlayer
     * @instance
     */function setAutoSwitchQualityFor(type,value){abrController.setAutoSwitchBitrateFor(type,value);} /**
     * Get the value of useDeadTimeLatency in AbrController. @see setUseDeadTimeLatencyForAbr
     *
     * @returns {boolean}
     *
     * @memberof module:MediaPlayer
     * @instance
     */function getUseDeadTimeLatencyForAbr(){return abrController.getUseDeadTimeLatency();} /**
     * Set the value of useDeadTimeLatency in AbrController. If true, only the download
     * portion will be considered part of the download bitrate and latency will be
     * regarded as static. If false, the reciprocal of the whole transfer time will be used.
     * Defaults to true.
     *
     * @param {boolean=} useDeadTimeLatency - True or false flag.
     *
     * @memberof module:MediaPlayer
     * @instance
     */function setUseDeadTimeLatencyForAbr(useDeadTimeLatency){abrController.setUseDeadTimeLatency(useDeadTimeLatency);} /*
    ---------------------------------------------------------------------------

        MEDIA PLAYER CONFIGURATION

    ---------------------------------------------------------------------------
    */ /**
     * <p>Set to false to prevent stream from auto-playing when the view is attached.</p>
     *
     * @param {boolean} value
     * @default true
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#attachView attachView()}
     * @instance
     *
     */function setAutoPlay(value){autoPlay = value;} /**
     * @returns {boolean} The current autoPlay state.
     * @memberof module:MediaPlayer
     * @instance
     */function getAutoPlay(){return autoPlay;} /**
     * <p>Changing this value will lower or increase live stream latency.  The detected segment duration will be multiplied by this value
     * to define a time in seconds to delay a live stream from the live edge.</p>
     * <p>Lowering this value will lower latency but may decrease the player's ability to build a stable buffer.</p>
     *
     * @param {number} value - Represents how many segment durations to delay the live stream.
     * @default 4
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#useSuggestedPresentationDelay useSuggestedPresentationDelay()}
     * @instance
     */function setLiveDelayFragmentCount(value){mediaPlayerModel.setLiveDelayFragmentCount(value);} /**
     * <p>Equivalent in seconds of setLiveDelayFragmentCount</p>
     * <p>Lowering this value will lower latency but may decrease the player's ability to build a stable buffer.</p>
     * <p>This value should be less than the manifest duration by a couple of segment durations to avoid playback issues</p>
     * <p>If set, this parameter will take precedence over setLiveDelayFragmentCount and manifest info</p>
     *
     * @param {number} value - Represents how many seconds to delay the live stream.
     * @default undefined
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#useSuggestedPresentationDelay useSuggestedPresentationDelay()}
     * @instance
     */function setLiveDelay(value){mediaPlayerModel.setLiveDelay(value);} /**
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setLiveDelay setLiveDelay()}
     * @instance
     * @returns {number|undefined} Current live stream delay in seconds when previously set, or `undefined`
     */function getLiveDelay(){return mediaPlayerModel.getLiveDelay();} /**
     * <p>Set to true if you would like to override the default live delay and honor the SuggestedPresentationDelay attribute in by the manifest.</p>
     * @param {boolean} value
     * @default false
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#setLiveDelayFragmentCount setLiveDelayFragmentCount()}
     * @instance
     */function useSuggestedPresentationDelay(value){mediaPlayerModel.setUseSuggestedPresentationDelay(value);} /**
     * Set to false if you would like to disable the last known bit rate from being stored during playback and used
     * to set the initial bit rate for subsequent playback within the expiration window.
     *
     * The default expiration is one hour, defined in milliseconds. If expired, the default initial bit rate (closest to 1000 kbps) will be used
     * for that session and a new bit rate will be stored during that session.
     *
     * @param {boolean} enable - Will toggle if feature is enabled. True to enable, False to disable.
     * @param {number=} ttl - (Optional) A value defined in milliseconds representing how long to cache the bit rate for. Time to live.
     * @default enable = True, ttl = 360000 (1 hour)
     * @memberof module:MediaPlayer
     * @instance
     *
     */function enableLastBitrateCaching(enable,ttl){mediaPlayerModel.setLastBitrateCachingInfo(enable,ttl);} /**
     * Set to false if you would like to disable the last known lang for audio (or camera angle for video) from being stored during playback and used
     * to set the initial settings for subsequent playback within the expiration window.
     *
     * The default expiration is one hour, defined in milliseconds. If expired, the default settings will be used
     * for that session and a new settings will be stored during that session.
     *
     * @param {boolean} enable - Will toggle if feature is enabled. True to enable, False to disable.
     * @param {number=} [ttl] - (Optional) A value defined in milliseconds representing how long to cache the settings for. Time to live.
     * @default enable = True, ttl = 360000 (1 hour)
     * @memberof module:MediaPlayer
     * @instance
     *
     */function enableLastMediaSettingsCaching(enable,ttl){mediaPlayerModel.setLastMediaSettingsCachingInfo(enable,ttl);} /**
     * Set to true if you would like dash.js to keep downloading fragments in the background
     * when the video element is paused.
     *
     * @default true
     * @param {boolean} value
     * @memberof module:MediaPlayer
     * @instance
     */function setScheduleWhilePaused(value){mediaPlayerModel.setScheduleWhilePaused(value);} /**
     * Returns a boolean of the current state of ScheduleWhilePaused.
     * @returns {boolean}
     * @see {@link module:MediaPlayer#setScheduleWhilePaused setScheduleWhilePaused()}
     * @memberof module:MediaPlayer
     * @instance
     */function getScheduleWhilePaused(){return mediaPlayerModel.getScheduleWhilePaused();} /**
     * When enabled, after an ABR up-switch in quality, instead of requesting and appending the next fragment
     * at the end of the current buffer range it is requested and appended closer to the current time
     * When enabled, The maximum time to render a higher quality is current time + (1.5 * fragment duration).
     *
     * Note, When ABR down-switch is detected, we appended the lower quality at the end of the buffer range to preserve the
     * higher quality media for as long as possible.
     *
     * If enabled, it should be noted there are a few cases when the client will not replace inside buffer range but rather
     * just append at the end.  1. When the buffer level is less than one fragment duration 2.  The client
     * is in an Abandonment State due to recent fragment abandonment event.
     *
     * Known issues:
     * 1. In IE11 with auto switching off, if a user switches to a quality they can not download in time the
     * fragment may be appended in the same range as the playhead or even in the past, in IE11 it may cause a stutter
     * or stall in playback.
     *
     *
     * @param {boolean} value
     * @default {boolean} false
     * @memberof module:MediaPlayer
     * @instance
     */function setFastSwitchEnabled(value){ //TODO we need to look at track switches for adaptation sets.  If always replace it works much like this but clears buffer. Maybe too many ways to do same thing.
mediaPlayerModel.setFastSwitchEnabled(value);} /**
     * Enabled by default. Will return the current state of Fast Switch.
     * @return {boolean} Returns true if FastSwitch ABR is enabled.
     * @see {@link module:MediaPlayer#setFastSwitchEnabled setFastSwitchEnabled()}
     * @memberof module:MediaPlayer
     * @instance
     */function getFastSwitchEnabled(){return mediaPlayerModel.getFastSwitchEnabled();} /**
     * Sets the ABR strategy. Valid strategies are "abrDynamic", "abrBola" and "abrThroughput".
     * The ABR strategy can also be changed during a streaming session.
     * The call has no effect if an invalid method is passed.
     *
     * The BOLA strategy chooses bitrate based on current buffer level, with higher bitrates for higher buffer levels.
     * The Throughput strategy chooses bitrate based on the recent throughput history.
     * The Dynamic strategy switches smoothly between BOLA and Throughput in real time, playing to the strengths of both.
     *
     * @param {string} value
     * @default "abrDynamic"
     * @memberof module:MediaPlayer
     * @instance
     */function setABRStrategy(value){if(value === _constantsConstants2['default'].ABR_STRATEGY_DYNAMIC || value === _constantsConstants2['default'].ABR_STRATEGY_BOLA || value === _constantsConstants2['default'].ABR_STRATEGY_THROUGHPUT){mediaPlayerModel.setABRStrategy(value);}else {log('Warning: Ignoring setABRStrategy(' + value + ') - unknown value.');}} /**
     * Returns the current ABR strategy being used.
     * @return {string} "abrDynamic", "abrBola" or "abrThroughput"
     * @see {@link module:MediaPlayer#setABRStrategy setABRStrategy()}
     * @memberof module:MediaPlayer
     * @instance
     */function getABRStrategy(){return mediaPlayerModel.getABRStrategy();} /**
     * Enable/disable builtin dashjs ABR rules
     * @param {boolean} value
     * @default true
     * @memberof module:MediaPlayer
     * @instance
     */function useDefaultABRRules(value){mediaPlayerModel.setUseDefaultABRRules(value);} /**
     * Add a custom ABR Rule
     * Rule will be apply on next stream if a stream is being played
     *
     * @param {string} type - rule type (one of ['qualitySwitchRules','abandonFragmentRules'])
     * @param {string} rulename - name of rule (used to identify custom rule). If one rule of same name has been added, then existing rule will be updated
     * @param {object} rule - the rule object instance
     * @memberof module:MediaPlayer
     * @instance
     */function addABRCustomRule(type,rulename,rule){mediaPlayerModel.addABRCustomRule(type,rulename,rule);} /**
     * Remove a custom ABR Rule
     *
     * @param {string} rulename - name of the rule to be removed
     * @memberof module:MediaPlayer
     * @instance
     */function removeABRCustomRule(rulename){mediaPlayerModel.removeABRCustomRule(rulename);} /**
     * Remove all custom rules
     * @memberof module:MediaPlayer
     * @instance
     */function removeAllABRCustomRule(){mediaPlayerModel.removeAllABRCustomRule();} /**
     * Sets the moving average method used for smoothing throughput estimates. Valid methods are
     * "slidingWindow" and "ewma". The call has no effect if an invalid method is passed.
     *
     * The sliding window moving average method computes the average throughput using the last four segments downloaded.
     * If the stream is live (as opposed to VOD), then only the last three segments are used.
     * If wide variations in throughput are detected, the number of segments can be dynamically increased to avoid oscillations.
     *
     * The exponentially weighted moving average (EWMA) method computes the average using exponential smoothing.
     * Two separate estimates are maintained, a fast one with a three-second half life and a slow one with an eight-second half life.
     * The throughput estimate at any time is the minimum of the fast and slow estimates.
     * This allows a fast reaction to a bandwidth drop and prevents oscillations on bandwidth spikes.
     *
     * @param {string} value
     * @default {string} 'slidingWindow'
     * @memberof module:MediaPlayer
     * @instance
     */function setMovingAverageMethod(value){if(value === _constantsConstants2['default'].MOVING_AVERAGE_SLIDING_WINDOW || value === _constantsConstants2['default'].MOVING_AVERAGE_EWMA){mediaPlayerModel.setMovingAverageMethod(value);}else {log('Warning: Ignoring setMovingAverageMethod(' + value + ') - unknown value.');}} /**
     * Return the current moving average method used for smoothing throughput estimates.
     * @return {string} Returns "slidingWindow" or "ewma".
     * @see {@link module:MediaPlayer#setMovingAverageMethod setMovingAverageMethod()}
     * @memberof module:MediaPlayer
     * @instance
     */function getMovingAverageMethod(){return mediaPlayerModel.getMovingAverageMethod();} /**
     * <p>Allows you to set a scheme and server source for UTC live edge detection for dynamic streams.
     * If UTCTiming is defined in the manifest, it will take precedence over any time source manually added.</p>
     * <p>If you have exposed the Date header, use the method {@link module:MediaPlayer#clearDefaultUTCTimingSources clearDefaultUTCTimingSources()}.
     * This will allow the date header on the manifest to be used instead of a time server</p>
     * @param {string} schemeIdUri - <ul>
     * <li>urn:mpeg:dash:utc:http-head:2014</li>
     * <li>urn:mpeg:dash:utc:http-xsdate:2014</li>
     * <li>urn:mpeg:dash:utc:http-iso:2014</li>
     * <li>urn:mpeg:dash:utc:direct:2014</li>
     * </ul>
     * <p>Some specs referencing early ISO23009-1 drafts incorrectly use
     * 2012 in the URI, rather than 2014. support these for now.</p>
     * <ul>
     * <li>urn:mpeg:dash:utc:http-head:2012</li>
     * <li>urn:mpeg:dash:utc:http-xsdate:2012</li>
     * <li>urn:mpeg:dash:utc:http-iso:2012</li>
     * <li>urn:mpeg:dash:utc:direct:2012</li>
     * </ul>
     * @param {string} value - Path to a time source.
     * @default
     * <ul>
     *     <li>schemeIdUri:urn:mpeg:dash:utc:http-xsdate:2014</li>
     *     <li>value:http://time.akamai.com</li>
     * </ul>
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#removeUTCTimingSource removeUTCTimingSource()}
     * @instance
     */function addUTCTimingSource(schemeIdUri,value){removeUTCTimingSource(schemeIdUri,value); //check if it already exists and remove if so.
var vo=new _dashVoUTCTiming2['default']();vo.schemeIdUri = schemeIdUri;vo.value = value;mediaPlayerModel.getUTCTimingSources().push(vo);} /**
     * <p>Allows you to remove a UTC time source. Both schemeIdUri and value need to match the Dash.vo.UTCTiming properties in order for the
     * entry to be removed from the array</p>
     * @param {string} schemeIdUri - see {@link module:MediaPlayer#addUTCTimingSource addUTCTimingSource()}
     * @param {string} value - see {@link module:MediaPlayer#addUTCTimingSource addUTCTimingSource()}
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#clearDefaultUTCTimingSources clearDefaultUTCTimingSources()}
     * @instance
     */function removeUTCTimingSource(schemeIdUri,value){var UTCTimingSources=mediaPlayerModel.getUTCTimingSources();UTCTimingSources.forEach(function(obj,idx){if(obj.schemeIdUri === schemeIdUri && obj.value === value){UTCTimingSources.splice(idx,1);}});} /**
     * <p>Allows you to clear the stored array of time sources.</p>
     * <p>Example use: If you have exposed the Date header, calling this method
     * will allow the date header on the manifest to be used instead of the time server.</p>
     * <p>Example use: Calling this method, assuming there is not an exposed date header on the manifest,  will default back
     * to using a binary search to discover the live edge</p>
     *
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#restoreDefaultUTCTimingSources restoreDefaultUTCTimingSources()}
     * @instance
     */function clearDefaultUTCTimingSources(){mediaPlayerModel.setUTCTimingSources([]);} /**
     * <p>Allows you to restore the default time sources after calling {@link module:MediaPlayer#clearDefaultUTCTimingSources clearDefaultUTCTimingSources()}</p>
     *
     * @default
     * <ul>
     *     <li>schemeIdUri:urn:mpeg:dash:utc:http-xsdate:2014</li>
     *     <li>value:http://time.akamai.com</li>
     * </ul>
     *
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#addUTCTimingSource addUTCTimingSource()}
     * @instance
     */function restoreDefaultUTCTimingSources(){addUTCTimingSource(_modelsMediaPlayerModel2['default'].DEFAULT_UTC_TIMING_SOURCE.scheme,_modelsMediaPlayerModel2['default'].DEFAULT_UTC_TIMING_SOURCE.value);} /**
     * <p>Allows you to enable the use of the Date Header, if exposed with CORS, as a timing source for live edge detection. The
     * use of the date header will happen only after the other timing source that take precedence fail or are omitted as described.
     * {@link module:MediaPlayer#clearDefaultUTCTimingSources clearDefaultUTCTimingSources()} </p>
     *
     * @param {boolean} value - true to enable
     * @default {boolean} True
     * @memberof module:MediaPlayer
     * @see {@link module:MediaPlayer#addUTCTimingSource addUTCTimingSource()}
     * @instance
     */function enableManifestDateHeaderTimeSource(value){mediaPlayerModel.setUseManifestDateHeaderTimeSource(value);} /**
     * This value influences the buffer pruning logic.
     * Allows you to modify the buffer that is kept in source buffer in seconds.
     * <pre>0|-----------bufferToPrune-----------|-----bufferToKeep-----|currentTime|</pre>
     *
     * @default 20 seconds
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setBufferToKeep(value){mediaPlayerModel.setBufferToKeep(value);} /**
     * This value influences the buffer pruning logic.
     * Allows you to modify the buffer ahead of current time position that is kept in source buffer in seconds.
     * <pre>0|--------|currentTime|-----bufferAheadToKeep----|----bufferToPrune-----------|end|</pre>
     *
     * @default 80 seconds
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setBufferAheadToKeep(value){mediaPlayerModel.setBufferAheadToKeep(value);} /**
     * This value influences the buffer pruning logic.
     * Allows you to modify the interval of pruning buffer in seconds.
     *
     * @default 10 seconds
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setBufferPruningInterval(value){mediaPlayerModel.setBufferPruningInterval(value);} /**
     * The time that the internal buffer target will be set to post startup/seeks (NOT top quality).
     *
     * When the time is set higher than the default you will have to wait longer
     * to see automatic bitrate switches but will have a larger buffer which
     * will increase stability.
     *
     * @default 12 seconds.
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setStableBufferTime(value){mediaPlayerModel.setStableBufferTime(value);} /**
     * The time that the internal buffer target will be set to post startup/seeks (NOT top quality).
     *
     * When the time is set higher than the default you will have to wait longer
     * to see automatic bitrate switches but will have a larger buffer which
     * will increase stability.
     *
     * @default 12 seconds.
     * @memberof module:MediaPlayer
     * @instance
     */function getStableBufferTime(){return mediaPlayerModel.getStableBufferTime();} /**
     * The time that the internal buffer target will be set to once playing the top quality.
     * If there are multiple bitrates in your adaptation, and the media is playing at the highest
     * bitrate, then we try to build a larger buffer at the top quality to increase stability
     * and to maintain media quality.
     *
     * @default 30 seconds.
     * @param {int} value
    /**
     * The time that the internal buffer target will be set to once playing the top quality.
     * If there are multiple bitrates in your adaptation, and the media is playing at the highest
     * bitrate, then we try to build a larger buffer at the top quality to increase stability
     * and to maintain media quality.
     *
     * @default 30 seconds.
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setBufferTimeAtTopQuality(value){mediaPlayerModel.setBufferTimeAtTopQuality(value);} /**
     * The time that the internal buffer target will be set to once playing the top quality.
     * If there are multiple bitrates in your adaptation, and the media is playing at the highest
     * bitrate, then we try to build a larger buffer at the top quality to increase stability
     * and to maintain media quality.
     *
     * @default 30 seconds.
     * @memberof module:MediaPlayer
     * @instance
     */function getBufferTimeAtTopQuality(){return mediaPlayerModel.getBufferTimeAtTopQuality();} /**
     * The time that the internal buffer target will be set to once playing the top quality for long form content.
     *
     * @default 60 seconds.
     * @see {@link module:MediaPlayer#setLongFormContentDurationThreshold setLongFormContentDurationThreshold()}
     * @see {@link module:MediaPlayer#setBufferTimeAtTopQuality setBufferTimeAtTopQuality()}
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setBufferTimeAtTopQualityLongForm(value){mediaPlayerModel.setBufferTimeAtTopQualityLongForm(value);} /**
     * The time that the internal buffer target will be set to once playing the top quality for long form content.
     *
     * @default 60 seconds.
     * @see {@link module:MediaPlayer#setLongFormContentDurationThreshold setLongFormContentDurationThreshold()}
     * @see {@link module:MediaPlayer#setBufferTimeAtTopQuality setBufferTimeAtTopQuality()}
     * @memberof module:MediaPlayer
     * @instance
     */function getBufferTimeAtTopQualityLongForm(){return mediaPlayerModel.getBufferTimeAtTopQualityLongForm();} /**
     * The threshold which defines if the media is considered long form content.
     * This will directly affect the buffer targets when playing back at the top quality.
     *
     * @see {@link module:MediaPlayer#setBufferTimeAtTopQualityLongForm setBufferTimeAtTopQualityLongForm()}
     * @default 600 seconds (10 minutes).
     * @param {number} value
     * @memberof module:MediaPlayer
     * @instance
     */function setLongFormContentDurationThreshold(value){mediaPlayerModel.setLongFormContentDurationThreshold(value);} /**
     * The overlap tolerance time, at both the head and the tail of segments, considered when doing time to segment conversions.
     *
     * This is used when calculating which of the loaded segments of a representation corresponds with a given time position.
     * Its value is never used for calculating the segment index in seeking operations in which it assumes overlap time threshold is zero.
     *
     * <pre>
     * |-o-|--- segment X ----|-o-|
     *                        |-o-|---- segment X+1 -----|-o-|
     *                                                   |-o-|---- segment X+2 -----|-o-|
     * </pre>
     * @default 0.05 seconds.
     * @param {number} value
     * @memberof module:MediaPlayer
     * @instance
    */function setSegmentOverlapToleranceTime(value){mediaPlayerModel.setSegmentOverlapToleranceTime(value);} /**
     * For a given media type, the threshold which defines if the response to a fragment
     * request is coming from browser cache or not.
     * Valid media types are "video", "audio"
     *
     * @default 50 milliseconds for video fragment requests; 5 milliseconds for audio fragment requests.
     * @param {string} type 'video' or 'audio' are the type options.
     * @param {number} value Threshold value in milliseconds.
     * @memberof module:MediaPlayer
     * @instance
     */function setCacheLoadThresholdForType(type,value){mediaPlayerModel.setCacheLoadThresholdForType(type,value);} /**
     * A percentage between 0.0 and 1 to reduce the measured throughput calculations.
     * The default is 0.9. The lower the value the more conservative and restricted the
     * measured throughput calculations will be. please use carefully. This will directly
     * affect the ABR logic in dash.js
     *
     * @param {number} value
     * @memberof module:MediaPlayer
     * @instance
     */function setBandwidthSafetyFactor(value){mediaPlayerModel.setBandwidthSafetyFactor(value);} /**
     * Returns the number of the current BandwidthSafetyFactor
     *
     * @return {number} value
     * @see {@link module:MediaPlayer#setBandwidthSafetyFactor setBandwidthSafetyFactor()}
     * @memberof module:MediaPlayer
     * @instance
     */function getBandwidthSafetyFactor(){return mediaPlayerModel.getBandwidthSafetyFactor();} /**
     * Returns the average throughput computed in the ABR logic
     *
     * @param {string} type
     * @return {number} value
     * @memberof module:MediaPlayer
     * @instance
     */function getAverageThroughput(type){var throughputHistory=abrController.getThroughputHistory();return throughputHistory?throughputHistory.getAverageThroughput(type):0;} /**
     * A timeout value in seconds, which during the ABRController will block switch-up events.
     * This will only take effect after an abandoned fragment event occurs.
     *
     * @default 10 seconds
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setAbandonLoadTimeout(value){mediaPlayerModel.setAbandonLoadTimeout(value);} /**
     * Total number of retry attempts that will occur on a fragment load before it fails.
     * Increase this value to a maximum in order to achieve an automatic playback resume
     * in case of completely lost internet connection.
     *
     * @default 3
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setFragmentLoaderRetryAttempts(value){mediaPlayerModel.setFragmentRetryAttempts(value);} /**
     * Time in milliseconds of which to reload a failed fragment load attempt.
     *
     * @default 1000 milliseconds
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setFragmentLoaderRetryInterval(value){mediaPlayerModel.setFragmentRetryInterval(value);} /**
     * Total number of retry attempts that will occur on a manifest load before it fails.
     *
     * @default 4
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setManifestLoaderRetryAttempts(value){mediaPlayerModel.setManifestRetryAttempts(value);} /**
     * Time in milliseconds of which to reload a failed manifest load attempt.
     *
     * @default 1000 milliseconds
     * @param {int} value
     * @memberof module:MediaPlayer
     * @instance
     */function setManifestLoaderRetryInterval(value){mediaPlayerModel.setManifestRetryInterval(value);} /**
     * Sets whether withCredentials on XHR requests for a particular request
     * type is true or false
     *
     * @default false
     * @param {string} type - one of HTTPRequest.*_TYPE
     * @param {boolean} value
     * @memberof module:MediaPlayer
     * @instance
     */function setXHRWithCredentialsForType(type,value){mediaPlayerModel.setXHRWithCredentialsForType(type,value);} /**
     * Gets whether withCredentials on XHR requests for a particular request
     * type is true or false
     *
     * @param {string} type - one of HTTPRequest.*_TYPE
     * @return {boolean}
     * @memberof module:MediaPlayer
     * @instance
     */function getXHRWithCredentialsForType(type){return mediaPlayerModel.getXHRWithCredentialsForType(type);} /**
     * Sets whether player should jump small gaps (discontinuities) in the buffer.
     *
     * @param {boolean} value
     * @default false
     * @memberof module:MediaPlayer
     * @instance
     *
     */function setJumpGaps(value){mediaPlayerModel.setJumpGaps(value);} /**
     * Gets current status of jump gaps feature.
     * @returns {boolean} The current jump gaps state.
     * @memberof module:MediaPlayer
     * @instance
     */function getJumpGaps(){return mediaPlayerModel.getJumpGaps();} /**
     * Time in seconds for a gap to be considered small.
     *
     * @param {boolean} value
     * @default 0.8
     * @memberof module:MediaPlayer
     * @instance
     *
     */function setSmallGapLimit(value){mediaPlayerModel.setSmallGapLimit(value);} /**
     * Time in seconds for a gap to be considered small.
     * @returns {boolean} Current small gap limit
     * @memberof module:MediaPlayer
     * @instance
     */function getSmallGapLimit(){return mediaPlayerModel.getSmallGapLimit();} /*
    ---------------------------------------------------------------------------

        METRICS

    ---------------------------------------------------------------------------
    */ /**
     * Returns the DashMetrics.js Module. You use this Module to get access to all the public metrics
     * stored in dash.js
     *
     * @see {@link module:DashMetrics}
     * @returns {Object}
     * @memberof module:MediaPlayer
     * @instance
     */function getDashMetrics(){return dashMetrics;} /**
     *
     * @param {string} type
     * @returns {Object}
     * @memberof module:MediaPlayer
     * @instance
     */function getMetricsFor(type){return metricsModel.getReadOnlyMetricsFor(type);} /*
    ---------------------------------------------------------------------------

        TEXT MANAGEMENT

    ---------------------------------------------------------------------------
    */ /**
     * Set default language for text. If default language is not one of text tracks, dash will choose the first one.
     *
     * @param {string} lang - default language
     * @memberof module:MediaPlayer
     * @instance
     */function setTextDefaultLanguage(lang){if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}textController.setTextDefaultLanguage(lang);} /**
     * Get default language for text.
     *
     * @return {string} the default language if it has been set using setTextDefaultLanguage
     * @memberof module:MediaPlayer
     * @instance
     */function getTextDefaultLanguage(){if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}return textController.getTextDefaultLanguage();} /**
     * Set enabled default state.
     * This is used to enable/disable text when a file is loaded.
     * During playback, use enableText to enable text for the file
     *
     * @param {boolean} enable - true to enable text, false otherwise
     * @memberof module:MediaPlayer
     * @instance
     */function setTextDefaultEnabled(enable){if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}textController.setTextDefaultEnabled(enable);} /**
     * Get enabled default state.
     *
     * @return {boolean}  default enable state
     * @memberof module:MediaPlayer
     * @instance
     */function getTextDefaultEnabled(){if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}return textController.getTextDefaultEnabled();} /**
     * Enable/disable text
     * When enabling text, dash will choose the previous selected text track
     *
     * @param {boolean} enable - true to enable text, false otherwise (same as setTextTrack(-1))
     * @memberof module:MediaPlayer
     * @instance
     */function enableText(enable){if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}textController.enableText(enable);} /**
     * Return if text is enabled
     *
     * @return {boolean} return true if text is enabled, false otherwise
     * @memberof module:MediaPlayer
     * @instance
     */function isTextEnabled(){if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}return textController.isTextEnabled();} /**
     * Use this method to change the current text track for both external time text files and fragmented text tracks. There is no need to
     * set the track mode on the video object to switch a track when using this method.
     * @param {number} idx - Index of track based on the order of the order the tracks are added Use -1 to disable all tracks. (turn captions off).  Use module:MediaPlayer#dashjs.MediaPlayer.events.TEXT_TRACK_ADDED.
     * @see {@link MediaPlayerEvents#event:TEXT_TRACK_ADDED dashjs.MediaPlayer.events.TEXT_TRACK_ADDED}
     * @memberof module:MediaPlayer
     * @instance
     */function setTextTrack(idx){if(!playbackInitialized){throw PLAYBACK_NOT_INITIALIZED_ERROR;}if(textController === undefined){textController = (0,_textTextController2['default'])(context).getInstance();}textController.setTextTrack(idx);}function getCurrentTextTrackIndex(){var idx=NaN;if(textController){idx = textController.getCurrentTrackIdx();}return idx;} /**
     * This method serves to control captions z-index value. If 'true' is passed, the captions will have the highest z-index and be
     * displayed on top of other html elements. Default value is 'false' (z-index is not set).
     * @param {boolean} value
     * @memberof module:MediaPlayer
     * @instance
     */function displayCaptionsOnTop(value){var textTracks=(0,_textTextTracks2['default'])(context).getInstance();textTracks.setConfig({videoModel:videoModel});textTracks.initialize();textTracks.displayCConTop(value);} /*
    ---------------------------------------------------------------------------

        VIDEO ELEMENT MANAGEMENT

    ---------------------------------------------------------------------------
    */ /**
     * Returns instance of Video Element that was attached by calling attachView()
     * @returns {Object}
     * @memberof module:MediaPlayer
     * @instance
     */function getVideoElement(){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}return videoModel.getElement();} /**
     * Returns instance of Video Container that was attached by calling attachVideoContainer()
     * @returns {Object}
     * @memberof module:MediaPlayer
     * @instance
     */function getVideoContainer(){return videoModel?videoModel.getVideoContainer():null;} /**
     * Use this method to attach an HTML5 element that wraps the video element.
     *
     * @param {HTMLElement} container - The HTML5 element containing the video element.
     * @memberof module:MediaPlayer
     * @instance
     */function attachVideoContainer(container){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}videoModel.setVideoContainer(container);} /**
     * Use this method to attach an HTML5 VideoElement for dash.js to operate upon.
     *
     * @param {Object} element - An HTMLMediaElement that has already been defined in the DOM (or equivalent stub).
     * @memberof module:MediaPlayer
     * @instance
     */function attachView(element){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}if(element){videoModel.setElement(element);detectProtection();detectMetricsReporting();detectMss();if(streamController){streamController.switchToVideoElement();}}if(playbackInitialized){ //Reset if we have been playing before, so this is a new element.
resetPlaybackControllers();}initializePlayback();} /**
     * Returns instance of Div that was attached by calling attachTTMLRenderingDiv()
     * @returns {Object}
     * @memberof module:MediaPlayer
     * @instance
     */function getTTMLRenderingDiv(){return videoModel?videoModel.getTTMLRenderingDiv():null;} /**
     * Use this method to attach an HTML5 div for dash.js to render rich TTML subtitles.
     *
     * @param {HTMLDivElement} div - An unstyled div placed after the video element. It will be styled to match the video size and overlay z-order.
     * @memberof module:MediaPlayer
     * @instance
     */function attachTTMLRenderingDiv(div){if(!videoModel.getElement()){throw ELEMENT_NOT_ATTACHED_ERROR;}videoModel.setTTMLRenderingDiv(div);} /*
    ---------------------------------------------------------------------------

        STREAM AND TRACK MANAGEMENT

    ---------------------------------------------------------------------------
    */ /**
     * @param {string} type
     * @returns {Array}
     * @memberof module:MediaPlayer
     * @instance
     */function getBitrateInfoListFor(type){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}var stream=getActiveStream();return stream?stream.getBitrateListFor(type):[];} /**
     * This method returns the list of all available streams from a given manifest
     * @param {Object} manifest
     * @returns {Array} list of {@link StreamInfo}
     * @memberof module:MediaPlayer
     * @instance
     */function getStreamsFromManifest(manifest){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}return adapter.getStreamsInfo(manifest);} /**
     * This method returns the list of all available tracks for a given media type
     * @param {string} type
     * @returns {Array} list of {@link MediaInfo}
     * @memberof module:MediaPlayer
     * @instance
     */function getTracksFor(type){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}var streamInfo=streamController.getActiveStreamInfo();if(!streamInfo)return [];return mediaController.getTracksFor(type,streamInfo);} /**
     * This method returns the list of all available tracks for a given media type and streamInfo from a given manifest
     * @param {string} type
     * @param {Object} manifest
     * @param {Object} streamInfo
     * @returns {Array}  list of {@link MediaInfo}
     * @memberof module:MediaPlayer
     * @instance
     */function getTracksForTypeFromManifest(type,manifest,streamInfo){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}streamInfo = streamInfo || adapter.getStreamsInfo(manifest)[0];return streamInfo?adapter.getAllMediaInfoForType(streamInfo,type,manifest):[];} /**
     * @param {string} type
     * @returns {Object|null} {@link MediaInfo}
     *
     * @memberof module:MediaPlayer
     * @instance
     */function getCurrentTrackFor(type){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}var streamInfo=streamController.getActiveStreamInfo();if(!streamInfo)return null;return mediaController.getCurrentTrackFor(type,streamInfo);} /**
     * This method allows to set media settings that will be used to pick the initial track. Format of the settings
     * is following:
     * {lang: langValue,
     *  viewpoint: viewpointValue,
     *  audioChannelConfiguration: audioChannelConfigurationValue,
     *  accessibility: accessibilityValue,
     *  role: roleValue}
     *
     *
     * @param {string} type
     * @param {Object} value
     * @memberof module:MediaPlayer
     * @instance
     */function setInitialMediaSettingsFor(type,value){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}mediaController.setInitialSettings(type,value);} /**
     * This method returns media settings that is used to pick the initial track. Format of the settings
     * is following:
     * {lang: langValue,
     *  viewpoint: viewpointValue,
     *  audioChannelConfiguration: audioChannelConfigurationValue,
     *  accessibility: accessibilityValue,
     *  role: roleValue}
     * @param {string} type
     * @returns {Object}
     * @memberof module:MediaPlayer
     * @instance
     */function getInitialMediaSettingsFor(type){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}return mediaController.getInitialSettings(type);} /**
     * @param {MediaInfo} track - instance of {@link MediaInfo}
     * @memberof module:MediaPlayer
     * @instance
     */function setCurrentTrack(track){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}mediaController.setTrack(track);} /**
     * This method returns the current track switch mode.
     *
     * @param {string} type
     * @returns {string} mode
     * @memberof module:MediaPlayer
     * @instance
     */function getTrackSwitchModeFor(type){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}return mediaController.getSwitchMode(type);} /**
     * This method sets the current track switch mode. Available options are:
     *
     * MediaController.TRACK_SWITCH_MODE_NEVER_REPLACE
     * (used to forbid clearing the buffered data (prior to current playback position) after track switch. Default for video)
     *
     * MediaController.TRACK_SWITCH_MODE_ALWAYS_REPLACE
     * (used to clear the buffered data (prior to current playback position) after track switch. Default for audio)
     *
     * @param {string} type
     * @param {string} mode
     * @memberof module:MediaPlayer
     * @instance
     */function setTrackSwitchModeFor(type,mode){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}mediaController.setSwitchMode(type,mode);} /**
     * This method sets the selection mode for the initial track. This mode defines how the initial track will be selected
     * if no initial media settings are set. If initial media settings are set this parameter will be ignored. Available options are:
     *
     * MediaController.TRACK_SELECTION_MODE_HIGHEST_BITRATE
     * this mode makes the player select the track with a highest bitrate. This mode is a default mode.
     *
     * MediaController.TRACK_SELECTION_MODE_WIDEST_RANGE
     * this mode makes the player select the track with a widest range of bitrates
     *
     * @param {string} mode
     * @memberof module:MediaPlayer
     * @instance
     */function setSelectionModeForInitialTrack(mode){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}mediaController.setSelectionModeForInitialTrack(mode);} /**
     * This method returns the track selection mode.
     *
     * @returns {string} mode
     * @memberof module:MediaPlayer
     * @instance
     */function getSelectionModeForInitialTrack(){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}return mediaController.getSelectionModeForInitialTrack();} /*
    ---------------------------------------------------------------------------

        PROTECTION MANAGEMENT

    ---------------------------------------------------------------------------
    /**
     * Detects if Protection is included and returns an instance of ProtectionController.js
     * @memberof module:MediaPlayer
     * @instance
     */function getProtectionController(){return detectProtection();} /**
     * Will override dash.js protection controller.
     * @param {ProtectionController} value - valid protection controller instance.
     * @memberof module:MediaPlayer
     * @instance
     */function attachProtectionController(value){protectionController = value;} /**
     * Sets Protection Data required to setup the Protection Module (DRM). Protection Data must
     * be set before initializing MediaPlayer or, once initialized, before PROTECTION_CREATED event is fired.
     * @see {@link module:MediaPlayer#initialize initialize()}
     * @see {@link ProtectionEvents#event:PROTECTION_CREATED dashjs.Protection.events.PROTECTION_CREATED}
     * @param {ProtectionData} value - object containing
     * property names corresponding to key system name strings and associated
     * values being instances of.
     * @memberof module:MediaPlayer
     * @instance
     */function setProtectionData(value){protectionData = value; // Propagate changes in case StreamController is already created
if(streamController){streamController.setProtectionData(protectionData);}} /*
    ---------------------------------------------------------------------------

        THUMBNAILS MANAGEMENT

    ---------------------------------------------------------------------------
    */ /**
     * Return the thumbnail at time position.
     * @returns {Thumbnail|null} - Thumbnail for the given time position. It returns null in case there are is not a thumbnails representation or
     * if it doesn't contain a thumbnail for the given time position.
     * @param {number} time - A relative time, in seconds, based on the return value of the {@link module:MediaPlayer#duration duration()} method is expected
     * @memberof module:MediaPlayer
     * @instance
     */function getThumbnail(time){if(time < 0){return null;}var s=playbackController.getIsDynamic()?getDVRSeekOffset(time):time;var stream=streamController.getStreamForTime(s);if(stream === null){return null;}var thumbnailController=stream.getThumbnailController();var streamInfo=stream.getStreamInfo();if(!thumbnailController || !streamInfo){return null;}var timeInPeriod=streamController.getTimeRelativeToStreamId(s,stream.getId());return thumbnailController.get(timeInPeriod);} /*
    ---------------------------------------------------------------------------

        TOOLS AND OTHERS FUNCTIONS

    ---------------------------------------------------------------------------
    */ /**
     * Allows application to retrieve a manifest.  Manifest loading is asynchro
     * nous and
     * requires the app-provided callback function
     *
     * @param {string} url - url the manifest url
     * @param {function} callback - A Callback function provided when retrieving manifests
     * @memberof module:MediaPlayer
     * @instance
     */function retrieveManifest(url,callback){var manifestLoader=createManifestLoader();var self=this;var handler=function handler(e){if(!e.error){callback(e.manifest);}else {callback(null,e.error);}eventBus.off(_coreEventsEvents2['default'].INTERNAL_MANIFEST_LOADED,handler,self);manifestLoader.reset();};eventBus.on(_coreEventsEvents2['default'].INTERNAL_MANIFEST_LOADED,handler,self);var uriQueryFragModel=(0,_modelsURIQueryAndFragmentModel2['default'])(context).getInstance();uriQueryFragModel.initialize();manifestLoader.load(uriQueryFragModel.parseURI(url));} /**
     * Returns the source string or manifest that was attached by calling attachSource()
     * @returns {string | manifest}
     * @memberof module:MediaPlayer
     * @instance
     */function getSource(){if(!source){throw SOURCE_NOT_ATTACHED_ERROR;}return source;} /**
     * Use this method to set a source URL to a valid MPD manifest file OR
     * a previously downloaded and parsed manifest object.  Optionally, can
     * also provide protection information
     *
     * @param {string|Object} urlOrManifest - A URL to a valid MPD manifest file, or a
     * parsed manifest object.
     *
     *
     * @throws "MediaPlayer not initialized!"
     *
     * @memberof module:MediaPlayer
     * @instance
     */function attachSource(urlOrManifest){if(!mediaPlayerInitialized){throw MEDIA_PLAYER_NOT_INITIALIZED_ERROR;}if(typeof urlOrManifest === 'string'){var uriQueryFragModel=(0,_modelsURIQueryAndFragmentModel2['default'])(context).getInstance();uriQueryFragModel.initialize();source = uriQueryFragModel.parseURI(urlOrManifest);}else {source = urlOrManifest;}if(streamingInitialized || playbackInitialized){resetPlaybackControllers();}if(isReady()){initializePlayback();}} /**
     * A utility methods which converts UTC timestamp value into a valid time and date string.
     *
     * @param {number} time - UTC timestamp to be converted into date and time.
     * @param {string} locales - a region identifier (i.e. en_US).
     * @param {boolean} hour12 - 12 vs 24 hour. Set to true for 12 hour time formatting.
     * @param {boolean} withDate - default is false. Set to true to append current date to UTC time format.
     * @returns {string} A formatted time and date string.
     * @memberof module:MediaPlayer
     * @instance
     */function formatUTC(time,locales,hour12){var withDate=arguments.length <= 3 || arguments[3] === undefined?false:arguments[3];var dt=new Date(time * 1000);var d=dt.toLocaleDateString(locales);var t=dt.toLocaleTimeString(locales,{hour12:hour12});return withDate?t + ' ' + d:t;} /**
     * A utility method which converts seconds into TimeCode (i.e. 300 --> 05:00).
     *
     * @param {number} value - A number in seconds to be converted into a formatted time code.
     * @returns {string} A formatted time code string.
     * @memberof module:MediaPlayer
     * @instance
     */function convertToTimeCode(value){value = Math.max(value,0);var h=Math.floor(value / 3600);var m=Math.floor(value % 3600 / 60);var s=Math.floor(value % 3600 % 60);return (h === 0?'':h < 10?'0' + h.toString() + ':':h.toString() + ':') + (m < 10?'0' + m.toString():m.toString()) + ':' + (s < 10?'0' + s.toString():s.toString());} /**
     * This method should be used to extend or replace internal dash.js objects.
     * There are two ways to extend dash.js (determined by the override argument):
     * <ol>
     * <li>If you set override to true any public method or property in your custom object will
     * override the dash.js parent object's property(ies) and will be used instead but the
     * dash.js parent module will still be created.</li>
     *
     * <li>If you set override to false your object will completely replace the dash.js object.
     * (Note: This is how it was in 1.x of Dash.js with Dijon).</li>
     * </ol>
     * <b>When you extend you get access to this.context, this.factory and this.parent to operate with in your custom object.</b>
     * <ul>
     * <li><b>this.context</b> - can be used to pass context for singleton access.</li>
     * <li><b>this.factory</b> - can be used to call factory.getSingletonInstance().</li>
     * <li><b>this.parent</b> - is the reference of the parent object to call other public methods. (this.parent is excluded if you extend with override set to false or option 2)</li>
     * </ul>
     * <b>You must call extend before you call initialize</b>
     * @see {@link module:MediaPlayer#initialize initialize()}
     * @param {string} parentNameString - name of parent module
     * @param {Object} childInstance - overriding object
     * @param {boolean} override - replace only some methods (true) or the whole object (false)
     * @memberof module:MediaPlayer
     * @instance
     */function extend(parentNameString,childInstance,override){_coreFactoryMaker2['default'].extend(parentNameString,childInstance,override,context);} //***********************************
// PRIVATE METHODS
//***********************************
function resetPlaybackControllers(){playbackInitialized = false;streamingInitialized = false;adapter.reset();streamController.reset();playbackController.reset();abrController.reset();mediaController.reset();textController.reset();if(protectionController){protectionController.reset();protectionController = null;detectProtection();}}function createPlaybackControllers(){ // creates or get objects instances
var manifestLoader=createManifestLoader();if(!streamController){streamController = (0,_controllersStreamController2['default'])(context).getInstance();} // configure controllers
mediaController.setConfig({errHandler:errHandler,domStorage:domStorage});streamController.setConfig({capabilities:capabilities,manifestLoader:manifestLoader,manifestModel:manifestModel,dashManifestModel:dashManifestModel,mediaPlayerModel:mediaPlayerModel,protectionController:protectionController,adapter:adapter,metricsModel:metricsModel,dashMetrics:dashMetrics,errHandler:errHandler,timelineConverter:timelineConverter,videoModel:videoModel,playbackController:playbackController,domStorage:domStorage,abrController:abrController,mediaController:mediaController,textController:textController});playbackController.setConfig({streamController:streamController,metricsModel:metricsModel,dashMetrics:dashMetrics,manifestModel:manifestModel,mediaPlayerModel:mediaPlayerModel,dashManifestModel:dashManifestModel,adapter:adapter,videoModel:videoModel});abrController.setConfig({streamController:streamController,domStorage:domStorage,mediaPlayerModel:mediaPlayerModel,metricsModel:metricsModel,dashMetrics:dashMetrics,dashManifestModel:dashManifestModel,manifestModel:manifestModel,videoModel:videoModel,adapter:adapter});abrController.createAbrRulesCollection();textController.setConfig({errHandler:errHandler,manifestModel:manifestModel,dashManifestModel:dashManifestModel,mediaController:mediaController,streamController:streamController,videoModel:videoModel}); // initialises controller
streamController.initialize(autoPlay,protectionData);}function createManifestLoader(){return (0,_ManifestLoader2['default'])(context).create({errHandler:errHandler,metricsModel:metricsModel,mediaPlayerModel:mediaPlayerModel,requestModifier:(0,_utilsRequestModifier2['default'])(context).getInstance(),mssHandler:mssHandler});}function detectProtection(){if(protectionController){return protectionController;} // do not require Protection as dependencies as this is optional and intended to be loaded separately
var Protection=dashjs.Protection; /* jshint ignore:line */if(typeof Protection === 'function'){ //TODO need a better way to register/detect plugin components
var protection=Protection(context).create();_coreEventsEvents2['default'].extend(Protection.events);_MediaPlayerEvents2['default'].extend(Protection.events,{publicOnly:true});if(!capabilities){capabilities = (0,_utilsCapabilities2['default'])(context).getInstance();}protectionController = protection.createProtectionSystem({log:log,errHandler:errHandler,videoModel:videoModel,capabilities:capabilities,eventBus:eventBus,events:_coreEventsEvents2['default'],BASE64:_externalsBase642['default'],constants:_constantsConstants2['default']});return protectionController;}return null;}function detectMetricsReporting(){if(metricsReportingController){return;} // do not require MetricsReporting as dependencies as this is optional and intended to be loaded separately
var MetricsReporting=dashjs.MetricsReporting; /* jshint ignore:line */if(typeof MetricsReporting === 'function'){ //TODO need a better way to register/detect plugin components
var metricsReporting=MetricsReporting(context).create();metricsReportingController = metricsReporting.createMetricsReporting({log:log,eventBus:eventBus,mediaElement:getVideoElement(),dashManifestModel:dashManifestModel,metricsModel:metricsModel,events:_coreEventsEvents2['default'],constants:_constantsConstants2['default'],metricsConstants:_constantsMetricsConstants2['default']});}}function detectMss(){if(mssHandler){return;} // do not require MssHandler as dependencies as this is optional and intended to be loaded separately
var MssHandler=dashjs.MssHandler; /* jshint ignore:line */if(typeof MssHandler === 'function'){ //TODO need a better way to register/detect plugin components
mssHandler = MssHandler(context).create({eventBus:eventBus,mediaPlayerModel:mediaPlayerModel,metricsModel:metricsModel,playbackController:playbackController,protectionController:protectionController,errHandler:errHandler,events:_coreEventsEvents2['default'],constants:_constantsConstants2['default'],log:log,initSegmentType:_voMetricsHTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE,BASE64:_externalsBase642['default'],ISOBoxer:_codemIsoboxer2['default']});}}function getDVRInfoMetric(){var metric=metricsModel.getReadOnlyMetricsFor(_constantsConstants2['default'].VIDEO) || metricsModel.getReadOnlyMetricsFor(_constantsConstants2['default'].AUDIO);return dashMetrics.getCurrentDVRInfo(metric);}function getAsUTC(valToConvert){var metric=getDVRInfoMetric();var availableFrom=undefined,utcValue=undefined;if(!metric){return 0;}availableFrom = metric.manifestInfo.availableFrom.getTime() / 1000;utcValue = valToConvert + (availableFrom + metric.range.start);return utcValue;}function getActiveStream(){if(!streamingInitialized){throw STREAMING_NOT_INITIALIZED_ERROR;}var streamInfo=streamController.getActiveStreamInfo();return streamInfo?streamController.getStreamById(streamInfo.id):null;}function initializePlayback(){if(!streamingInitialized && source){streamingInitialized = true;log('Streaming Initialized');createPlaybackControllers();if(typeof source === 'string'){streamController.load(source);}else {streamController.loadWithManifest(source);}}if(!playbackInitialized && isReady()){playbackInitialized = true;log('Playback Initialized');}}instance = {initialize:initialize,setConfig:setConfig,on:on,off:off,extend:extend,attachView:attachView,attachSource:attachSource,isReady:isReady,preload:preload,play:play,isPaused:isPaused,pause:pause,isSeeking:isSeeking,isDynamic:isDynamic,seek:seek,setPlaybackRate:setPlaybackRate,getPlaybackRate:getPlaybackRate,setMute:setMute,isMuted:isMuted,setVolume:setVolume,getVolume:getVolume,time:time,duration:duration,timeAsUTC:timeAsUTC,durationAsUTC:durationAsUTC,getActiveStream:getActiveStream,getDVRWindowSize:getDVRWindowSize,getDVRSeekOffset:getDVRSeekOffset,convertToTimeCode:convertToTimeCode,formatUTC:formatUTC,getVersion:getVersion,getDebug:getDebug,getBufferLength:getBufferLength,getVideoContainer:getVideoContainer,getTTMLRenderingDiv:getTTMLRenderingDiv,getVideoElement:getVideoElement,getSource:getSource,setLiveDelayFragmentCount:setLiveDelayFragmentCount,setLiveDelay:setLiveDelay,getLiveDelay:getLiveDelay,useSuggestedPresentationDelay:useSuggestedPresentationDelay,enableLastBitrateCaching:enableLastBitrateCaching,enableLastMediaSettingsCaching:enableLastMediaSettingsCaching,setMaxAllowedBitrateFor:setMaxAllowedBitrateFor,getMaxAllowedBitrateFor:getMaxAllowedBitrateFor,setMinAllowedBitrateFor:setMinAllowedBitrateFor,getMinAllowedBitrateFor:getMinAllowedBitrateFor,setMaxAllowedRepresentationRatioFor:setMaxAllowedRepresentationRatioFor,getMaxAllowedRepresentationRatioFor:getMaxAllowedRepresentationRatioFor,setAutoPlay:setAutoPlay,getAutoPlay:getAutoPlay,setScheduleWhilePaused:setScheduleWhilePaused,getScheduleWhilePaused:getScheduleWhilePaused,getDashMetrics:getDashMetrics,getMetricsFor:getMetricsFor,getQualityFor:getQualityFor,setQualityFor:setQualityFor,updatePortalSize:updatePortalSize,getLimitBitrateByPortal:getLimitBitrateByPortal,setLimitBitrateByPortal:setLimitBitrateByPortal,getUsePixelRatioInLimitBitrateByPortal:getUsePixelRatioInLimitBitrateByPortal,setUsePixelRatioInLimitBitrateByPortal:setUsePixelRatioInLimitBitrateByPortal,setTextDefaultLanguage:setTextDefaultLanguage,getTextDefaultLanguage:getTextDefaultLanguage,setTextDefaultEnabled:setTextDefaultEnabled,getTextDefaultEnabled:getTextDefaultEnabled,enableText:enableText,isTextEnabled:isTextEnabled,setTextTrack:setTextTrack,getBitrateInfoListFor:getBitrateInfoListFor,setInitialBitrateFor:setInitialBitrateFor,getInitialBitrateFor:getInitialBitrateFor,setInitialRepresentationRatioFor:setInitialRepresentationRatioFor,getInitialRepresentationRatioFor:getInitialRepresentationRatioFor,getStreamsFromManifest:getStreamsFromManifest,getTracksFor:getTracksFor,getTracksForTypeFromManifest:getTracksForTypeFromManifest,getCurrentTrackFor:getCurrentTrackFor,setInitialMediaSettingsFor:setInitialMediaSettingsFor,getInitialMediaSettingsFor:getInitialMediaSettingsFor,setCurrentTrack:setCurrentTrack,getTrackSwitchModeFor:getTrackSwitchModeFor,setTrackSwitchModeFor:setTrackSwitchModeFor,setSelectionModeForInitialTrack:setSelectionModeForInitialTrack,getSelectionModeForInitialTrack:getSelectionModeForInitialTrack,setFastSwitchEnabled:setFastSwitchEnabled,getFastSwitchEnabled:getFastSwitchEnabled,setMovingAverageMethod:setMovingAverageMethod,getMovingAverageMethod:getMovingAverageMethod,getAutoSwitchQualityFor:getAutoSwitchQualityFor,setAutoSwitchQualityFor:setAutoSwitchQualityFor,setABRStrategy:setABRStrategy,getABRStrategy:getABRStrategy,useDefaultABRRules:useDefaultABRRules,addABRCustomRule:addABRCustomRule,removeABRCustomRule:removeABRCustomRule,removeAllABRCustomRule:removeAllABRCustomRule,setBandwidthSafetyFactor:setBandwidthSafetyFactor,getBandwidthSafetyFactor:getBandwidthSafetyFactor,getAverageThroughput:getAverageThroughput,setAbandonLoadTimeout:setAbandonLoadTimeout,retrieveManifest:retrieveManifest,addUTCTimingSource:addUTCTimingSource,removeUTCTimingSource:removeUTCTimingSource,clearDefaultUTCTimingSources:clearDefaultUTCTimingSources,restoreDefaultUTCTimingSources:restoreDefaultUTCTimingSources,setBufferToKeep:setBufferToKeep,setBufferAheadToKeep:setBufferAheadToKeep,setBufferPruningInterval:setBufferPruningInterval,setStableBufferTime:setStableBufferTime,getStableBufferTime:getStableBufferTime,setBufferTimeAtTopQuality:setBufferTimeAtTopQuality,getBufferTimeAtTopQuality:getBufferTimeAtTopQuality,setBufferTimeAtTopQualityLongForm:setBufferTimeAtTopQualityLongForm,getBufferTimeAtTopQualityLongForm:getBufferTimeAtTopQualityLongForm,setFragmentLoaderRetryAttempts:setFragmentLoaderRetryAttempts,setFragmentLoaderRetryInterval:setFragmentLoaderRetryInterval,setManifestLoaderRetryAttempts:setManifestLoaderRetryAttempts,setManifestLoaderRetryInterval:setManifestLoaderRetryInterval,setXHRWithCredentialsForType:setXHRWithCredentialsForType,getXHRWithCredentialsForType:getXHRWithCredentialsForType,setJumpGaps:setJumpGaps,getJumpGaps:getJumpGaps,setSmallGapLimit:setSmallGapLimit,getSmallGapLimit:getSmallGapLimit,setLongFormContentDurationThreshold:setLongFormContentDurationThreshold,setSegmentOverlapToleranceTime:setSegmentOverlapToleranceTime,setCacheLoadThresholdForType:setCacheLoadThresholdForType,getProtectionController:getProtectionController,attachProtectionController:attachProtectionController,setProtectionData:setProtectionData,enableManifestDateHeaderTimeSource:enableManifestDateHeaderTimeSource,displayCaptionsOnTop:displayCaptionsOnTop,attachVideoContainer:attachVideoContainer,attachTTMLRenderingDiv:attachTTMLRenderingDiv,getCurrentTextTrackIndex:getCurrentTextTrackIndex,getUseDeadTimeLatencyForAbr:getUseDeadTimeLatencyForAbr,setUseDeadTimeLatencyForAbr:setUseDeadTimeLatencyForAbr,getThumbnail:getThumbnail,reset:reset};setup();return instance;}MediaPlayer.__dashjs_factory_name = 'MediaPlayer';var factory=_coreFactoryMaker2['default'].getClassFactory(MediaPlayer);factory.events = _MediaPlayerEvents2['default'];_coreFactoryMaker2['default'].updateClassFactory(MediaPlayer.__dashjs_factory_name,factory);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=MediaPlayer.js.map
