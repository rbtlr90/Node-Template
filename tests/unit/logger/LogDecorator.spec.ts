//@ts-nocheck
import { Model } from '../../../src/model/model';
import { ModelLogger, ModelLog, IOPoint, ServiceLogger, ServiceLog } from '../../../src/logger';
import { convertToResult, createDeleteResult } from '../../../src/model/utils';
import { Service } from '../../../src/service';
import winston from 'winston';

class MockModel extends Model<number> {
    constructor(logger: ModelLogger) {
        super(logger);
    }

    @ModelLog(IOPoint.NFS)
    async createOne() {
        return convertToResult([1]);
    }

    @ModelLog(IOPoint.NFS)
    async getAll() {
        return convertToResult([1, 2, 3]);
    }

    @ModelLog(IOPoint.NFS)
    async getOne() {
        return convertToResult([1]);
    }

    @ModelLog(IOPoint.NFS)
    async deleteOne(id: string) {
        if (!id) {
            throw new Error('invalid id');
        }
        return createDeleteResult(1);
    }

    @ModelLog(IOPoint.NFS)
    async deleteAll(id: string) {
        if (!id) {
            throw new Error('invalid id');
        }
        return createDeleteResult(1);
    }

    @ModelLog(IOPoint.NFS)
    async updateOne(id: string) {
        if (!id) {
            throw new Error('invalid id');
        }
        return convertToResult(1);
    }

    @ModelLog(IOPoint.NFS)
    syncSuccess() {
        return 1;
    }

    @ModelLog(IOPoint.NFS)
    syncErrorTest() {
        throw new Error('Test Message1');
    }
}

class MockService extends Service {
    constructor(logger: ServiceLogger) {
        super(logger);
    }
    @ServiceLog()
    async fail() {
        throw new Error('fail');
    }

    @ServiceLog()
    async success() {
        return 1;
    }

    @ServiceLog()
    syncSuccess() {
        return 1;
    }

    @ServiceLog()
    syncFail() {
        throw new Error('Test Message2');
    }
}

describe('Model Log Decorator Test', () => {
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
    const logger = new ModelLogger('Test', globalLogger);

    const model: Model<number> = new MockModel(logger);

    test('Async Result Success', async () => {
        console._stdout.write = jest.fn();
        await model.getAll();
        expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
        expect(console._stdout.write.mock.calls[0][0]).toMatch('MockModel');
        expect(console._stdout.write.mock.calls[1][0]).toMatch('Success');
        expect(console._stdout.write.mock.calls[1][0]).toMatch('MockModel');
        expect(console._stdout.write.mock.calls[1][0]).toMatch(JSON.stringify([1, 2, 3]));
    });

    test('Async Result Fail', async () => {
        console._stdout.write = jest.fn();
        try {
            await model.deleteOne('');
        } catch (err) {
            expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
            expect(console._stdout.write.mock.calls[1][0]).toMatch('Failure');
            expect(err.message).toBe('invalid id');
        }
    });

    test('Sync Result Success', async () => {
        console._stdout.write = jest.fn();
        model.syncSuccess('');
        expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
        expect(console._stdout.write.mock.calls[1][0]).toMatch('Success');
    });

    test('Sync Failure Success', async () => {
        console._stdout.write = jest.fn();
        try {
            await model.syncErrorTest('');
        } catch (err) {
            expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
            expect(console._stdout.write.mock.calls[1][0]).toMatch('Failure');
            expect(err.message).toBe('Test Message1');
        }
    });
});

describe('Service Log Decorator Test', () => {
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
    const logger = new ServiceLogger('Test', globalLogger);

    const service: MockService = new MockService(logger);

    test('Result Success', async () => {
        console._stdout.write = jest.fn();
        await service.success();
        expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
        expect(console._stdout.write.mock.calls[1][0]).toMatch('Success');
    });

    test('Result Fail', async () => {
        console._stdout.write = jest.fn();
        try {
            await service.fail();
        } catch (err) {
            expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
            expect(console._stdout.write.mock.calls[1][0]).toMatch('Failure');
            expect(err.message).toBe('fail');
        }
    });

    test('Sync Result Success', () => {
        console._stdout.write = jest.fn();
        service.syncSuccess('');
        expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
        expect(console._stdout.write.mock.calls[1][0]).toMatch('Success');
    });

    test('Sync Failure Success', () => {
        console._stdout.write = jest.fn();
        try {
            service.syncFail('');
        } catch (err) {
            expect(console._stdout.write.mock.calls[0][0]).toMatch('Start');
            expect(console._stdout.write.mock.calls[1][0]).toMatch('Failure');
            expect(err.message).toBe('Test Message2');
        }
    });
});