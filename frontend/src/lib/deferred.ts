type Resolver<T> = (arg: T) => void;
type Rejector<E extends Error = Error> = (cause: E) => void;

class Deferred<T> {
  private resolver!: Resolver<T>;
  private rejector!: Rejector;
  private readonly _promise: Promise<T>;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this.resolver = resolve;
      this.rejector = reject;
    });
  }

  promise(): Promise<T> {
    return this._promise;
  }

  resolve(arg: T) {
    this.resolver(arg);
  }

  reject(cause: Error) {
    this.rejector(cause);
  }
}

export { Deferred };
