/* Safely use async/await without try/catch blocks */
/* https://gist.github.com/DavidWells/54f9dd1af4a489e5f1358f33ce59e8ad */

/**
 * @template T
 * @typedef {Promise<T> | (() => Promise<T>)} PromiseOrFn
 */

/**
 * @template T
 * @typedef {[Error, undefined] | [undefined, T]} ErrorFirst
 */

/**
 * @template T
 * @typedef {[T, undefined] | [undefined, Error]} DataFirst
 */

/**
 * @param {unknown} fn
 * @returns {fn is Function}
 */
function isFn(fn) {
  return typeof fn === 'function'
}

/* Native Error types https://mzl.la/2Veh3TR */
const nativeExceptions = [
  EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
].filter(isFn)

/**
 * Throw native errors. ref: https://bit.ly/2VsoCGE
 * @param {Error} error
 */
function throwNative(error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error
  }
}

/**
 * Await a promise and return [error, data] tuple
 * @template T
 * @param {PromiseOrFn<T | Error>} promiseOrFn
 * @param {boolean} [invert]
 * @returns {Promise<ErrorFirst<T>>}
 */
function safeAwait(promiseOrFn, invert) {
  const errFirst = invert !== true
  return /** @type {Promise<ErrorFirst<T>>} */ (
    (isFn(promiseOrFn) ? promiseOrFn() : promiseOrFn).then(data => {
      if (data instanceof Error) {
        throwNative(data)
        return errFirst ? [ data, undefined ] : [ undefined, data ]
      }
      return errFirst ? [ undefined, data ] : [ data, undefined ]
    }).catch(error => {
      throwNative(error)
      return errFirst ? [ error, undefined ] : [ undefined, error ]
    })
  )
}

/**
 * Await a promise and return [data, error] tuple
 * @template T
 * @param {PromiseOrFn<T | Error>} promiseOrFn
 * @returns {Promise<DataFirst<T>>}
 */
function safeInverse(promiseOrFn) {
  return /** @type {Promise<DataFirst<T>>} */ (
    (isFn(promiseOrFn) ? promiseOrFn() : promiseOrFn).then(data => {
      if (data instanceof Error) {
        throwNative(data)
        return [ undefined, data ]
      }
      return [ data, undefined ]
    }).catch(error => {
      throwNative(error)
      return [ undefined, error ]
    })
  )
}

module.exports = safeAwait
module.exports.safeAwait = safeAwait
module.exports.safeInverse = safeInverse
