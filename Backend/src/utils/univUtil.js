const nodemailer = require('nodemailer');
const path = require('path');

// Função para enviar e-mail
exports.sendEmail = async (to, subject, html, attachmentPath = null) => {

  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  const mailOptions = {
      from: `"Pena Customs" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
  };

  if (attachmentPath) {
    mailOptions.attachments = [{
      filename: path.basename(attachmentPath),
      path: attachmentPath
    }];
  }

  await transporter.sendMail(mailOptions);

};

// Funçao para validar o formato das datas e converter para milisegundos
exports.parseDuration = (input) => {
  try{
    const regex = /^(\d+d)?(?:-(\d+h))?(?:-(\d+m))?$|^(\d+h)?(?:-(\d+m))?$|^(\d+m)$/;
    
    if (!regex.test(input)) {
      throw new Error();
    }

    // Extrai os valores de dias, horas e minutos
    const dMatch = input.match(/(\d+)d/);
    const hMatch = input.match(/(\d+)h/);
    const mMatch = input.match(/(\d+)m/);

    const d = dMatch ? parseInt(dMatch[1]) : 0;
    const h = hMatch ? parseInt(hMatch[1]) : 0;
    const m = mMatch ? parseInt(mMatch[1]) : 0;

    return ((d * 24 * 60 * 60) + (h * 60 * 60) + (m * 60)) * 1000;

  }catch(err){
    console.log(err);
    throw new Error("Formato inválido para duração. Use o formato: ?d-?h-?m");
  }
};