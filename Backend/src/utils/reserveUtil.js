const Service = require('../models/service');
const univUtils = require('../utils/univUtil');

exports.calculateReserveData = async (serviceSKU, dateTime) => {

    const serviceIDs = [];
    let totalDuration = 0;
    let estimatedTime = 0;

    for (const sku of serviceSKU) {
        const service = await Service.findOne({sku: sku});
        if(!service) throw new Error(`Serviço com SKU ${sku} não encontrado`);
        serviceIDs.push(service._id);
        
        estimatedTime = univUtils.parseDuration(service.estimatedTime);
        totalDuration += estimatedTime;
    }

    totalDuration += univUtils.parseDuration(process.env.EXTRA_TIME);

    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + totalDuration);

    return {serviceIDs, startTime, endTime};
};