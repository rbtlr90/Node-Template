import { AppLogger } from '../../../src/logger';
import winston from 'winston';

describe('Model Logger Test', () => {
    let logger: AppLogger;

    test('logger init', () => {
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
            transports: [new winston.transports.Console()],
        };
        const globalLogger = winston.createLogger(option);
        logger = new AppLogger(globalLogger);
        expect(logger.loggerName).toEqual('App');
        expect(logger.info).toBeInstanceOf(Function);
        expect(logger.error).toBeInstanceOf(Function);
        expect(logger.debug).toBeInstanceOf(Function);
        expect(logger.warn).toBeInstanceOf(Function);
    });

    test('info', () => {
        // @ts-ignore
        console._stdout.write = jest.fn();
        logger.info('info', { a: 3, b: 'B' });

        // @ts-ignore
        expect(console._stdout.write.mock.calls[0][0]).toMatch('info');
    });

    test('warn', () => {
        //@ts-ignore
        console._stdout.write = jest.fn();
        logger.warn('warn', { a: 3, b: 'B' });

        // @ts-ignore
        expect(console._stdout.write.mock.calls[0][0]).toMatch('warn');
    });

    test('error', () => {
        //@ts-ignore
        console._stdout.write = jest.fn();
        logger.error('error', { a: 3, b: 'B' });

        // @ts-ignore
        expect(console._stdout.write.mock.calls[0][0]).toMatch('error');
    });

    test('debug', () => {
        //@ts-ignore
        console._stdout.write = jest.fn();
        logger.debug('debug', { a: 3, b: 'B' });

        // @ts-ignore
        expect(console._stdout.write.mock.calls[0][0]).toMatch('debug');
    });
});

describe('', () => {
    it('', () => {
        expect(1 + 1).toBe(2);
    });
});