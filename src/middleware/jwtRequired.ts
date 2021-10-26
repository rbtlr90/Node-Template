import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../error';

export const jwtRequired = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET as string;
        const token = req.headers.authorization.split('Bearer ')[1];

        verify(token, accessTokenSecretKey, (err) => {
            if (err) {
                if (err.message === 'jwt expired') {
                    throw new ApplicationError(401, 'JWT_EXPIRED');
                } else {
                    throw new ApplicationError(401, 'JWT_ERROR');
                }
            } else {
                next();
            }
        });
    } else {
        throw new ApplicationError(401, 'JWT_ERROR');
    }
};