const fs = require('fs');
const path = require('path');
const { generateServiceReportPDF } = require('../utils/pdfUtil');
const Reserve = require('../models/reserve');

// Gera um relatório em PDF com os serviços
exports.getServiceReportPDF = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Data de início e fim para o relatório (caso queira filtrar por data)
        const query = { status: 'completed' }; // Filtra apenas reservas concluídas

        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = new Date(startDate);
            if (endDate) query.startTime.$lte = new Date(endDate);
        }

        const reserves = await Reserve.find(query).populate('serviceID'); // Pega todas as reservas com os serviços populados

        const report = {}; // Objeto para armazenar os dados do relatório

        // Itera sobre as reservas e acumula os dados
        for (const reserve of reserves) {
            const duration = (new Date(reserve.endTime) - new Date(reserve.startTime)) / (1000 * 60); // em minutos

            for (const service of reserve.serviceID) {
                if (!report[service.name]) {
                    report[service.name] = {
                        serviceSKU: service.sku,
                        count: 0,
                        totalRevenue: 0,
                        totalTime: 0,
                        executions: [] 
                    };
                }

                report[service.name].count += 1;
                report[service.name].totalRevenue += service.price;
                report[service.name].totalTime += duration;

                report[service.name].executions.push({
                    startTime: reserve.startTime,
                    endTime: reserve.endTime
                });
            }
        }

        // Formata os dados para o PDF
        const finalReport = Object.entries(report).map(([name, data]) => ({
            name,
            sku: data.serviceSKU,
            totalExecutions: data.count,
            totalRevenue: data.totalRevenue.toFixed(2),
            avgExecutionTime: (data.totalTime / data.count).toFixed(2) + ' min',
            executions: reserves
                .filter(r => r.serviceID.some(s => s.name === name))
                .map(r => ({
                    startTime: r.startTime,
                    endTime: r.endTime,
                    sku: r.sku  // aqui adicionamos o SKU da reserva
                }))
        }));

        const pdfPath = await generateServiceReportPDF(finalReport, { startDate, endDate });
        const resolvedPath = path.resolve(pdfPath);

        // Verifica se o arquivo existe antes de tentar fazer o download
        fs.access(resolvedPath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log('Arquivo não encontrado:', resolvedPath);
                return res.status(500).json({ success: false, message: 'Erro: arquivo não encontrado' });
            }

            res.download(resolvedPath, (err) => {
                if (err) {
                    console.error('Erro ao fazer download do arquivo:', err);
                    res.status(500).json({ success: false, message: 'Erro ao fazer download do relatório' });
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Erro ao gerar relatório em PDF" });
    }
};