/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WhatsAppSessionModel } from '../../db/mongodb';
import { IWhatsAppSessionAttributes, IWhatsAppSessionDocument } from '../../interfaces';
import { IWhatsAppSessionService } from '../contracts';
import { MongooseCommonService } from './mongooseCommonService';
import mongoose from 'mongoose';
import qrcode from 'qrcode';
import axios from 'axios';
import { Client, RemoteAuth, MessageMedia } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import { WHATSAPP_STATUS } from '../../constants';

type ClientMap = Map<string, Client>;

export class WhatsAppSessionService
  extends MongooseCommonService<IWhatsAppSessionAttributes, IWhatsAppSessionDocument>
  implements IWhatsAppSessionService
{
  private clients: ClientMap = new Map();
  private store: typeof MongoStore;

  constructor() {
    super(WhatsAppSessionModel);
    this.store = new MongoStore({ mongoose });
  }

  createClient = async (clientId: string, opts?: { headless?: boolean; puppeteerArgs?: string[] }) => {
    if (this.clients.has(clientId)) return this.clients.get(clientId)!;

    const client = new Client({
      authStrategy: new RemoteAuth({
        store: this.store,
        clientId,
        backupSyncIntervalMs: 60 * 1000,
      }),
      puppeteer: {
        headless: opts?.headless ?? true,
        args: opts?.puppeteerArgs ?? ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    const whatsAppSession = await this.findOne({ clientId });
    if (!whatsAppSession) {
      await this.create({ clientId, status: WHATSAPP_STATUS.STARTING });
    } else {
      await this.updateOne({ clientId }, { status: WHATSAPP_STATUS.STARTING });
    }

    client.on('qr', async () => {
      await this.updateOne({ clientId }, { status: WHATSAPP_STATUS.QR });
    });

    client.on('ready', async () => {
      await this.updateOne({ clientId }, { status: WHATSAPP_STATUS.CONNECTED });
    });

    client.on('authenticated', async () => {
      await this.updateOne({ clientId }, { status: WHATSAPP_STATUS.CONNECTED });
    });

    client.on('auth_failure', async () => {
      await this.updateOne({ clientId }, { status: WHATSAPP_STATUS.FAILED });
    });

    client.on('disconnected', async () => {
      await this.updateOne({ clientId }, { status: WHATSAPP_STATUS.FAILED });
    });

    await client.initialize();
    this.clients.set(clientId, client);
    return client;
  };

  rehydrateAll = async (waitForReadyMs = 30000) => {
    const docs = await this.findAll({});
    for (const d of docs) {
      try {
        const client = await this.createClient(d.clientId);
        try {
          await this.waitForReady(client, waitForReadyMs);
          console.log(`Rehydrated and ready: ${d.clientId}`);
        } catch (e) {
          console.log(`Rehydrated (not ready yet) for ${d.clientId}: ${String(e)}`);
        }
      } catch (e) {
        console.warn('rehydrate failed for', d.clientId, e);
      }
    }
  };

  waitForReady = (client: Client, timeoutMs = 30000): Promise<void> => {
    return new Promise((resolve, reject) => {
      let done = false;

      const onReady = () => {
        if (done) return;
        done = true;
        cleanup();
        resolve();
      };

      const onAuth = () => {
        if (done) return;
        done = true;
        cleanup();
        resolve();
      };

      const onAuthFail = (err: any) => {
        if (done) return;
        done = true;
        cleanup();
        reject(new Error('auth_failure:' + String(err)));
      };

      const cleanup = () => {
        client.removeListener('ready', onReady);
        client.removeListener('authenticated', onAuth);
        client.removeListener('auth_failure', onAuthFail);
        if (timeout) clearTimeout(timeout);
      };

      client.on('ready', onReady);
      client.on('authenticated', onAuth);
      client.on('auth_failure', onAuthFail);

      const timeout = setTimeout(() => {
        if (done) return;
        done = true;
        cleanup();
        reject(new Error('waitForReady timeout'));
      }, timeoutMs);
    });
  };

  getOrCreateClient = async (clientId: string, waitForReady = false, waitMs = 30000) => {
    if (this.clients.has(clientId)) {
      const c = this.clients.get(clientId)!;
      if (waitForReady) await this.waitForReady(c, waitMs).catch(() => {});
      return c;
    }

    const client = await this.createClient(clientId);
    if (waitForReady) await this.waitForReady(client, waitMs);

    return client;
  };

  generateQrDataUrl = async (clientId: string, timeoutMs = 20000): Promise<string> => {
    const client = await this.getOrCreateClient(clientId);

    return new Promise<string>((resolve, reject) => {
      let timeout: NodeJS.Timeout | null = null;

      const qrHandler = async (qr: string) => {
        try {
          const dataUrl = await qrcode.toDataURL(qr);
          cleanup();
          resolve(dataUrl);
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      const readyHandler = () => {
        cleanup();
        reject(new Error('Client already ready / no QR required'));
      };

      const errHandler = (e: Error) => {
        cleanup();
        reject(e);
      };

      const cleanup = () => {
        client.removeListener('qr', qrHandler);
        client.removeListener('ready', readyHandler);
        client.removeListener('auth_failure', errHandler);
        if (timeout) clearTimeout(timeout);
      };

      client.on('qr', qrHandler);
      client.on('ready', readyHandler);
      client.on('auth_failure', errHandler);

      timeout = setTimeout(() => {
        cleanup();
        reject(new Error('QR timeout'));
      }, timeoutMs);
    });
  };

  private normalizeWhatsAppId = (to: string) => {
    to = to.trim();
    if (to.endsWith('@c.us') || to.endsWith('@g.us')) return to;
    const numeric = to.replace(/\D/g, '');
    if (!numeric) throw new Error('invalid phone number');
    return `${numeric}@c.us`;
  };

  sendMessage = async (
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
  ) => {
    if (!clientId) throw new Error('clientId required');
    if (!to) throw new Error('recipient required');

    const sessionDoc = await this.findOne({ clientId });
    if (!sessionDoc) throw new Error('session not found');

    let client = this.clients.get(clientId);
    if (!client) {
      client = await this.getOrCreateClient(
        clientId,
        !!opts?.waitForReadyOnLazy,
        opts?.waitMs ?? 30000
      ).catch((e) => {
        throw new Error('failed to restore client on-demand: ' + (e?.message ?? String(e)));
      });
    }

    const fresh = await this.findOne({ clientId });
    if (!fresh || fresh.status !== WHATSAPP_STATUS.CONNECTED) {
      throw new Error('session not connected');
    }

    const toId = this.normalizeWhatsAppId(to);

    if (opts?.mediaUrl) {
      try {
        const res = await axios.get(opts.mediaUrl, {
          responseType: 'arraybuffer',
        });

        const buffer = Buffer.from(res.data);
        const b64 = buffer.toString('base64');
        const mime = res.headers['content-type'] || opts.mimeType || 'application/octet-stream';
        const filename = opts.filename || 'file';

        const media = new MessageMedia(mime, b64, filename);
        const sent = await client.sendMessage(toId, media, { caption: message });

        return { id: sent.id?.id ?? null, raw: sent };
      } catch (e: any) {
        throw new Error('mediaUrl fetch failed: ' + e.message);
      }
    }

    if (opts?.mediaBase64) {
      if (!opts.mimeType || !opts.filename) throw new Error('mimeType and filename required for mediaBase64');

      const media = new MessageMedia(opts.mimeType, opts.mediaBase64, opts.filename);
      const sent = await client.sendMessage(toId, media, { caption: message });

      return { id: sent.id?.id ?? null, raw: sent };
    }

    if (!message) throw new Error('message required when not sending media');

    const sent = await client.sendMessage(toId, message);
    return { id: sent.id?.id ?? null, raw: sent };
  };

  destroySession = async (clientId: string) => {
    const client = this.clients.get(clientId);

    if (client) {
      try {
        await client.destroy();
      } catch (e) {}
      this.clients.delete(clientId);
    }

    const collNames = (await mongoose?.connection?.db?.listCollections().toArray()) || [];

    for (const c of collNames.map((c) => c.name)) {
      if (c.includes('wwebjs') || c.includes('whatsapp')) {
        try {
          await mongoose?.connection?.db?.collection(c).deleteMany({ clientId });
        } catch (e) {}
      }
    }

    await this.delete({ clientId });
  };
}
