export type SuccessResult<T> = {
  isSuccess: true;
  data: T;
};

export type ErrorResult<E> = {
  isSuccess: false;
  error: E;
};

export type BaseResult<T, E> = SuccessResult<T> | ErrorResult<E>;
