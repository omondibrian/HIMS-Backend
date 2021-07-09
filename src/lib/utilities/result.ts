export class ResultPayload<T> {
  data: T | Error;
  status: number;
  constructor(data: T | Error, status: number) {
    this.data = data;
    this.status = status;
  }
  isError() {
    return this.data instanceof Error;
  }

  getError() {
    return this.isError() ? (this.data as Error) : undefined;
  }

  getPayload() {
    return this.isError() ? undefined : (this.data as T);
  }
  getResult(): {
    payload: T | undefined;
    message?: string;
  } {
    if (this.isError()) {
      const { message } = this.getError() as Error;
      return { payload: this.getPayload(), message };
    } else {
      return { payload: this.getPayload() };
    }
  }
}
