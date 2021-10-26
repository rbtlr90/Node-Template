/* eslint-disable @typescript-eslint/ban-ts-comment */

export enum ResultStatus {
    SUCCESS = 'Success',
    FAILURE = 'Failure',
    START = 'Start',
}

export enum IOPoint {
    MSGQUEUE = 'MsgQueue',
    MONGODB = 'MongoDB',
    PostgreSQL = 'PostgreSQL',
    NFS = 'NFS',
}

// Eslint is disabled because ModelLog is a decorator and should be written with UpperCamelCase according to out style guide,
// but @typescript-eslint/naming-convention does not support decorators
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ModelLog = (ioPoint: IOPoint): MethodDecorator => {
    return (target: Object, _propertyKey: string | Symbol, descriptor: PropertyDescriptor) => {
        const originalMethod: Function = descriptor.value;

        descriptor.value = function (...args: any[]): any {
            //@ts-ignore
            this.logger.info(ResultStatus.START, {
                ioPoint: ioPoint,
                model: target.constructor.name,
                method: originalMethod.name,
                args: args,
            });

            try {
                const result = originalMethod.apply(this, args);
                // for async methods
                if (result && result instanceof Promise) {
                    return result
                        .then((result) => {
                            //@ts-ignore
                            this.logger.info(ResultStatus.SUCCESS, {
                                model: target.constructor.name,
                                method: originalMethod.name,
                                result,
                            });
                            return result;
                        })
                        .catch((error: any) => {
                            //@ts-ignore
                            this.logger.error(ResultStatus.FAILURE, {
                                model: target.constructor.name,
                                method: originalMethod.name,
                                error,
                            });
                            throw error;
                        });
                } else {
                    //@ts-ignore
                    this.logger.info(ResultStatus.SUCCESS, {
                        model: target.constructor.name,
                        method: originalMethod.name,
                        result,
                    });
                    return result;
                }
            } catch (error) {
                //@ts-ignore
                this.logger.error(ResultStatus.FAILURE, {
                    model: target.constructor.name,
                    method: originalMethod.name,
                    error,
                });
                throw error;
            }
        };
        return descriptor;
    };
};

// Eslint is disabled because ModelLog is a decorator and should be written with UpperCamelCase according to out style guide,
// but @typescript-eslint/naming-convention does not support decorators
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ServiceLog = (): MethodDecorator => {
    return (target: Object, _propertyKey: string | Symbol, descriptor: PropertyDescriptor) => {
        const originalMethod: Function = descriptor.value;
        descriptor.value = function (...args: any[]) {
            //@ts-ignore
            this.logger.info(ResultStatus.START, {
                service: target.constructor.name,
                method: originalMethod.name,
                args: args,
            });
            try {
                const result = originalMethod.apply(this, args);

                if (result && result instanceof Promise) {
                    return result
                        .then((result) => {
                            //@ts-ignore
                            this.logger.info(ResultStatus.SUCCESS, {
                                model: target.constructor.name,
                                method: originalMethod.name,
                                result,
                            });
                            return result;
                        })
                        .catch((error: any) => {
                            //@ts-ignore
                            this.logger.error(ResultStatus.FAILURE, {
                                service: target.constructor.name,
                                method: originalMethod.name,
                                error,
                            });
                            throw error;
                        });
                } else {
                    //@ts-ignore
                    this.logger.info(ResultStatus.SUCCESS, {
                        model: target.constructor.name,
                        method: originalMethod.name,
                        result,
                    });
                    return result;
                }
            } catch (error) {
                //@ts-ignore
                this.logger.error(ResultStatus.FAILURE, {
                    model: target.constructor.name,
                    method: originalMethod.name,
                    error: error,
                });
                throw error;
            }
        };
        return descriptor;
    };
};