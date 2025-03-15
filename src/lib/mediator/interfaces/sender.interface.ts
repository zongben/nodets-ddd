export interface ISender {
  send(req: any): Promise<any>;
}
