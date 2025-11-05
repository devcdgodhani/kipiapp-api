import sgMail from '@sendgrid/mail';
import nodemailer, { Transporter } from 'nodemailer';
import { ENV_VARIABLE } from '../configs/env';
import { IEmailOptions } from '../interfaces/common';

export const sendEmail = async (emailOptions: IEmailOptions): Promise<void> => {
  if (!emailOptions.from) emailOptions.from = ENV_VARIABLE.SMTP_EMAIL;

  if (ENV_VARIABLE.NODE_ENV === 'production') {
    // Use SendGrid
    try {
      sgMail.setApiKey(ENV_VARIABLE.SEND_GRID_API_KEY);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg: any = {
        to: emailOptions.to,
        from: {
          email: ENV_VARIABLE.SEND_GRID_FROM_EMAIL,
          name: ENV_VARIABLE.SEND_GRID_FROM_NAME,
        },
        subject: emailOptions.subject,
        text: emailOptions.text,
        html: emailOptions.html,
      };

      await sgMail.send(msg);
      console.log('Email sent from send grid')
    } catch (err) {
      console.error('SendGrid email error:', err);
      throw err;
    }
  } else {
    // Use SMTP for non-production
    try {
      const transporter: Transporter = nodemailer.createTransport({
        host: ENV_VARIABLE.SMTP_SERVER,
        port: ENV_VARIABLE.SMTP_PORT,
        secure: ENV_VARIABLE.SMTP_PORT === 465, // true for 465, false for others
        auth: {
          user: ENV_VARIABLE.SMTP_USER,
          pass: ENV_VARIABLE.SMTP_PASS,
        },
      });

      await transporter.sendMail(emailOptions);
      console.log('Email sent from smtp')
    } catch (err) {
      console.error('SMTP email error:', err);
      throw err;
    }
  }
};
