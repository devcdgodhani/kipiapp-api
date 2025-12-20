import { ObjectId } from 'mongoose';
import { IDefaultAttributes } from './common';
import { WHATSAPP_STATUS, WHATSAPP_TYPE } from '../constants';

export interface IWhatsAppSessionAttributes extends IDefaultAttributes {
  id: ObjectId;
  clientId: string;
  status: WHATSAPP_STATUS;
  phone?: string;
  type?: WHATSAPP_TYPE;
  userId: string;
}

export interface IWhatsAppSessionDocument
  extends Omit<IWhatsAppSessionAttributes, 'id'>,
    Document {}
