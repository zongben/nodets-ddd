export interface IReqHandler<T, TResult> {
  handle(req: T): Promise<TResult>;
}
