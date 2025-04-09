const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, html) => {

  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });

  await transporter.sendMail({
      from: `"Pena Customs" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
  });

};

exports.parseDuration = (input) => {
  try {
    const regex = /(?:(\d+)d)?-?(?:(\d+)h)?-?(?:(\d+)m)?/;

    const match = input.match(regex);
    if (!match) throw new Error();

    const [, d, h, m] = match.map(v => parseInt(v) || 0);

    return ((d * 24 * 60 * 60) + (h * 60 * 60) + (m * 60)) * 1000;

  } catch (err) {
    console.log(err);
    throw new Error("Formato inválido para duração. Use o formato: dd-hh-mm");
  }
};

