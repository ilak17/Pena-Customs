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

exports.sendStatusEmail = async ({ reserveStatus, reserveSKU, reserveEndTime, clientEmail, clientName }) => {
    try {
        let subject;
        let mail;

        switch (reserveStatus) {

            case "pending": {
                subject = "Recebemos o seu pedido de reparação";
                mail = reserveStatusTemplate.repairPendingEmail({ clientName, reserveSKU });
                break;
            }

            case "confirmed": {
                subject = "Reparação Confirmada";
                mail = reserveStatusTemplate.repairConfirmedEmail({ clientName, reserveSKU, reserveEndTime });
                break;
            }

            case "running": {
                subject = "Reparação em Execução";
                mail = reserveStatusTemplate.repairRunningEmail({ clientName, reserveSKU });
                break;
            }

            case "waiting": {
                subject = "Reparação em Espera";
                mail = reserveStatusTemplate.repairWaitingEmail({ clientName, reserveSKU });
                break;
            }

            case "completed": {
                subject = "Reparação Concluída";
                mail = reserveStatusTemplate.repairCompletedEmail({ clientName, reserveSKU });

                const reserve = await Reserve.findOne({ sku: reserveSKU })
                    .populate('clientID')
                    .populate('serviceID');

                const pdfPath = await pdfUtil.generateClientRepairReportPDF(reserve);

                await univUtils.sendEmail(clientEmail, subject, mail, pdfPath);
                return;
            }

            case "cancelled": {
                subject = "Reparação Cancelada";
                mail = reserveStatusTemplate.repairCancelledEmail({ clientName, reserveSKU });
                break;
            }

            default: {
                throw new Error(`Estado de reparação desconhecido: ${reserveStatus}`);
            }
        }

        await univUtils.sendEmail(clientEmail, subject, mail);

    } catch (err) {
        console.log(err);
        throw new Error("Erro ao enviar email");
    }
};