import { DefaultService } from '../../../src/service';
import { ModelResult } from '../../../src/types';

describe('defaultService.ts', () => {
    let defaultService: DefaultService;

    const now = new Date();
    const formatOutput = <T>(items: T[], numAffected?: number): ModelResult<T> => {
        return {
            ok: true,
            n: numAffected ? numAffected : items.length,
            items: items,
        };
    };

    beforeAll(async () => {
        const logger = {
            info: (message: any) => {},
            error: (message: any, error: Error) => {},
        };

        // @ts-ignore
        defaultService = new DefaultService(logger);
    });

    afterEach(async() => {
        jest.clearAllMocks();
    });

    describe('Hello World!', () => {
        it('shoud return hello world', async () => {
            const helloWorld = await defaultService.getHelloWorld();
            expect(helloWorld).toEqual('Hello World!');
        })
    })
});
