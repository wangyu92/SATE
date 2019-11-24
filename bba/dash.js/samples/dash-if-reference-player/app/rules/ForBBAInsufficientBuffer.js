let ForBBAInsufficientBufferRule;

function ForBBAInsufficientBufferRuleClass() {

    let context = this.context;
    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');

    var dryBufferHits = 0;
    var DRY_BUFFER_LIMIT = 3;

    function getMaxIndex(rulesContext) {

        var playlist;
        var trace;
        var shift = false;
        var p = SwitchRequest.PRIORITY.DEFAULT;
        var q = 0;

        let metricsModel = MetricsModel(context).getInstance();
        let dashMetrics = DashMetrics(context).getInstance();
        let mediaType = rulesContext.getMediaInfo().type;
        let metrics = metricsModel.getReadOnlyMetricsFor(mediaType);

        console.log("Checking insufficient buffer rule...");

        console.log(metrics.PlayList);

        if (metrics.PlayList === null || metrics.PlayList === undefined || metrics.PlayList.length === 0) {
            console.log("Not enough information for rule.");
            return SwitchRequest(context).create();
        }

        console.log("!!!!!!!!!!!!!!!!!!!!!!!");

        return SwitchRequest(context).create(q, {name : ForBBAInsufficientBufferRuleClass.__dashjs_factory_name},  p);
    }

    const instance = {
        getMaxIndex: getMaxIndex
    };
    return instance;
}

ForBBAInsufficientBufferRuleClass.__dashjs_factory_name = 'ForBBAInsufficientBufferRule';
ForBBAInsufficientBufferRule = dashjs.FactoryMaker.getClassFactory(ForBBAInsufficientBufferRuleClass);
