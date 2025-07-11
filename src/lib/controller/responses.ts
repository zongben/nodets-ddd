export class JsonResponse {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    this.status = status;
    this.body = body;
  }
}

export class DownloadResponse {
  constructor(
    public readonly filePath: string,
    public readonly fileName: string,
  ) {}
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
}
