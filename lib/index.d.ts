export default function safeAwait<T>(
  promise: Promise<T>,
  finallyFunc?: Function
): Promise<[error: Error] | [error: undefined, data: T]>;
