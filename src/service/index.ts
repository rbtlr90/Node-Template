   
import { ServiceLogger } from '../logger';

export abstract class Service {
    logger: ServiceLogger;
    constructor(logger: ServiceLogger) {
        this.logger = logger;
    }
}

export class CustomError extends Error {
    constructor(private statusCode: number, message?: string) {
        super(message);
        this.name = 'CustomError';
    }
}

export * from './defaultService';