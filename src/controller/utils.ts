import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

export function isUUID(str: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
}

export function isString(str: any) {
    return typeof str === 'string';
}

export function isBoolean(bool: boolean) {
    return typeof bool === 'boolean';
}

export function isPassword(pwd: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*,.?])[A-Za-z\d!@#$%^&*,.?]{8,}$/.test(pwd);
}