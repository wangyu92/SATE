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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _get=function get(_x,_x2,_x3){var _again=true;_function: while(_again) {var object=_x,property=_x2,receiver=_x3;_again = false;if(object === null)object = Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc === undefined){var parent=Object.getPrototypeOf(object);if(parent === null){return undefined;}else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}}else if('value' in desc){return desc.value;}else {var getter=desc.get;if(getter === undefined){return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}var _coreEventsEventsBase=require('../core/events/EventsBase');var _coreEventsEventsBase2=_interopRequireDefault(_coreEventsEventsBase); /**
 * @class
 *
 */var MediaPlayerEvents=(function(_EventsBase){_inherits(MediaPlayerEvents,_EventsBase); /**
     * @description Public facing external events to be used when developing a player that implements dash.js.
     */function MediaPlayerEvents(){_classCallCheck(this,MediaPlayerEvents);_get(Object.getPrototypeOf(MediaPlayerEvents.prototype),'constructor',this).call(this); /**
         * Triggered when playback will not start yet
         * as the MPD's availabilityStartTime is in the future.
         * Check delay property in payload to determine time before playback will start.
         */this.AST_IN_FUTURE = 'astInFuture'; /**
         * Triggered when the video element's buffer state changes to stalled.
         * Check mediaType in payload to determine type (Video, Audio, FragmentedText).
         * @event MediaPlayerEvents#BUFFER_EMPTY
         */this.BUFFER_EMPTY = 'bufferStalled'; /**
         * Triggered when the video element's buffer state changes to loaded.
         * Check mediaType in payload to determine type (Video, Audio, FragmentedText).
         * @event MediaPlayerEvents#BUFFER_LOADED
         */this.BUFFER_LOADED = 'bufferLoaded'; /**
         * Triggered when the video element's buffer state changes, either stalled or loaded. Check payload for state.
         * @event MediaPlayerEvents#BUFFER_LEVEL_STATE_CHANGED
         */this.BUFFER_LEVEL_STATE_CHANGED = 'bufferStateChanged'; /**
         * Triggered when there is an error from the element or MSE source buffer.
         * @event MediaPlayerEvents#ERROR
         */this.ERROR = 'error'; /**
         * Triggered when a fragment download has completed.
         * @event MediaPlayerEvents#FRAGMENT_LOADING_COMPLETED
         */this.FRAGMENT_LOADING_COMPLETED = 'fragmentLoadingCompleted'; /**
         * Triggered when a fragment download has started.
         * @event MediaPlayerEvents#FRAGMENT_LOADING_STARTED
         */this.FRAGMENT_LOADING_STARTED = 'fragmentLoadingStarted'; /**
         * Triggered when a fragment download is abandoned due to detection of slow download base on the ABR abandon rule..
         * @event MediaPlayerEvents#FRAGMENT_LOADING_ABANDONED
         */this.FRAGMENT_LOADING_ABANDONED = 'fragmentLoadingAbandoned'; /**
         * Triggered when {@link module:Debug} log method is called.
         * @event MediaPlayerEvents#LOG
         */this.LOG = 'log'; //TODO refactor with internal event
/**
         * Triggered when the manifest load is complete
         * @event MediaPlayerEvents#MANIFEST_LOADED
         */this.MANIFEST_LOADED = 'manifestLoaded'; /**
         * Triggered anytime there is a change to the overall metrics.
         * @event MediaPlayerEvents#METRICS_CHANGED
         */this.METRICS_CHANGED = 'metricsChanged'; /**
         * Triggered when an individual metric is added, updated or cleared.
         * @event MediaPlayerEvents#METRIC_CHANGED
         */this.METRIC_CHANGED = 'metricChanged'; /**
         * Triggered every time a new metric is added.
         * @event MediaPlayerEvents#METRIC_ADDED
         */this.METRIC_ADDED = 'metricAdded'; /**
         * Triggered every time a metric is updated.
         * @event MediaPlayerEvents#METRIC_UPDATED
         */this.METRIC_UPDATED = 'metricUpdated'; /**
         * Triggered at the stream end of a period.
         * @event MediaPlayerEvents#PERIOD_SWITCH_COMPLETED
         */this.PERIOD_SWITCH_COMPLETED = 'periodSwitchCompleted'; /**
         * Triggered when a new period starts.
         * @event MediaPlayerEvents#PERIOD_SWITCH_STARTED
         */this.PERIOD_SWITCH_STARTED = 'periodSwitchStarted'; /**
         * Triggered when an ABR up /down switch is initiated; either by user in manual mode or auto mode via ABR rules.
         * @event MediaPlayerEvents#QUALITY_CHANGE_REQUESTED
         */this.QUALITY_CHANGE_REQUESTED = 'qualityChangeRequested'; /**
         * Triggered when the new ABR quality is being rendered on-screen.
         * @event MediaPlayerEvents#QUALITY_CHANGE_RENDERED
         */this.QUALITY_CHANGE_RENDERED = 'qualityChangeRendered'; /**
         * Triggered when the new track is being rendered.
         * @event MediaPlayerEvents#TRACK_CHANGE_RENDERED
         */this.TRACK_CHANGE_RENDERED = 'trackChangeRendered'; /**
         * Triggered when the source is setup and ready.
         * @event MediaPlayerEvents#SOURCE_INITIALIZED
         */this.SOURCE_INITIALIZED = 'sourceInitialized'; /**
         * Triggered when a stream (period) is loaded
         * @event MediaPlayerEvents#STREAM_INITIALIZED
         */this.STREAM_INITIALIZED = 'streamInitialized'; /**
         * Triggered when the player has been reset.
         * @event MediaPlayerEvents#STREAM_TEARDOWN_COMPLETE
         */this.STREAM_TEARDOWN_COMPLETE = 'streamTeardownComplete'; /**
         * Triggered once all text tracks detected in the MPD are added to the video element.
         * @event MediaPlayerEvents#TEXT_TRACKS_ADDED
         */this.TEXT_TRACKS_ADDED = 'allTextTracksAdded'; /**
         * Triggered when a text track is added to the video element's TextTrackList
         * @event MediaPlayerEvents#TEXT_TRACK_ADDED
         */this.TEXT_TRACK_ADDED = 'textTrackAdded'; /**
         * Triggered when a ttml chunk is parsed.
         * @event MediaPlayerEvents#TTML_PARSED
         */this.TTML_PARSED = 'ttmlParsed'; /**
         * Sent when enough data is available that the media can be played,
         * at least for a couple of frames.  This corresponds to the
         * HAVE_ENOUGH_DATA readyState.
         * @event MediaPlayerEvents#CAN_PLAY
         */this.CAN_PLAY = 'canPlay'; /**
         * Sent when playback completes.
         * @event MediaPlayerEvents#PLAYBACK_ENDED
         */this.PLAYBACK_ENDED = 'playbackEnded'; /**
         * Sent when an error occurs.  The element's error
         * attribute contains more information.
         * @event MediaPlayerEvents#PLAYBACK_ERROR
         */this.PLAYBACK_ERROR = 'playbackError'; /**
         * Sent when playback is not allowed (for example if user gesture is needed).
         * @event MediaPlayerEvents#PLAYBACK_NOT_ALLOWED
         */this.PLAYBACK_NOT_ALLOWED = 'playbackNotAllowed'; /**
         * The media's metadata has finished loading; all attributes now
         * contain as much useful information as they're going to.
         * @event MediaPlayerEvents#PLAYBACK_METADATA_LOADED
         */this.PLAYBACK_METADATA_LOADED = 'playbackMetaDataLoaded'; /**
         * Sent when playback is paused.
         * @event MediaPlayerEvents#PLAYBACK_PAUSED
         */this.PLAYBACK_PAUSED = 'playbackPaused'; /**
         * Sent when the media begins to play (either for the first time, after having been paused,
         * or after ending and then restarting).
         *
         * @event MediaPlayerEvents#PLAYBACK_PLAYING
         */this.PLAYBACK_PLAYING = 'playbackPlaying'; /**
         * Sent periodically to inform interested parties of progress downloading
         * the media. Information about the current amount of the media that has
         * been downloaded is available in the media element's buffered attribute.
         * @event MediaPlayerEvents#PLAYBACK_PROGRESS
         */this.PLAYBACK_PROGRESS = 'playbackProgress'; /**
         * Sent when the playback speed changes.
         * @event MediaPlayerEvents#PLAYBACK_RATE_CHANGED
         */this.PLAYBACK_RATE_CHANGED = 'playbackRateChanged'; /**
         * Sent when a seek operation completes.
         * @event MediaPlayerEvents#PLAYBACK_SEEKED
         */this.PLAYBACK_SEEKED = 'playbackSeeked'; /**
         * Sent when a seek operation begins.
         * @event MediaPlayerEvents#PLAYBACK_SEEKING
         */this.PLAYBACK_SEEKING = 'playbackSeeking'; /**
         * Sent when a seek operation has been asked.
         * @event MediaPlayerEvents#PLAYBACK_SEEK_ASKED
         */this.PLAYBACK_SEEK_ASKED = 'playbackSeekAsked'; /**
         * Sent when playback of the media starts after having been paused;
         * that is, when playback is resumed after a prior pause event.
         *
         * @event MediaPlayerEvents#PLAYBACK_STARTED
         */this.PLAYBACK_STARTED = 'playbackStarted'; /**
         * The time indicated by the element's currentTime attribute has changed.
         * @event MediaPlayerEvents#PLAYBACK_TIME_UPDATED
         */this.PLAYBACK_TIME_UPDATED = 'playbackTimeUpdated'; /**
         * Manifest validity changed - As a result of an MPD validity expiration event.
         * @event MediaPlayerEvents#MANIFEST_VALIDITY_CHANGED
         */this.MANIFEST_VALIDITY_CHANGED = 'manifestValidityChanged';}return MediaPlayerEvents;})(_coreEventsEventsBase2['default']);var mediaPlayerEvents=new MediaPlayerEvents();exports['default'] = mediaPlayerEvents;module.exports = exports['default'];
//# sourceMappingURL=MediaPlayerEvents.js.map
