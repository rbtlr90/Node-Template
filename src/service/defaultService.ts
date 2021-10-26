   
import { ServiceLogger, ServiceLog } from '../logger';
import { Service } from '.';

export class DefaultService extends Service {
    private helloWorld: string;

    constructor(logger: ServiceLogger) {
        super(logger);
        this.helloWorld = 'Hello World!';
    }

    @ServiceLog()
    async getHelloWorld(){
        return this.helloWorld;
    }
}