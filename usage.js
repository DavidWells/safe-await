const O_o = require('./lib')

/* Look ma, no try/catch */
async function usageExample(input) {
  try {
    const [ errorOne, dataOne ] = await O_o(promiseOne(input))
    if (errorOne) {
      // Handle business logic errors
      console.log('Business logic error', errorOne)
    }
    /* ignore myPromiseTwo business logic errors by omitting first array item */
    const [ , dataTwo ] = await O_o(promiseTwo('other'))

    /* handle error or null promise response */
    const [ errorThree, dataThree ] = await O_o(promiseThree('other'))
    if (errorThree || !dataThree) {
      console.log('Business logic error three', errorThree)
    }

    // Bail/retry if required data missing
    if (!dataOne || !dataTwo || !dataThree) {
      return 'NOPE'
    }
    // do stuff with data
    console.log('myPromise', dataOne)
    console.log('myPromiseTwo', dataTwo)
    console.log('myPromiseThree', dataThree)

    return {
      dataOne,
      dataTwo,
      dataThree
    }
  } catch (e) {
    // Handle native javascript errors here
    console.log('Native JS error', e)
  }
}

/* Promises with callback */
function promiseOne(input) {
  return new Promise((resolve, reject) => {
    callbacker(input, (error, data) => {
      if (error) return reject(error)
      return resolve(data)
    })
  })
}

/* Normal promise */
function promiseTwo(value) {
  return Promise.resolve(`myPromiseTwo data ${value}`)
}

/* Normal promise */
function promiseThree() {
  if (simulateFailure(true)) {
    console.log('myPromiseThree error triggered')
    return Promise.resolve(
      new Error('myPromiseThree business logic error')
    )
  }
  return Promise.resolve('myPromiseThree data')
}

/* Normal callback */
function callbacker(input, cb) {
  if (simulateFailure(true)) {
    console.log('syntaxError error triggered')
    // unknownThing will throw syntaxError
    console.log(unknownThing)
  }
  return cb(null, {
    value: businessLogic(input)
  })
}

/* Randomly simulate failures */
function simulateFailure(enable) {
  if (!enable) return false
  return (Math.floor(Math.random() * 10) + 1) < 6
}

function businessLogic(input) {
  if (simulateFailure()) {
    console.log('businessLogic error triggered')
    throw new Error('Business logic error xyz')
  }
  return `${input} fizzbuzz`
}

/* Run the thing */
usageExample('foobar').then((result) => {
  console.log('final result', result)
}).catch((err) => {
  console.log('final catch', err)
})
