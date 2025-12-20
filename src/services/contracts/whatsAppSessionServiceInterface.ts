/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'whatsapp-web.js';
import { IWhatsAppSessionAttributes, IWhatsAppSessionDocument } from '../../interfaces';
import { IMongooseCommonService } from './mongooseCommonServiceInterface';

export interface IWhatsAppSessionService
  extends IMongooseCommonService<IWhatsAppSessionAttributes, IWhatsAppSessionDocument> {
  createClient(
    clientId: string,
    opts?: { headless?: boolean; puppeteerArgs?: string[] }
  ): Promise<Client>;

  rehydrateAll(waitForReadyMs?: number): Promise<void>;

  waitForReady(client: Client, timeoutMs?: number): Promise<void>;

  getOrCreateClient(clientId: string, waitForReady?: boolean, waitMs?: number): Promise<Client>;

  generateQrDataUrl(clientId: string, timeoutMs?: number): Promise<string>;

  sendMessage(
    clientId: string,
    to: string,
    message?: string,
    opts?: {
      mediaUrl?: string;
      mediaBase64?: string;
      filename?: string;
      mimeType?: string;
      waitForReadyOnLazy?: boolean;
      waitMs?: number;
    }
  ): Promise<{ id: string | null; raw: any }>;

  destroySession(clientId: string): Promise<void>;
}
