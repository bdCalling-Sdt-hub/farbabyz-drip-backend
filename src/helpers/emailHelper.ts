import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';

// const transporter = nodemailer.createTransport({
//   host: config.email.host,
//   port: Number(config.email.port),
//   secure: false,
//   auth: {
//     user: config.email.user,
//     pass: config.email.pass,
//   },
// });
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rifatkhan5567790@gmail.com',
    pass: 'ahvd mujs wtcr yssg',
  },
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"DOG_CLOTH" ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    logger.info('Mail send successfully', info.accepted);
  } catch (error) {
    errorLogger.error('Email', error);
  }
};

export const emailHelper = {
  sendEmail,
};
