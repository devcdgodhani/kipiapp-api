/* eslint-disable @typescript-eslint/no-explicit-any */
import 'sequelize';

declare module 'sequelize' {
    interface DestroyOptions {
        userId?: string;
    }
    interface FindOptions {
        userId?: string;
        page?: number;
    }
    interface UpdateOptions {
        userId?: string;
        attributes?: any;
    }
    interface BulkCreateOptions {
        userId?: string;
    }
    interface CreateOptions {
        userId?: string;
    }
}
