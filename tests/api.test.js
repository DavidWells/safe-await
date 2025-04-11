const { test } = require('uvu')
const assert = require('uvu/assert')
const { safeAwait, safeInverse } = require('../lib')

test('Valid promise has data. [err, data]', async () => {
  const [err, data] = await safeAwait(promiseOne())
  console.log('err', err)
  console.log('data', data)
  assert.is(err, undefined)
  assert.is(data, 'data here')
})

test('Error promise has string error. [err, data]', async () => {
  const [err, data] = await safeAwait(promiseOne(true))
  assert.is(err, 'error happened')
  assert.is(data, undefined)
})

test('Error promise has instance of error. [err, data]', async () => {
  const [err, data] = await safeAwait(promiseThrows())
  assert.ok(err instanceof Error)
  assert.is(data, undefined)
})

/**
 * Tests for safeInverse where data is first item returned and error is second
 */

test('Valid promise has data. [data, err]', async () => {
  const [data, err] = await safeInverse(promiseOne())
  assert.is(data, 'data here')
  assert.is(err, undefined)
})

test('Error promise has string error. [data, err]', async () => {
  const [data, err] = await safeInverse(promiseOne(true))
  assert.is(data, undefined)
  assert.is(err, 'error happened')
})

test('Error promise has instance of error. [data, err]', async () => {
  const [data, err] = await safeInverse(promiseThrows())
  assert.is(data, undefined)
  assert.ok(err instanceof Error)
})

test('Calls promises if not yet invoked', async () => {
  const [errTwo, dataTwo] = await safeAwait(promiseOne)
  assert.is(errTwo, undefined)
  assert.is(dataTwo, 'data here')
})

test('invert api', async () => {
  const [data, err] = await safeAwait(promiseOne, true)
  assert.is(err, undefined)
  assert.is(data, 'data here')
  const [dataTwo, errTwo] = await safeInverse(promiseOne)
  assert.is(errTwo, undefined)
  assert.is(dataTwo, 'data here')
  /* normal api */
  const [errThree, dataThree] = await safeAwait(promiseOne)
  assert.is(errThree, undefined)
  assert.is(dataThree, 'data here')
})

/**
 * Verify promises still throw native errors when deeper issue exists
 */

test('throws on code syntax error "ReferenceError"', async () => {
  try {
    const [err, data] = await safeAwait(promiseWithSyntaxError())
    assert.unreachable('Should have thrown an error')
  } catch (e) {
    assert.ok(e instanceof ReferenceError)
    assert.is(e.message, 'madeUpThing is not defined')
  }
})

test('throws on code syntax error "ReferenceError" in try/catch', async () => {
  try {
    const [err, data] = await safeAwait(promiseWithSyntaxError())
    assert.unreachable('Should have thrown an error')
  } catch (e) {
    assert.ok(e instanceof ReferenceError)
  }
})

test('throws on code "TypeError"', async () => {
  try {
    const [err, data] = await safeAwait(promiseWithTypeError())
    assert.unreachable('Should have thrown an error')
  } catch (e) {
    assert.ok(e instanceof TypeError)
    assert.is(e.message, 'Cannot read properties of null (reading \'lolCool\')')
  }
})

test('throws on code "TypeError" in try/catch', async () => {
  try {
    const [err, data] = await safeAwait(promiseWithTypeError())
    assert.unreachable('Should have thrown an error')
  } catch (e) {
    assert.ok(e instanceof TypeError)
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

// Run the tests
test.run()
