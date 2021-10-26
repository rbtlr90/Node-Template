
import express, { Express, Request, Response, NextFunction } from 'express';
import knex from 'knex';
import winston from 'winston';
import { loadRoutes } from './loader';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const SILENCE_LOG = process.env.LOG_SILENT === 'true';

type TransportEnv = 'file' | 'console' | 'http' | 'stream';

const getTransports = (envStr: string) => {
    const transports: winston.transport[] = [];
    (envStr.split('_') as TransportEnv[]).forEach((t) => {
        if (t === 'file') {
            transports.push(new winston.transports.File({ filename: './logs/error.log', level: 'error', silent: SILENCE_LOG }));
            transports.push(new winston.transports.File({ filename: './logs/combined.log', silent: SILENCE_LOG }));
        } else if (t === 'console') {
            transports.push(new winston.transports.Console({ silent: SILENCE_LOG }));
        }
    });
    return transports;
};

const getLogger = () => {
    const option: winston.LoggerOptions = {
        levels: winston.config.npm.levels,
        level: 'debug',
        format: winston.format.combine(
            // format.cli(),
            winston.format.timestamp(),
            winston.format.metadata(),
            winston.format.colorize({ all: true }),
            winston.format.simple()
        ),
        // defaultMeta: { loggerName },
        transports: getTransports(process.env.LOG_TRANSPORTS as string),
    };
    return winston.createLogger(option);
};

const pgClient = knex({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST as string,
        port: parseInt(process.env.POSTGRES_PORT as string),
        user: process.env.POSTGRES_USER as string,
        password: process.env.POSTGRES_PW as string,
        database: process.env.POSTGRES_DB as string,
    },
    pool: { min: 0, max: 10 },
});




export default async () : Promise<Express> => {
    const loadMiddlewares = require('./loader').loadMiddlewares;
    const app = express();
    const urlPrefix = '/api/v1';

    const globalLogger = getLogger();
    const { logger, errorHandler } = await loadMiddlewares(globalLogger);

    const {
        defaultController
    } = await loadRoutes(pgClient, getLogger());
    
    // options for cors midddleware
    const options: cors.CorsOptions = {
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'X-Access-Token',
            'Authorization',
            'Access-Control-Request-Headers',
            'Access-Control-Allow-Headers',
            'x-custom-header',
            'Content-Range',
        ], // NOTE: 최소로 allow하기
        credentials: true,
        methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: [
        ],
        preflightContinue: false,
    };

    app.use(cors(options));
    // request parsing middlewares
    app.use(express.json({limit: '8mb'}));
    app.use(express.urlencoded({extended:true, limit: '8mb'}));
    app.use(cookieParser());
    // logging middleware
    app.use(logger);
    app.use(`/`, defaultController);
    app.use(`${urlPrefix}/`, defaultController);
    app.use(errorHandler);

    //@ts-ignore
    app.closeDbConnections = () => {
        pgClient.destroy();
    };
    return app;
}