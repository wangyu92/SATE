let MyBBARule;

function MyBBARuleClass() {

    const RESERVIOR = 5;
    const B_MAX = 30;

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let DashManifestModel = factory.getSingletonFactoryByName('DashManifestModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let Debug = factory.getSingletonFactoryByName('Debug');

    let context = this.context;
    let debug = Debug(context).getInstance();

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

        if(bufferLevel <= RESERVIOR) {
            q = 0;
        }

        else if(bufferLevel < B_MAX - RESERVIOR) {
            let stepCount = bitrates.length;
            let step = Math.floor((B_MAX - 2 * RESERVIOR) / stepCount);
            let index = Math.floor((bufferLevel - RESERVIOR) / step);
            q = index;
        }

        else {
            q = bitrateLevelCount - 1;
        }

        if(q < 0) {
            q = 0;
        } else if(q > bitrateLevelCount - 1) {
            q = bitrateLevelCount - 1;
        }

        if(print === 1) {
            let msg;
            msg = "";
            msg += "bba_bo_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "bba_bo_y = [" + bufferHistory.toString() + "]" + "\n"

            msg += "bba_th_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "bba_th_y = [" + throughputHistory.toString() + "]" + "\n"

            msg += "bba_br_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "bba_br_y = [" + bitrateHistory.toString() + "]" + "\n"

            msg += "draw_plot(bba_bo_x, bba_bo_y, bba_th_x, bba_th_y, bba_br_x, bba_br_y)" + "\n";

            msg += "print('throughput avg = ' + str(np.average(bba_th_y)))" + "\n";
            msg += "print('bitrate avg = ' + str(np.average(bba_br_y)))";

            if(isMulti) {
                msg = "";
                msg += "bba_bo_x = [" + timeHistory.toString() + "]" + "\n";
                msg += "bba_bo_y = [" + bufferHistory.toString() + "]" + "\n"

                msg += "bba_th_x = [" + timeHistory.toString() + "]" + "\n";
                msg += "bba_th_y = [" + throughputHistory.toString() + "]" + "\n"

                msg += "bba_br_x = [" + timeHistory.toString() + "]" + "\n";
                msg += "bba_br_y = [" + bitrateHistory.toString() + "]" + "\n"
            }

            console.log("BBA");
            console.log(msg);

            msg = "";
            msg += "bba_lt_x = [" + timeHistory.toString() + "]" + "\n";
            msg += "bba_lt_y = [" + latencyHistory.toString() + "]" + "\n";
            msg += "out_txt(latency)\n"
            msg += "print(np.average(latency))\n"
            msg += "print(len(latency))"

            console.log(msg);
        }


        timeHistory.push(new Date().getTime() / 1000 - startTime);
        throughputHistory.push(isNaN(throughput / 1000) ? 0 : throughput / 1000);
        bitrateHistory.push(bitrates[q] / 1000);
        bufferHistory.push(bufferLevel);
        if(!isNaN(latency)) {
            latencyHistory.push(latency);
        }

        return SwitchRequest(context).create(q, {name : MyBBARuleClass.__dashjs_factory_name},  p);
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

MyBBARuleClass.__dashjs_factory_name = 'MyBBARule';
MyBBARule = dashjs.FactoryMaker.getClassFactory(MyBBARuleClass);
