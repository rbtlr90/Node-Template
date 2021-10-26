import { Knex } from 'knex';
import winston from 'winston';
import { Router } from 'express';
import { loggingMiddleware, errorHandler } from './middleware';
import { ServiceLogger, ModelLogger, AppLogger } from './logger';
import { defaultRouter } from './controller';
import { DefaultService, Service } from './service';

export const loadMiddlewares = async (logger: winston.Logger) => {
    const appLogger = new AppLogger(logger);
    return {
        logger: await loggingMiddleware(appLogger),
        errorHandler: errorHandler(appLogger),
    };
};

export const loadRoutes = async (pgClient: Knex, logger: winston.Logger): Promise<{ [routerName: string]: Router }> => {
    const defaultService : DefaultService = new DefaultService(new ServiceLogger('defaultService', logger));

    return {
        defaultController: defaultRouter(defaultService)
    };
}