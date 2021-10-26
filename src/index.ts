if (process.env.NODE_ENV !== 'production') {
    require('./config'); // this should be imported before importing any ohter files
}

import { Express } from 'express';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;

(async () => {
    try {
        const app: Express = await require('./app').default();
        const server = app
            .listen(PORT, () => {
                console.log(`
        ################################################
        🛡️  Server listening: http://127.0.0.1:${PORT} 🛡️
        ################################################
        `);
            })
            .on('error', (err: Error) => {
                console.error(err);
                process.exit(1);
            });

        process.on('SIGINT', () => {
            console.log('Received SIGINT, shutting down...');
            server.close();
            //@ts-ignore
            app.closeDbConnections();
            process.exit(130);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
