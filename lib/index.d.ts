type PromiseOrFn<T> = Promise<T> | (() => Promise<T>);
type ErrorFirst<T> = [Error | undefined, T | undefined];
type DataFirst<T> = [T | undefined, Error | undefined];

declare function safeAwait<T>(promise: PromiseOrFn<T | Error>, invert?: boolean): Promise<ErrorFirst<T>>;
declare function safeInverse<T>(promise: PromiseOrFn<T | Error>): Promise<DataFirst<T>>;

export { safeAwait as default, safeAwait, safeInverse };
