export abstract class BaseReturn {
  abstract isSuccess: boolean;
  abstract messageCode: string;
  abstract data: any;
}
