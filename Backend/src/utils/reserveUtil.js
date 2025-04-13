const Service = require('../models/service');
const univUtils = require('../utils/univUtil');
const reserveStatusTemplate = require('../utils/emailTemplates/reserveStatusTemplate');
const Reserve = require('../models/reserve');
const pdfUtil = require('../utils/pdfUtil');

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

exports.sendStatusEmail = async ({reserveStatus, reserveSKU, reserveEndTime, clientEmail, clientName}) => {
    try{
        switch (reserveStatus){

            case "pending": {
                console.log("AQUI1");
                const pendingMail = reserveStatusTemplate.repairPendingEmail({clientName, reserveSKU});
                await univUtils.sendEmail(
                    clientEmail,
                    "Alteração do estado da reparação",
                    pendingMail
                );
                console.log("EMAIL ENVIADO");

                break;
            }

            case "confirmed": {
                const confirmedMail = reserveStatusTemplate.repairConfirmedEmail({clientName, reserveSKU, reserveEndTime});
                await univUtils.sendEmail(
                    clientEmail,
                    "Alteração do estado da reparação",
                    confirmedMail
                );
                break;
            }
                
            case "running": {
                const runningMail = reserveStatusTemplate.repairRunningEmail({clientName, reserveSKU});
                await univUtils.sendEmail(
                    clientEmail,
                    "Alteração do estado da reparação",
                    runningMail
                );
                break;
            }
            
            case "waiting": {
                const repairWaitingMail = reserveStatusTemplate.repairWaitingEmail({clientName, reserveSKU});
                await univUtils.sendEmail(
                    clientEmail,
                    "Alteração do estado da reparação",
                    repairWaitingMail
                );
                break;
            }

            case "completed": {
                const completedMail = reserveStatusTemplate.repairCompletedEmail({clientName, reserveSKU});

                const reserve = await Reserve.findOne({ sku: reserveSKU })
                    .populate('clientID')
                    .populate('serviceID');

                const pdfPath = await pdfUtil.generateClientRepairReportPDF(reserve);
                
                await univUtils.sendEmail(
                    clientEmail,
                    "Alteração do estado da reparação",
                    completedMail,
                    pdfPath
                );
                break;
            }

            case "cancelled": {
                const cancelledMail = reserveStatusTemplate.repairCancelledEmail({clientName, reserveSKU});
                await univUtils.sendEmail(
                    clientEmail,
                    "Alteração do estado da reparação",
                    cancelledMail
                );
                break;
            }
        }

    }catch(err){
        console.log(err);
        throw new Error("Erro ao enviar email");
    }
};