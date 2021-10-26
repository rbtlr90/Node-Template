import winston from 'winston';

export class ServiceLogger {
    service: string;
    globalLogger: winston.Logger;

    constructor(service: string, globalLogger: winston.Logger) {
        this.globalLogger = globalLogger;
        this.service = service;
    }

    public info(msg: string, meta?: any) {
        this.globalLogger.info(msg, meta);
    }

    public error(msg: string, meta?: any) {
        this.globalLogger.error(msg, meta);
    }

    public warn(msg: string, meta?: any) {
        this.globalLogger.warn(msg, meta);
    }

    public debug(msg: string, meta?: any) {
        this.globalLogger.debug(msg, meta);
    }
}