/* https://gist.github.com/DavidWells/54f9dd1af4a489e5f1358f33ce59e8ad */

function isFn(fn) {
  return typeof fn === 'function'
}

/* Native Error types https://mzl.la/2Veh3TR */
const nativeExceptions = [
  EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
].filter(isFn)

/* Throw native errors. ref: https://bit.ly/2VsoCGE */
function throwNative(error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error
  }
}

/* Helper buddy for removing async/await try/catch litter */
function safeAwaitLogic(errorFirst, promiseOrFn, invert) {
  const errFirst = errorFirst && invert !== true
  return (isFn(promiseOrFn) ? promiseOrFn() : promiseOrFn).then(data => {
    if (data instanceof Error) {
      throwNative(data)
      return errFirst ? [ data ] : [ undefined, data ]
    }
    return errFirst ? [ undefined, data ] : [ data ]
  }).catch(error => {
    throwNative(error)
    return errFirst ? [ error ] : [ undefined, error ]
  })
}

const safeAwait = safeAwaitLogic.bind(null, true)
const safeInverse = safeAwaitLogic.bind(null, false)

module.exports = safeAwait
module.exports.safeAwait = safeAwait
module.exports.safeInverse = safeInverse
