'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}var _MediaPlayer=require('./MediaPlayer');var _MediaPlayer2=_interopRequireDefault(_MediaPlayer);function MediaPlayerFactory(){ /**
     * mime-type identifier for any source content to be accepted as a dash manifest by the create() method.
     * @type {string}
     */var SUPPORTED_MIME_TYPE='application/dash+xml'; /**
     *  A new MediaPlayer is instantiated for the supplied videoElement and optional source and context.  If no context is provided,
     *  a default DashContext is used. If no source is provided, the videoElement is interrogated to extract the first source whose
     *  type is application/dash+xml.
     * The autoplay property of the videoElement is preserved. Any preload attribute is ignored. This method should be called after the page onLoad event is dispatched.
     * @param {HTMLMediaElement} video
     * @param {HTMLSourceElement} source
     * @param {Object} context
     * @returns {MediaPlayer|null}
     */function create(video,source,context){if(!video || video.nodeName !== 'VIDEO')return null;if(video._dashjs_player)return video._dashjs_player;var player=undefined;var videoID=video.id || video.name || 'video element';source = source || [].slice.call(video.querySelectorAll('source')).filter(function(s){return s.type == SUPPORTED_MIME_TYPE;})[0];if(!source && video.src){source = document.createElement('source');source.src = video.src;}else if(!source && !video.src){return null;}context = context || {};player = (0,_MediaPlayer2['default'])(context).create();player.initialize(video,source.src,video.autoplay);player.getDebug().log('Converted ' + videoID + ' to dash.js player and added content: ' + source.src); // Store a reference to the player on the video element so it can be gotten at for debugging and so we know its
// already been setup.
video._dashjs_player = player;return player;} /**
     * Searches the provided scope for all instances of the indicated selector. If no scope is provided, document is used. If no selector is
     * specified, [data-dashjs-player] is used. The declarative setup also looks for source elements with the type attribute set to 'application/dash+xml'.
     * It then looks for those video elements which have a source element defined with a type matching 'application/dash+xml'.
     * A new MediaPlayer is instantiated for each matching video element and the appropriate source is assigned.
     * The autoplay property of the video element is preserved. Any preload attribute is ignored. This method should be called after the page onLoad event is dispatched.
     * Returns an array holding all the MediaPlayer instances that were added by this method.
     * @param {string} selector - CSS selector
     * @param {Object} scope
     * @returns {Array} an array of MediaPlayer objects
     */function createAll(selector,scope){var aPlayers=[];selector = selector || '[data-dashjs-player]';scope = scope || document;var videos=scope.querySelectorAll(selector);for(var i=0;i < videos.length;i++) {var player=create(videos[i],null);aPlayers.push(player);}var sources=scope.querySelectorAll('source[type="' + SUPPORTED_MIME_TYPE + '"]');for(var i=0;i < sources.length;i++) {var video=findVideo(sources[i]);var player=create(video,null);aPlayers.push(player);}return aPlayers;}function findVideo(_x){var _again=true;_function: while(_again) {var el=_x;_again = false;if(el.nodeName.toLowerCase() === 'video'){return el;}else {_x = el.parentNode;_again = true;continue _function;}}}return {create:create,createAll:createAll};}var instance=MediaPlayerFactory();var loadInterval=undefined;function loadHandler(){window.removeEventListener('load',loadHandler);instance.createAll();}function loadIntervalHandler(){if(window.dashjs){window.clearInterval(loadInterval);instance.createAll();}}var avoidAutoCreate=typeof window !== 'undefined' && window && window.dashjs && window.dashjs.skipAutoCreate;if(!avoidAutoCreate && typeof window !== 'undefined' && window && window.addEventListener){if(window.document.readyState === 'complete'){if(window.dashjs){instance.createAll();}else { // If loaded asynchronously, window.readyState may be 'complete' even if dashjs hasn't loaded yet
loadInterval = window.setInterval(loadIntervalHandler,500);}}else {window.addEventListener('load',loadHandler);}}exports['default'] = instance;module.exports = exports['default'];
//# sourceMappingURL=MediaPlayerFactory.js.map
