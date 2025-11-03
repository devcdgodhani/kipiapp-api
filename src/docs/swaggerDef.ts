import { ENV_VARIABLE } from "../configs";

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'Api Documentation',
        version: '1.0.0',
        license: {
            name: '',
        },
    },
    servers: [
        {
            url:
                ENV_VARIABLE.NODE_ENV === 'local' || ENV_VARIABLE.NODE_ENV === 'development'
                    ? `http://localhost:${ENV_VARIABLE.PORT}/api/v1`
                    : ENV_VARIABLE.SERVER_URL + '/api/v1',
        },
    ],
};

export default swaggerDef;
