export type SuccessResult<T> = {
  isSuccess: true;
  data: T;
};

export type FailResult = {
  isSuccess: false;
  errorCode: string;
};

export type BaseResult<T> = SuccessResult<T> | FailResult;
