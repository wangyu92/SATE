let SimpleRule;

function SimpleRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let DashManifestModel = factory.getSingletonFactoryByName('DashManifestModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let Debug = factory.getSingletonFactoryByName('Debug');

    let context = this.context;
    let debug = Debug(context).getInstance();

    /**
     * 바이트 길이를 구하는 함수. 반드시 필요한 함수는 아닌것으로 보임.
     *
     * @param  {[type]} request [description]
     * @return {[type]}         [description]
     */
    function getBytesLength(request) {
        return request.trace.reduce((a, b) => a + b.b[0], 0);
    }

    /**
     * bitrate을 선택하는 함수로 보임.
     * 핵심 알고리즘.
     *
     * @param  {[type]} rulesContext [description]
     * @return {[type]}              [description]
     */
    function getMaxIndex(rulesContext) {

        let mediaType = rulesContext.getMediaInfo().type;

        let metricsModel = MetricsModel(context).getInstance();
        let dashMetrics = DashMetrics(context).getInstance();
        let dashManifest = DashManifestModel(context).getInstance();
        let metrics = metricsModel.getReadOnlyMetricsFor(mediaType);
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());

        let requests = dashMetrics.getHttpRequests(metrics),
            lastRequest = null,
            currentRequest = null,
            downloadTime,
            totalTime,
            calculatedBandwidth,
            currentBandwidth,
            latencyInBandwidth,
            switchUpRatioSafetyFactor,
            currentRepresentation,
            count,
            bandwidths = [],
            i,
            q = SwitchRequest.NO_CHANGE,
            p = SwitchRequest.PRIORITY.DEFAULT,
            totalBytesLength = 0;

        latencyInBandwidth = false;
        switchUpRatioSafetyFactor = 1.5;

        if (!metrics) {
            return SwitchRequest(context).create();
        }

        // Get last valid request
        i = requests.length - 1;
        while (i >= 0 && lastRequest === null) {
            currentRequest = requests[i];
            if (currentRequest._tfinish && currentRequest.trequest && currentRequest.tresponse && currentRequest.trace && currentRequest.trace.length > 0) {
                lastRequest = requests[i];
            }
            i--;
        }

        if (lastRequest === null) {
            return SwitchRequest(context).create();
        }

        if(lastRequest.type !== 'MediaSegment' ) {
            return SwitchRequest(context).create();
        }

        totalTime = (lastRequest._tfinish.getTime() - lastRequest.trequest.getTime()) / 1000;
        downloadTime = (lastRequest._tfinish.getTime() - lastRequest.tresponse.getTime()) / 1000;

        if (totalTime <= 0) {
            return SwitchRequest(context).create();
        }

        totalBytesLength = getBytesLength(lastRequest);

        // Take average bandwidth over 3 requests
        count = 1;
        while (i >= 0 && count < 3) {
            currentRequest = requests[i];

            if (currentRequest.type !== 'MediaSegment' &&
            currentRequest._tfinish &&
            currentRequest.trequest &&
            currentRequest.tresponse &&
            currentRequest.trace &&
            currentRequest.trace.length > 0) {

                let _totalTime = (currentRequest._tfinish.getTime() - currentRequest.trequest.getTime()) / 1000;
                let _downloadTime = (currentRequest._tfinish.getTime() - currentRequest.tresponse.getTime()) / 1000;

                totalTime += _totalTime;
                downloadTime += _downloadTime;
                totalBytesLength += getBytesLength(currentRequest);
                count += 1;
            }
            i--;
        }

        // Set length in bits
        totalBytesLength *= 8;

        calculatedBandwidth = latencyInBandwidth ? (totalBytesLength / totalTime) : (totalBytesLength / downloadTime);
        console.log("BAND " + calculatedBandwidth);

        if (isNaN(calculatedBandwidth)) {
            return SwitchRequest(context).create();
        }

        count = rulesContext.getMediaInfo().representationCount;
        currentRepresentation = rulesContext.getRepresentationInfo();
        currentBandwidth = dashManifest.getBandwidth(currentRepresentation);

        for (i = 0; i < count; i += 1) {
            bandwidths.push(rulesContext.getMediaInfo().bitrateList[i].bandwidth);
        }

        for (i = count - 1; i > current; i -= 1) {
            if (calculatedBandwidth > (bandwidths[i] * switchUpRatioSafetyFactor)) {
                // debug.log("[CustomRules][" + mediaType + "][SimpleRule] bw = " + calculatedBandwidth + " results[i] * switchUpRatioSafetyFactor =" + (bandwidths[i] * switchUpRatioSafetyFactor) + " with i=" + i);
                break;
            }
        }

        q = 0;
        p = SwitchRequest.PRIORITY.STRONG;

        return SwitchRequest(context).create(q, {name : SimpleRuleClass.__dashjs_factory_name},  p);
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

SimpleRuleClass.__dashjs_factory_name = 'SimpleRule';
SimpleRule = dashjs.FactoryMaker.getClassFactory(SimpleRuleClass);
