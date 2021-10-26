import { Request, Response, NextFunction } from 'express';
import { AppLogger } from '../logger';

interface EndpointFilterDescriptor {
    [path: string]: {
        [method: string]: string[];
    };
}

const reqBodyToFilter: EndpointFilterDescriptor = {
};

const getBodyForLogConstructor = () => {
    return (req: Request) => {
        const method = req.method.toUpperCase();
        const shouldFilter = reqBodyToFilter[req.path] && reqBodyToFilter[req.path][method];
        if (shouldFilter) {
            const keysToFilter = reqBodyToFilter[req.path][method];
            const filtered: { [key: string]: string } = {};
            for (const key of keysToFilter) {
                if (req.body[key]) {
                    filtered[key] = 'non-encrypted-password';
                }
            }
            return { ...req.body, ...filtered };
        }
        return req.body;
    };
};

export const loggingMiddleware = async (appLogger: AppLogger) => {
    const getBodyForLog = getBodyForLogConstructor();
    return (req: Request, res: Response, next: NextFunction) => {
        const end = res.end;

        res.end = function (...args: any[]) {
            res.end = end;
            res.end(...args);
            //@ts-ignore
            const isJson = res.getHeader('content-type') && res.getHeader('content-type').indexOf('json') >= 0;
            let resBody!: string;
            if (args.length >= 1 && isJson) {
                const chunk = args[0];
                resBody = chunk.toString();
            }
            appLogger.info('', {
                req: {
                    url: req.url,
                    method: req.method,
                    body: getBodyForLog(req),
                },
                res: {
                    status: res.statusCode,
                    body: resBody ? resBody : {},
                },
            });
        };
        next();
    };
};