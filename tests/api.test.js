import test from 'ava'
import safeAwait from '../lib'

test('Valid promise has data. [err, data]', async (t) => {
  const [err, data] = await safeAwait(promiseOne())
  t.is(err, undefined)
  t.is(data, 'data here')
})

test('Error promise has string error. [err, data]', async (t) => {
  const [err, data] = await safeAwait(promiseOne(true))
  t.is(err, 'error happened')
  t.is(data, undefined)
})

test('Error promise has instance of error. [err, data]', async (t) => {
  const [err, data] = await safeAwait(promiseThrows())
  t.is(err instanceof Error, true)
  t.is(data, undefined)
})

/**
 * Verify promises still throw native errors when deeper issue exists
 */

test('throws on code syntax error "ReferenceError"', async t => {
  await t.throwsAsync(async () => {
    const [err, data] = await safeAwait(promiseWithSyntaxError())
  }, {
    instanceOf: ReferenceError,
    message: 'madeUpThing is not defined'
  })
})

test('throws on code syntax error "ReferenceError" in try/catch', async t => {
  try {
    const [err, data] = await safeAwait(promiseWithSyntaxError())
  } catch (e) {
    t.is(e instanceof ReferenceError, true)
  }
})

test('throws on code "TypeError"', async t => {
  await t.throwsAsync(async () => {
    const [err, data] = await safeAwait(promiseWithTypeError())
  }, {
    instanceOf: TypeError,
    message: 'Cannot read property \'lolCool\' of null'
  })
})

test('throws on code "TypeError" in try/catch', async t => {
  try {
    const [err, data] = await safeAwait(promiseWithTypeError())
  } catch (e) {
    t.is(e instanceof TypeError, true)
  }
})

function promiseOne(doError) {
  return new Promise((resolve, reject) => {
    if (doError) return reject('error happened') // eslint-disable-line
    return resolve('data here')
  })
}

function promiseThrows(doError) {
  return new Promise((resolve, reject) => {
    return reject(new Error('business logic error'))
  })
}

function promiseWithSyntaxError(doError) {
  return new Promise((resolve, reject) => {
    console.log(madeUpThing)
    return resolve('should not reach this')
  })
}

function promiseWithTypeError(doError) {
  return new Promise((resolve, reject) => {
    const fakeObject = null
    console.log(fakeObject.lolCool)
    return resolve('should not reach this')
  })
}
