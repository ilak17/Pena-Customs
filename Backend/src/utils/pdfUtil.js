const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateServiceReportPDF = (reportData) => {
    const reportsDir = path.join(__dirname, '..', 'reports');
    
    // Verifica se a pasta de relatórios existe, senão cria
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
                resolve(filePath); // Resolve a promise com o caminho do arquivo
            })
            .on('error', (err) => {
                console.log('Erro ao gerar o PDF:', err);
                reject(err); // Rejeita a promise em caso de erro
            });

        doc.fontSize(18).text('Relatório de Serviços Prestados', { align: 'center' });
        doc.moveDown();

        if (reportData.length === 0) {
            console.log('Nenhum dado encontrado para gerar o relatório.');
        }

        reportData.forEach(service => {
            console.log(`Adicionando serviço: ${service.name}`);
            doc.fontSize(12).text(`• ${service.name}`);
            doc.text(`   - SKU: ${service.sku}`);
            doc.text(`   - Execuções: ${service.totalExecutions}`);
            doc.text(`   - Receita Total: €${service.totalRevenue}`);
            doc.text(`   - Tempo Médio: ${service.avgExecutionTime}`);
            doc.moveDown();
        });

        doc.end();
    });
};