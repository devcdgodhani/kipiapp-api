// import sgMail from '@sendgrid/mail';
import { ENV_VARIABLE } from '../configs/env';
import { IEmailOptions } from '../interfaces/common';
import nodemailer, { Transporter } from 'nodemailer';

export const sendEmail = async (emailOptions: IEmailOptions): Promise<void> => {
  // Configure the transporter with type annotations
  const transporter: Transporter = nodemailer.createTransport({
    host: ENV_VARIABLE.SMTP_SERVER, // e.g., 'smtp.gmail.com' for Gmail
    port: ENV_VARIABLE.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: ENV_VARIABLE.SMTP_USER, // Your email address
      pass: ENV_VARIABLE.SMTP_PASS, // Your email password
    },
  });

  if (!emailOptions.from) emailOptions.from = ENV_VARIABLE.SMTP_EMAIL;

  try {
    // Send the email
    // emailOptions.to = [...emailOptions.to, 'developer@sarvopari.app'];
    const info = await transporter.sendMail(emailOptions);
    return info;
  } catch (err) {
    // Handle errors
    console.error('Error sending email:', err);
    throw err;
  }
};

// export const sendEmail = async (emailOptions: IEmailOptions): Promise<void> => {
//     try {
//         sgMail.setApiKey(ENV_VARIABLE.SEND_GRID_API_KEY);

//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const msg: any = {
//             to: emailOptions.to,
//             // from: {
//             //     email: ENV_VARIABLE.SENDGRID_FROM_EMAIL,
//             //     name: ENV_VARIABLE.SENDGRID_FROM_NAME,
//             // },
//             from: {
//                 email: 'dev.cdgodhani@gmail.com',
//                 name: 'VittaIQ App',
//             },
//             subject: emailOptions.subject,
//             text: emailOptions.text,
//             html: emailOptions.html,
//         };

//         await sgMail.send(msg);
//     } catch (err) {
//         throw err;
//     }
// };
