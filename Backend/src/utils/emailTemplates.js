exports.passwordResetEmail = ({ userName, resetLink }) => {
    return `
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Alteração de Password - Pena Customs</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                    <div style="background-color: #212121; padding: 20px; text-align: center;">
                        <img 
                        src="https://i.imgur.com/Gkse9Ig.png" 
                        alt="Pena Customs Logo" 
                        style="max-width: 160px; height: auto;" 
                        />
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color:rgb(146, 40, 26); margin-top: 0; text-align: center;">Alteração de Password</h2>
                        <p style="line-height: 1.6; margin-bottom: 20px;">
                            Olá, <strong>${userName}</strong>!
                        </p>
                        <p style="line-height: 1.6; margin-bottom: 20px;">
                            Recebemos um pedido para alterar a sua password na <strong>Pena Customs</strong>.
                            Clique no botão abaixo para definir uma nova password. Se não foi você quem solicitou, pode ignorar este email.
                        </p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                        <a 
                            href="${resetLink}" 
                            style="
                                display: inline-block; 
                                padding: 12px 24px; 
                                background-color:rgb(146, 40, 26); 
                                color: #FFFFFF; 
                                text-decoration: none; 
                                font-weight: bold; 
                                border-radius: 5px;
                            "
                        >
                            Alterar Password
                        </a>
                        </div>
                        
                        <p style="line-height: 1.6; margin-bottom: 20px;">
                            Caso não consiga clicar no botão, copie e cole o seguinte link no seu navegador:
                            <br/>
                            <a href="${resetLink}" style="color:rgb(146, 40, 26)">
                                ${resetLink}
                            </a>
                        </p>
                        
                        <p style="line-height: 1.6;">
                            Obrigado,<br/>
                            Equipa <strong>Pena Customs</strong>
                        </p>
                    </div>
                    <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                        <p style="margin: 0;">
                            &copy; <span style="color:rgb(146, 40, 26);">Pena Customs</span> — Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;    
};

exports.confirmRegistrationEmail = ({ userName, verifyLink }) => {
    return `
        <html>
            <head>
            <meta charset="UTF-8" />
            <title>Confirmação de Registo - Pena Customs</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #FDF9F4; font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E5DF;">
                <div style="background-color: #212121; padding: 20px; text-align: center;">
                <img 
                    src="https://i.imgur.com/Gkse9Ig.png" 
                    alt="Pena Customs Logo" 
                    style="max-width: 160px; height: auto;" 
                />
                </div>
                <div style="padding: 30px;">
                <h2 style="color:rgb(146, 40, 26); margin-top: 0; text-align: center;">Bem-vindo à Pena Customs</h2>
                <p style="line-height: 1.6; margin-bottom: 20px;">
                    Olá, <strong>${userName}</strong>!
                </p>
                <p style="line-height: 1.6; margin-bottom: 20px;">
                    Obrigado por se registar na <strong>Pena Customs</strong>.
                    Por favor, confirme o seu email clicando no botão abaixo.
                </p>
                <div style="text-align: center; margin: 25px 0;">
                    <a 
                    href="${verifyLink}" 
                    style="display: inline-block; padding: 12px 24px; background-color:rgb(146, 40, 26); color: #FFFFFF; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Confirmar Registo
                    </a>
                </div>
                <p style="line-height: 1.6; margin-bottom: 20px;">
                    Caso não consiga clicar no botão, copie e cole o seguinte link no seu navegador:
                    <br/>
                    <a href="${verifyLink}" style="color: #AC2323;">
                    ${verifyLink}
                    </a>
                </p>
                <p style="line-height: 1.6;">
                    Estamos entusiasmados por tê-lo connosco!<br/>
                    Equipa <strong>Pena Customs</strong>
                </p>
                </div>
                <div style="background-color: #F0ECE6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p style="margin: 0;">
                    &copy; <span style="color: #AC2323;">Pena Customs</span> — Todos os direitos reservados.
                </p>
                </div>
            </div>
            </body>
        </html>
    `;
};