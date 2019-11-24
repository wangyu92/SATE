let BBARule;

function BBARuleClass() {

    const THRESHOLD_R = 4;
    const THRESHOLD_BM = 30;

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
     * bitrate을 선택하는 함수로 보임.
     * 핵심 알고리즘.
     *
     * @param  {[type]} rulesContext [description]
     * @return {[type]}              [description]
     */
    function getMaxIndex(rulesContext) {
        let mediaType = rulesContext.getMediaInfo().type;
        let abrController = rulesContext.getAbrController();
        let metricsModel = MetricsModel(context).getInstance();
        let dashMetrics = DashMetrics(context).getInstance();
        let metrics = metricsModel.getReadOnlyMetricsFor(mediaType);
        let index = timeHistory.length;

        //  throughput 및 latency estimation을 위해서 추가.
        //  throughput의 단위는 kbps.
        const streamInfo = rulesContext.getStreamInfo();
        const isDynamic = streamInfo && streamInfo.manifestInfo ? streamInfo.manifestInfo.isDynamic : null;
        let throughput = abrController.getThroughputHistory().getSafeAverageThroughput(mediaType, isDynamic);
        let latency = abrController.getThroughputHistory().getAverageLatency(mediaType);

        //  use buffer occupancy
        let useBufferOccupancyABR = rulesContext.useBufferOccupancyABR();
        let bufferLevel = dashMetrics.getCurrentBufferLevel(metrics);
        let lastBitrate = bitrateHistory[bitrateHistory.length - 1];
        let bitrateLevelCount;
        let bitrates = [];
        let i;
        let q = SwitchRequest.NO_CHANGE;
        let p = SwitchRequest.PRIORITY.STRONG;

        if(mediaType === "video") {
            // console.log("throughput = " + throughput);
        }

        //  오디오의 경우 adaptation 하지않음.
        else {
            return SwitchRequest(context).create();
        }

        //  지원가능한 bitrate 리스트. 단위는 kbps
        bitrateLevelCount = rulesContext.getMediaInfo().representationCount;
        for (i = 0; i < bitrateLevelCount; i += 1) {
            bitrates.push(rulesContext.getMediaInfo().bitrateList[i].bandwidth / 1000);
        }

        if(bufferLevel <= THRESHOLD_R) {
            q = 0;
        } else {
            let stepCount = bitrates.length;
            let step = Math.floor((THRESHOLD_BM - THRESHOLD_R) / stepCount);
            let index = Math.floor((bufferLevel - THRESHOLD_R) / step);
            q = index;
        }

        if(q < 0) {
            q = 0;
        } else if(q > bitrateLevelCount - 1) {
            q = bitrateLevelCount - 1;
        }

        //  로그
//        let msg = "[TAG] ";
        // msg += bitrates + "\n";
        // msg += "throughput = " + (throughput) + "\n";
        // msg += "latency = " + (latency) + "\n";
        // msg += "quality = " + q + "\n";
        // msg += "buffer = " + bufferLevel + "\n";
//        msg += "history = " + bitrateHistory + "\n";
//        console.log(msg);

        if(print === 1) {
            let msg;
            msg = "";
            msg += "buffer_occupancy_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "buffer_occupancy_y = [" + bufferHistory.toString() + "]" + "\n"

            msg += "throughput_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "throughput_y = [" + throughputHistory.toString() + "]" + "\n"

            msg += "bitrate_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "bitrate_y = [" + bitrateHistory.toString() + "]" + "\n"

            msg += "draw_plot(buffer_occupancy_x, buffer_occupancy_y, throughput_x, throughput_y, bitrate_x, bitrate_y)" + "\n";

            msg += "print('throughput avg = ' + str(np.average(throughput_y)))" + "\n";
            msg += "print('bitrate avg = ' + str(np.average(bitrate_y)))";

            console.log(msg);
        }


        timeHistory.push(new Date().getTime() / 1000 - startTime);
        throughputHistory.push(isNaN(throughput / 1000) ? 0 : throughput / 1000);
        bitrateHistory.push(bitrates[q] / 1000);
        bufferHistory.push(bufferLevel);

        return SwitchRequest(context).create(q, {name : BBARuleClass.__dashjs_factory_name},  p);
    }

    /**
     * throughput을 넘지 않는 최대 bitrate level의 index를 구한다.
     * @param  {Array} bitrates                  해당하는 비디오가 지원하는 bitrate.
     * @param  {Number} throughput                현재 throughput or bandwidth.(kbps)
     * @param  {Number} [adjustment_throughput=1] throughput을 보정할 수치.
     * @param  {Number} [adjustment_index=0]      bitrate level을 보정할 수치.
     * @return {Number}                           [description]
     */
    function maxBitrateIndex(bitrates, throughput, adjustment_throughput = 1, adjustment_index = 0) {
        let i;
        let count = bitrates.length;
        for (i = count - 1; i > 0; i -= 1) {
            if (throughput * adjustment_throughput> bitrates[i]) {
                break;
            }
        }

        i += adjustment_index;
        if(i < 0) {
            i = 0;
        } else if(i > count - 1) {
            i = count - 1;
        }

        return i;
    }

    /**
     * throughput에 가장 근접한 bitrate의 index를 반환한다.
     * @param  {Array} bitrates   해당하는 비디오가 지원하는 bitrtate.
     * @param  {Number} throughput 현재 throughput or bandwidth.(kbps)
     * @return {Number}            bitrate index.
     */
    function bitrateNearest(bitrates, throughput) {
        let indexDeltaMin;
        let deltaMin = Number.MAX_SAFE_INTEGER;
        let i;

        for(i = 0; i < bitrates.length; i++) {
            let delta = Math.abs(bitrates[i] - throughput);
            if(delta < deltaMin) {
                deltaMin = delta;
                indexDeltaMin = i;
            }
        }

        return indexDeltaMin;
    }

    /**
     * 청크사이즈에 대한 부분을 수정해야할것으로 보임.
     * @param  {[type]} bufferOccupancy [description]
     * @param  {[type]} lastBitrate     [description]
     * @param  {[type]} nextBitrate     [description]
     * @return {[type]}                 [description]
     */
    function differQoE(bufferOccupancy, lastBitrate, nextBitrate) {
        let inputRate = lastBitrate / nextBitrate;
        let outputRate = 1;
        let deltaBuffer = inputRate - outputRate;
        let deltaQoE = Number.MAX_VALUE;

        if(deltaBuffer < 0) {
            let bfoc = bufferOccupancy; //  청크 사이즈
            let sustainTime = (bfoc - ALPHA + (BETA - ALPHA) * 0.5) / Math.abs(deltaBuffer);

            let qualityLast = quality(lastBitrate);
            let qualityNext = quality(nextBitrate);

            let qoe1Quality = qualityNext * sustainTime;    //  청크 사이즈
            let qoe1Boc = ((bfoc - ALPHA + (BETA - ALPHA) * 0.5) + bfoc) / 2 * sustainTime * DELTA;
            let qoe1QualityChange = Math.abs(qualityLast - qualityNext) * GAMMA;
            let qoe1 = qoe1Quality + qoe1Boc - qoe1QualityChange;

            let qoe2Boc = (bfoc + (bfoc + sustainTime * deltaBuffer)) / 2 * sustainTime * DELTA;
            let qoe2 = qualityLast * sustainTime / qoe2Boc; //  청크 사이즈
            let deltaQoE = qoe1 - qoe2;
        }

        return deltaQoE;
    }

    ////////////////////////////////////// [ QoE ] ////////////////////////////////

    /**
     * 특정 bitrate에 대한 quality 수치를 계산한다.
     * (현재 청크 사이즈를 구하는 방법을 몰라 이부분을 해결하면 추가 필요.)
     * @param  {[type]} bitrates 해당하는 비디오가 지원하는 bitrtate.
     * @param  {[type]} bitrate  quality 수치를 계산하고자하는 bitrate.
     * @return {[type]}          quality 수치.
     */
    function quality(bitrates, bitrate) {
        let min = bitrates[0];
        return Math.log(bitrates / min);
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

BBARuleClass.__dashjs_factory_name = 'BBARule';
BBARule = dashjs.FactoryMaker.getClassFactory(BBARuleClass);
