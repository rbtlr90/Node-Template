import winston, { createLogger, transport, LoggerOptions, config, format } from 'winston';

export class AppLogger {
    loggerName: string;
    globalLogger: winston.Logger;

    constructor(globalLogger: winston.Logger) {
        this.globalLogger = globalLogger;
        this.loggerName = 'App';
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