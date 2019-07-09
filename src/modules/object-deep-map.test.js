const objectDeepMap = require('./object-deep-map')

describe('objectDeepMap', () => {
  it('does not modify original object', () => {
    const original = { a: 2, b: 'something' }
    objectDeepMap(original, (key, value) => 'abc')
    expect(original).toMatchObject({ a: 2, b: 'something' })
  })

  it('works for non-object keys', () => {
    const source = { a: 'hello', b: 100 }
    const result = objectDeepMap(source, (key, value) => value + 1)
    expect(result).toMatchObject({ a: 'hello1', b: 101 })
  })

  it('goes a few levels deep', () => {
    const deep = {
      second: {
        a: 'hello',
        b: 'world'
      },
      c: 100
    }
    const result = objectDeepMap(deep, (key, value) => value + 1)
    expect(result).toMatchObject({
      second: {
        a: 'hello1',
        b: 'world1'
      },
      c: 101
    })
  })

  it('works with arrays of objects', () => {
    const withArrays = {
      something: 'true',
      list: [
        { a: 1 },
        { b: 'hello' }
      ]
    }
    const result = objectDeepMap(withArrays, (key, value) => value + 1)
    expect(result).toMatchObject({
      something: 'true1',
      list: [
        { a: 2 },
        { b: 'hello1' }
      ]
    })
  })

  it('works with arrays of scalars', () => {
    const withArrays = {
      greeting: [
        'hello',
        'world'
      ]
    }
    const result = objectDeepMap(withArrays, (key, value) => value + 1)
    expect(result).toMatchObject({
      greeting: [
        'hello1',
        'world1'
      ]
    })
  })
})
