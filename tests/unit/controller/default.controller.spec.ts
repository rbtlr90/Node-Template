import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { defaultRouter } from '../../../src/controller';

const now = new Date();

jest.mock('../../../src/middleware/jwtRequired', () => ({
    jwtRequired: jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
}));

const defaultServiceMock = {
    getHelloWorld: jest.fn(async() => {
        return 'Hello World!';
    })
}

describe('default.ts', () => {
    const app = express();
    app.use(express.json());
    app.use(
        '/',
        //@ts-ignore
        defaultRouter(defaultServiceMock)
    );

    app.use((err:Error, req:Request, res:Response, next: NextFunction) => {
        //@ts-ignore
        res.status(err.status || 500).send(err.message);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    
    it('should return hello world correctly', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toEqual('Hello World!');
    });
});