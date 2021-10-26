
import { Request, Response, NextFunction, Router } from 'express';
import { asyncHandler, isUUID } from './utils';
import { DefaultService } from '../service';
import { ApplicationError } from '../error';

export const defaultRouter = (defaultService: DefaultService) : Router => {
    const defaultRouter = Router({mergeParams: true});

    defaultRouter.get(
        '/',
        asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
            try{
                const helloWorld = await defaultService.getHelloWorld();
                return res.send(helloWorld);
            } catch(err){
                throw err;
            }
        })
    )

    return defaultRouter;
}