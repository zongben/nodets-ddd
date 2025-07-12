import { CookieOptions } from "express";

export abstract class ResWith {
  private _withData: ResponseWith = {};

  with(data: ResponseWith): this {
    this._withData = {
      ...this._withData,
      ...data,
    };
    return this;
  }

  getWithData(): ResponseWith {
    return this._withData;
  }
}

export type ResponseWith = {
  cookies?: Cookie[];
  headers?: Record<string, string>;
};

export type Cookie = {
  key: string;
  value: string;
  options: CookieOptions;
};

export class JsonResponse extends ResWith {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    super();
    this.status = status;
    this.body = body;
  }
}

export class FileResponse extends ResWith {
  constructor(
    public readonly filePath: string,
    public readonly fileName: string,
  ) {
    super();
  }
}

export class Responses {
  static OK<T = any>(data: T) {
    return new JsonResponse(200, data);
  }

  static Created<T = any>(data: T) {
    return new JsonResponse(201, data);
  }

  static Accepted<T = any>(data: T) {
    return new JsonResponse(202, data);
  }

  static NoContent() {
    return new JsonResponse(204, null);
  }

  static BadRequest<T = any>(error: T) {
    return new JsonResponse(400, error);
  }

  static Unauthorized<T = any>(error: T) {
    return new JsonResponse(401, error);
  }

  static Forbidden<T = any>(error: T) {
    return new JsonResponse(403, error);
  }

  static NotFound<T = any>(error: T) {
    return new JsonResponse(404, error);
  }

  static Conflict<T = any>(error: T) {
    return new JsonResponse(409, error);
  }

  static File(filePath: string, fileName: string) {
    return new FileResponse(filePath, fileName);
  }
}
