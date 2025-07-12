import { CookieOptions } from "express";

export abstract class ResWith {
  private _withData: ResponseWith = {};

  with(data: ResponseWith): this {
    this._withData = {
      headers: {
        ...(this._withData.headers || {}),
        ...(data.headers || {}),
      },
      cookies: [...(this._withData.cookies || []), ...(data.cookies || [])],
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
    public readonly fileName: string,
    public readonly filePath: string,
  ) {
    super();
  }
}

export class BufferResponse extends ResWith {
  constructor(
    public readonly data: Buffer,
    public readonly fileName: string,
    public readonly mimeType: string = "application/octet-stream",
  ) {
    super();
    this.with({
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": mimeType,
      },
    });
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

  static File(fileName: string, filePath: string) {
    return new FileResponse(fileName, filePath);
  }

  static Buffer(buffer: Buffer, fileName: string, mimeType: string) {
    return new BufferResponse(buffer, fileName, mimeType);
  }
}
