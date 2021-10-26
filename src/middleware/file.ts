import multer from 'multer';
import { ApplicationError } from '../error';
import { Request, Response, NextFunction } from 'express';

export const fileHandler = (fileName: string, option: multer.Options) => {
    const upload = multer(option).single(fileName);
    return (req: Request, res: Response, next: NextFunction) => {
        //@ts-ignore
        upload(req, res, (err: Error) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        next(new ApplicationError(400, 'FILE_EXCEED_SIZE_LIMIT'));
                    } else {
                        next(new ApplicationError(400, 'BAD_REQUEST'));
                    }
                } else next(err);
            } else next();
        });
    };
};