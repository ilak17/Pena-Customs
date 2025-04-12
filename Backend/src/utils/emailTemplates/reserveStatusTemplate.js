exports.repairPendingEmail = ({ clientName, reserveSKU }) => {
    return `
        <html>
            <head><meta charset="UTF-8" /><title>Reparação Pendente - Pena Customs</title></head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/Gkse9Ig.png" alt="Pena Customs Logo" style="max-width: 160px; height: auto;" />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); text-align: center;">Reparação Pendente</h2>
                <p>Olá, <strong>${clientName}</strong>!</p>
                <p>Recebemos o seu pedido de reparação com o número <strong>${reserveSKU}</strong>.</p>
                <p>Estamos a analisar os detalhes e entraremos em contacto assim que possível para confirmar o agendamento.</p>
                <p>Obrigado por confiar na <strong>Pena Customs</strong>!</p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
        </html>
        `;
};

exports.repairConfirmedEmail = ({ clientName, reserveSKU, reserveEndTime }) => {
    console.log(clientName, reserveSKU, reserveEndTime);
    return `
        <html>
            <head><meta charset="UTF-8" /><title>Reparação Confirmada - Pena Customs</title></head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/Gkse9Ig.png" alt="Pena Customs Logo" style="max-width: 160px; height: auto;" />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); text-align: center;">Reparação Confirmada</h2>
                <p>Olá, <strong>${clientName}</strong>!</p>
                <p>A sua reparação com o número <strong>${reserveSKU}</strong> foi confirmada.</p>
                <p>A estimativa de conclusão é até <strong>${reserveEndTime}</strong>.</p>
                <p>Obrigado por confiar na <strong>Pena Customs</strong>!</p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
        </html>
    `;
};

exports.repairRunningEmail = ({ clientName, reserveSKU }) => {
    return `
        <html>
            <head><meta charset="UTF-8" /><title>Reparação em Andamento - Pena Customs</title></head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/Gkse9Ig.png" alt="Pena Customs Logo" style="max-width: 160px; height: auto;" />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); text-align: center;">Reparação em Andamento</h2>
                <p>Olá, <strong>${clientName}</strong>!</p>
                <p>A reparação com o número <strong>${reserveSKU}</strong> já se encontra em andamento.</p>
                <p>Estamos a tratar do seu equipamento com a máxima atenção e cuidado.</p>
                <p>Acompanhe o progresso na sua conta ou contacte-nos para mais informações.</p>
                <p>Obrigado pela sua confiança,<br/> Equipa <strong>Pena Customs</strong></p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
        </html>
    `;
};

exports.repairWaitingEmail = ({ clientName, reserveSKU }) => {
    return `
        <html>
            <head><meta charset="UTF-8" /><title>Reparação em Espera - Pena Customs</title></head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/Gkse9Ig.png" alt="Pena Customs Logo" style="max-width: 160px; height: auto;" />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); text-align: center;">Reparação em Espera</h2>
                <p>Olá, <strong>${clientName}</strong>!</p>
                <p>A sua reparação com o número <strong>${reserveSKU}</strong> está temporariamente em pausa.</p>
                <p>Estamos a aguardar peças ou condições necessárias para continuar a intervenção. Entraremos em contacto assim que houver novidades.</p>
                <p>Obrigado pela compreensão,<br/> Equipa <strong>Pena Customs</strong></p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
        </html>
    `;
};

exports.repairCompletedEmail = ({ clientName, reserveSKU }) => {
    return `
        <html>
            <head><meta charset="UTF-8" /><title>Reparação Concluída - Pena Customs</title></head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/Gkse9Ig.png" alt="Pena Customs Logo" style="max-width: 160px; height: auto;" />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); text-align: center;">Reparação Concluída</h2>
                <p>Olá, <strong>${clientName}</strong>!</p>
                <p>Temos boas notícias — a reparação com o número <strong>${reserveSKU}</strong> foi concluída com sucesso!</p>
                <p>Poderá agora levantar o seu automóvel, conforme preferido.</p>
                <p>Obrigado pela sua confiança,<br/> Equipa <strong>Pena Customs</strong></p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
        </html>
    `;
};

exports.repairCancelledEmail = ({ clientName, reserveSKU }) => {
    return `
        <html>
            <head><meta charset="UTF-8" /><title>Reparação Cancelada - Pena Customs</title></head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/Gkse9Ig.png" alt="Pena Customs Logo" style="max-width: 160px; height: auto;" />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); text-align: center;">Reparação Cancelada</h2>
                <p>Olá, <strong>${clientName}</strong>!</p>
                <p>A sua reparação com o número <strong>${reserveSKU}</strong> foi <strong>cancelada</strong>.</p>
                <p>Se tiver dúvidas ou desejar reagendar, não hesite em contactar-nos.</p>
                <p>Estamos à disposição,<br/> Equipa <strong>Pena Customs</strong></p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.</p>
                </div>
            </div>
            </body>
        </html>
    `;
};