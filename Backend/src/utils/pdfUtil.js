const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateServiceReportPDF = (reportData, options = {}) => {
    const reportsDir = path.join(__dirname, '..', 'reports');

    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
    const filePath = path.join(reportsDir, `admin_relatorio_${formattedDateTime}.pdf`);

    const doc = new PDFDocument();
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        doc.pipe(fileStream)
            .on('finish', () => {
                console.log('PDF gerado em:', filePath);
                resolve(filePath);
            })
            .on('error', (err) => {
                console.log('Erro ao gerar o PDF:', err);
                reject(err);
            });

        // Logotipo da empresa
        const logoPath = path.join(__dirname, '..', 'assets', 'pena_customs_logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 20, { width: 100 }); // Ajuste da posição e tamanho do logo
        }

        doc.moveDown(2);
        doc.fontSize(22).font('Helvetica-Bold').text('Relatório de Serviços Prestados', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(`Data de Geração: ${day}/${month}/${year}`, { align: 'center' });

        // Intervalo de datas
        if (options.startDate || options.endDate) {
            const start = options.startDate ? new Date(options.startDate).toLocaleDateString() : '---';
            const end = options.endDate ? new Date(options.endDate).toLocaleDateString() : '---';
            doc.fontSize(11).fillColor('#444').text(`Período: ${start} até ${end}`, { align: 'center' });
        }

        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        if (reportData.length === 0) {
            doc.text('Nenhum dado encontrado para gerar o relatório.');
            doc.end();
            return;
        }

        let totalRevenue = 0;

        reportData.forEach(service => {
            // Adicionando fundo (bloco) para o nome do serviço
            doc.rect(50, doc.y, 500, 20).fill('#f0f0f0'); // Cor de fundo cinza claro
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text(service.name, 55, doc.y + 3); // Ajuste da posição do texto dentro do bloco

            doc.fontSize(12).font('Helvetica').fillColor('#000').text(`   - SKU: ${service.sku}`);
            doc.text(`   - Execuções: ${service.totalExecutions}`);
            doc.text(`   - Receita Total: €${service.totalRevenue}`);
            doc.text(`   - Tempo Médio: ${service.avgExecutionTime}`);

            if (service.executions && service.executions.length > 0) {
                // Cabeçalho da tabela
                doc
                  .moveDown(0.5)
                  .font('Helvetica-Bold')
                  .fontSize(11)
                  .fillColor('#000')
                  .text('    Execuções:', { underline: true });

                doc
                  .moveDown(0.3)
                  .font('Helvetica-Bold')
                  .fillColor('#444')
                  .text('        #', 70, doc.y, { continued: true })
                  .text('SKU da Reserva', 100, doc.y, { continued: true })
                  .text('Início / Fim', 250, doc.y);

                // Conteúdo da tabela
                doc.font('Helvetica').fontSize(10).fillColor('#000');
                service.executions.forEach((exec, index) => {
                    const format = (d) =>
                        `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

                    doc
                      .text(`        ${index + 1}`, 70, doc.y, { continued: true })
                      .text(exec.sku || '---', 100, doc.y, { continued: true })
                      .text(`${format(new Date(exec.startTime))} <--> ${format(new Date(exec.endTime))}`, 250, doc.y);
                });
            }

            // Adicionando espaçamento extra após a seção das execuções
            doc.moveDown(2); // Aumentando o espaçamento entre a seção de execuções e o próximo serviço

            totalRevenue += parseFloat(service.totalRevenue);
        });

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold').text('Total de Receita:');
        doc.fontSize(12).font('Helvetica').text(`€${totalRevenue.toFixed(2)}`);
        doc.end();
    });
};