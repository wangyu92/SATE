let BBARule;

function BBARuleClass() {

    var timeHistory = [];
    var throughputHistory = [];
    var bitrateHistory = [];
    var bufferHistory = [];
    var latencyHistory = [];

    var startTime = 0;

    var print = 0;

    //  Constant
    const DOWNLOAD_RATIO_SAFETY_FACTOR = 0.75;

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let StreamController = factory.getSingletonFactoryByName('StreamController');

    let bitrates = [];

    let context = this.context;

    /**
     * bitrate을 선택하는 함수로 보임.
     * 핵심 알고리즘.
     *
     * @param  {[type]} rulesContext [description]
     * @return {[type]}              [description]
     */
    function getMaxIndex(rulesContext) {
        ////////////////////////////////////////////////////////////////////////
        //  For real bba
        let dashMetrics = DashMetrics(context).getInstance();
        let mediaType = rulesContext.getMediaInfo().type;
        let metricsModel = MetricsModel(context).getInstance();
        let metrics = metricsModel.getReadOnlyMetricsFor(mediaType);

        var self = this;
        var httpRequests = dashMetrics.getHttpRequests(metrics);
        var lastRequest;
        var bufferLevel;
        var downloadTime;
        var totalTime;
        var downloadRatio;
        var totalRatio;
        var switchRatio;
        var i;

        let bitrateLevelCount;
        let streamController = StreamController(context).getInstance();

        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());

        let q = SwitchRequest.NO_CHANGE;
        let p = SwitchRequest.PRIORITY.STRONG;

        console.log("Checking buffer-based rule...!!");

        //  지원가능한 bitrate 리스트. 단위는 kbps
        bitrateLevelCount = rulesContext.getMediaInfo().representationCount;
        for (i = 0; i < bitrateLevelCount; i += 1) {
            bitrates.push(rulesContext.getMediaInfo().bitrateList[i].bandwidth);
        }

        if(!metrics) {
            return SwitchRequest(context).create();
        }

        if (httpRequests === null || httpRequests === undefined || httpRequests.length === 0) {
            return SwitchRequest(context).create();
        }

        lastRequest = httpRequests[httpRequests.length - 1];
        bufferLevel = dashMetrics.getCurrentBufferLevel(metrics);

        // console.log(lastRequest);

        totalTime = (lastRequest._tfinish.getMilliseconds() - lastRequest.trequest.getMilliseconds()) / 1000;
        downloadTime = (lastRequest._tfinish.getMilliseconds() - lastRequest.tresponse.getMilliseconds()) / 1000;

        // console.log("Total time: " + totalTime);
        // console.log("Download time: " + downloadTime);

        if (totalTime <= 0) {
            // console.log("Don't know how long the download of the last fragment took, bailing.");
            return SwitchRequest(context).create();
        }

        if (lastRequest._mediaduration === null ||
            lastRequest._mediaduration === undefined ||
            lastRequest._mediaduration <= 0) {
            // console.log("Don't know the duration of the last media fragment, bailing.");
            return SwitchRequest(context).create();
        }

        totalRatio = lastRequest._mediaduration / totalTime;
        downloadRatio = (lastRequest._mediaduration / downloadTime) * DOWNLOAD_RATIO_SAFETY_FACTOR;

        // console.log("Total ratio: " + totalRatio);
        // console.log("Download ratio: " + downloadRatio);

        if (isNaN(downloadRatio) || isNaN(totalRatio)) {
            return SwitchRequest(context).create();
        }

        if (isNaN(downloadRatio)) {
                // console.log("Invalid ratio, bailing.");
                q = SwitchRequest.NO_CHANGE;
        }

        else if (downloadRatio < 1.0) {
            // console.log("Download ratio is poor.");
            if (current > 0) {
                // console.log("We are not at the lowest bitrate, so switch down.");
                var oneDownBandwidth = bitrates[current - 1];
                var currentBandwidth = bitrates[current];

                switchRatio = oneDownBandwidth / currentBandwidth;
                // console.log("Switch ratio: " + switchRatio);

                if (downloadRatio < switchRatio) {
                    // console.log("Things must be going pretty bad, switch all the way down.");
                    q = 0;
                } else {
                    // console.log("Things could be better, so just switch down one index.");
                    q -= 1;
                }

            }

            else {
                    // console.log("We are at the lowest bitrate and cannot switch down, use current.");
                    q = SwitchRequest.NO_CHANGE;
                }
        }

        else {
            // console.log("Download ratio is good.");
            var max = rulesContext.getMediaInfo().representationCount;

            max -= 1; // 0 based
            if (current < max) {
                // console.log("We are not at the highest bitrate, so switch up.");

                var currentBandwidth = bitrates[current];
                var oneUpBandwidth = bitrates[current + 1];

                switchRatio = oneUpBandwidth / currentBandwidth;
                // console.log("Switch ratio: " + switchRatio);

                if (downloadRatio >= switchRatio) {
                    if (downloadRatio > 1000.0) {
                        // console.log("Tons of bandwidth available, go all the way up.");
                            q = max - 1;
                    }
                    else if (downloadRatio > 100.0) {
                        // console.log("Just enough bandwidth available, switch up one.");
                        q = current + 1;
                    }
                    else {
                        // console.log("Not exactly sure where to go, so do some math.");
                        i = -1;
                        while ((i += 1) < max) {
                            var newBandwidth = bitrates[i];
                            if (downloadRatio < newBandwidth / currentBandwidth) {
                                break;
                            }
                                // console.log("Calculated ideal new quality index is: " + i);
                            q = i;
                        }
                    }
                }

                else {
                    // console.log("Not enough bandwidth to switch up.");
                    q = SwitchRequest.NO_CHANGE;
                }

            } else {
                // console.log("We are at the highest bitrate and cannot switch up, use current.");
                q = max;
            }
        }

        return SwitchRequest(context).create(q, {name : BBARuleClass.__dashjs_factory_name},  p);
    }

    function push_log(time, throughput, q, bufferLevel) {
        timeHistory.push(time.getTime() / 1000 - startTime);
        throughputHistory.push(isNaN(throughput / 1000) ? 0 : throughput / 1000);
        bitrateHistory.push(bitrates[q] / 1000);
        bufferHistory.push(bufferLevel);
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

BBARuleClass.__dashjs_factory_name = 'BBARule';
BBARule = dashjs.FactoryMaker.getClassFactory(BBARuleClass);
