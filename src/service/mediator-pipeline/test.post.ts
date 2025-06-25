import { MediatorPipe } from "../../lib/mediator/mediator-pipe";

export class TestPostPipeline extends MediatorPipe {
  async handle(req: any, next: any): Promise<any> {
    console.log("TestPostPipeline: handle method called");
    return await next(req);
  }
}
