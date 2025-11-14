"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const bootstrap = async () => {
    await (0, db_1.connectDatabase)();
    const app = (0, app_1.createApp)();
    const server = (0, http_1.createServer)(app);
    server.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running in ${env_1.env.nodeEnv} mode on port ${env_1.env.port}`);
    });
};
void bootstrap();
