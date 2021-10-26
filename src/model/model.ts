import { ModelLogger } from '../logger';

export abstract class Model<T> {
    logger: ModelLogger;
    constructor(logger: ModelLogger) {
        this.logger = logger;
    }
}