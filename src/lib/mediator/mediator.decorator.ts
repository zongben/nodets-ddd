export const METADATA_KEY = {
  handlerFor: Symbol.for("handlerFor"),
};

export function Handler<TReq>(
  req: new (...args: any[]) => TReq,
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEY.handlerFor, req, target);
  };
}
