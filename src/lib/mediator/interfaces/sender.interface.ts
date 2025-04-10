export interface ISender {
  send(req: any): Promise<any>;
  send<T>(req: any): Promise<T>;
}
