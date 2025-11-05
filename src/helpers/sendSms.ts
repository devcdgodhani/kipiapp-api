import { ENV_VARIABLE } from '../configs/env';
import { CARRIER_DOMAIN } from '../constants';
import { TSendSMSParams } from '../types';
import { sendEmail } from './sendEmail';

export const sendSMS = async (params: TSendSMSParams) => {
  const { phoneNumber, carrier, message } = params;

  const carrierDomain = CARRIER_DOMAIN[carrier];
  if (!carrierDomain) throw new Error(`Unsupported carrier: ${carrier}`);

  const smsEmail = `${phoneNumber}@${carrierDomain}`;
  try {
    await sendEmail({
      to: smsEmail,
      subject: '', // SMS usually ignores subject
      text: message,
      html: `<p>${message}</p>`,
      from: ENV_VARIABLE.SMTP_EMAIL,
    });

    console.log(`SMS sent to ${phoneNumber} via ${carrier}`);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
};
