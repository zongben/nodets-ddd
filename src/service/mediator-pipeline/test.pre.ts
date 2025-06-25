import { MediatorPipe } from "../../lib/mediator/mediator-pipe";

export class TestPrePipeline extends MediatorPipe {
  async handle(req: any, next: any): Promise<any> {
    console.log("TestPrePipeline: handle method called");
    return await next(req);
  }
}
