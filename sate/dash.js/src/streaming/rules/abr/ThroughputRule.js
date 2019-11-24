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
 */
import BufferController from '../../controllers/BufferController';
import AbrController from '../../controllers/AbrController';
import FactoryMaker from '../../../core/FactoryMaker';
import Debug from '../../../core/Debug';
import SwitchRequest from '../SwitchRequest';

function ThroughputRule(config) {

    config = config || {};
    const context = this.context;
    const log = Debug(context).getInstance().log;

    const metricsModel = config.metricsModel;
    const dashMetrics = config.dashMetrics;

    function checkConfig() {
        if (!metricsModel || !metricsModel.hasOwnProperty('getReadOnlyMetricsFor')) {
            throw new Error('Missing config parameter(s)');
        }
    }

    function getMaxIndex(rulesContext) {
        const switchRequest = SwitchRequest(context).create();

        if (!rulesContext || !rulesContext.hasOwnProperty('getMediaInfo') || !rulesContext.hasOwnProperty('getMediaType') || !rulesContext.hasOwnProperty('useBufferOccupancyABR') ||
            !rulesContext.hasOwnProperty('getAbrController') || !rulesContext.hasOwnProperty('getStreamProcessor')) {
            return switchRequest;
        }

        checkConfig();

        const mediaInfo = rulesContext.getMediaInfo();
        const mediaType = rulesContext.getMediaType();
        const metrics = metricsModel.getReadOnlyMetricsFor(mediaType);
        const streamProcessor = rulesContext.getStreamProcessor();
        const abrController = rulesContext.getAbrController();
        const streamInfo = rulesContext.getStreamInfo();
        const isDynamic = streamInfo && streamInfo.manifestInfo ? streamInfo.manifestInfo.isDynamic : null;
        const throughputHistory1 = abrController.getThroughputHistory();
        const throughput = throughputHistory1.getSafeAverageThroughput(mediaType, isDynamic);
        const latency = throughputHistory1.getAverageLatency(mediaType);
        const bufferStateVO = (metrics.BufferState.length > 0) ? metrics.BufferState[metrics.BufferState.length - 1] : null;
        const useBufferOccupancyABR = rulesContext.useBufferOccupancyABR();

        let bitrates = [];
        let bitrateLevelCount;
        let i;
        let bufferLevel = dashMetrics.getCurrentBufferLevel(metrics);

        if (!metrics || isNaN(throughput) || !bufferStateVO || useBufferOccupancyABR) {
            return switchRequest;
        }

        bitrateLevelCount = rulesContext.getMediaInfo().representationCount;
        for (i = 0; i < bitrateLevelCount; i += 1) {
            bitrates.push(rulesContext.getMediaInfo().bitrateList[i].bandwidth / 1000);
        }

        if (abrController.getAbandonmentStateFor(mediaType) !== AbrController.ABANDON_LOAD) {
            if (bufferStateVO.state === BufferController.BUFFER_LOADED || isDynamic) {
                switchRequest.quality = abrController.getQualityForBitrate(mediaInfo, throughput, latency);
                streamProcessor.getScheduleController().setTimeToLoadDelay(0);
                log('ThroughputRule requesting switch to index: ', switchRequest.quality, 'type: ',mediaType, 'Average throughput', Math.round(throughput), 'kbps');
                switchRequest.reason = {throughput: throughput, latency: latency};
            }
        }

        // timeHistory.push(new Date().getTime() / 1000 - startTime);
        // throughputHistory.push(isNaN(throughput / 1000) ? 0 : throughput / 1000);
        // bitrateHistory.push(bitrates[switchRequest.quality] / 1000);
        // bufferHistory.push(bufferLevel);

        // if(new Date().getTime() / 1000 - startTime > 120) {
        //     let msg;
        //     msg = "";
        //     msg += "buffer_occupancy_x = [" + timeHistory.toString() + "]" + "\n";
        //     msg += "buffer_occupancy_y = [" + bufferHistory.toString() + "]" + "\n"
        //
        //     msg += "throughput_x = [" + timeHistory.toString() + "]" + "\n";
        //     msg += "throughput_y = [" + throughputHistory.toString() + "]" + "\n"
        //
        //     msg += "bitrate_x = [" + timeHistory.toString() + "]" + "\n";
        //     msg += "bitrate_y = [" + bitrateHistory.toString() + "]" + "\n"
        //
        //     msg += "draw_plot(buffer_occupancy_x, buffer_occupancy_y, throughput_x, throughput_y, bitrate_x, bitrate_y)" + "\n";
        //
        //     msg += "print('throughput avg = ' + str(np.average(throughput_y)))" + "\n";
        //     msg += "print('bitrate avg = ' + str(np.average(bitrate_y)))";
        //
        //     console.log(msg);
        // }

        return switchRequest;
    }

    function reset() {
        // no persistent information to reset
    }

    const instance = {
        getMaxIndex: getMaxIndex,
        reset: reset
    };

    return instance;
}

ThroughputRule.__dashjs_factory_name = 'ThroughputRule';
export default FactoryMaker.getClassFactory(ThroughputRule);
