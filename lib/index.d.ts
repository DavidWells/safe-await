export default function safeAwait<T>(
  promise: Promise<T>,
  finallyFunc?: Function
): Promise<[error: any, data: T]>;
