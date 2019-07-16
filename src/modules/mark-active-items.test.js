const markActiveItems = require('./mark-active-items')

describe('markActiveItems', () => {
  const items = [{ url: '/another', something: 'valuable' }, { url: '/something/new', another: 'key' }]

  it('returns a new array with new objects and retains all other properties', () => {
    const result = markActiveItems(items, '/')
    expect(result).not.toBe(items)
    expect(result[0]).not.toBe(items[0])
    expect(result[0]).toMatchObject({ something: 'valuable' })
    expect(result[1]).not.toBe(items[1])
    expect(result[1]).toMatchObject({ another: 'key' })
  })

  it('marks items as active', () => {
    const items = [
      { url: '/about' },
      { url: '/about/company' },
      { url: '/about/company/index.html' },
      { url: '/' },
      { url: '/new/index.html'},
    ]
    expect(markActiveItems(items, '/about')).toEqual([
      { url: '/about', active: true },
      { url: '/about/company', active: true  },
      { url: '/about/company/index.html', active: true },
      { url: '/' },
      { url: '/new/index.html'},
    ])
  })

  it('marks root as active', () => {
    const items = [
      { url: '/about' },
      { url: '/' },
    ]
    expect(markActiveItems(items, '/')).toEqual([
      { url: '/about' },
      { url: '/', active: true }
    ])
  })

  it('works only for absolute URLs', () => {
    const items = [
      { url: 'absolute/its/me' },
      { url: '/absolute/url' },
      { url: 'https://domain.com/absolute/url' },
      { url: 'http://domain.com/absolute/url' },
      { url: '//domain.com/absolute/url' }
    ]
    expect(markActiveItems(items, '/absolute')).toEqual([
      { url: 'absolute/its/me' },
      { url: '/absolute/url', active: true },
      { url: 'https://domain.com/absolute/url' },
      { url: 'http://domain.com/absolute/url' },
      { url: '//domain.com/absolute/url' }
    ])
  })

  it('ignores trailing slashes', () => {
    const items = [
      { url: '/something' },
      { url: '/something/' },
      { url: '/something//' }
    ]
    expect(markActiveItems(items, '/something')).toEqual([
      { url: '/something', active: true },
      { url: '/something/', active: true },
      { url: '/something//', active: true }
    ])
    expect(markActiveItems(items, '/something/')).toEqual([
      { url: '/something', active: true },
      { url: '/something/', active: true },
      { url: '/something//', active: true }
    ])
  })

  it('only matches URLs from the beginning', () => {
    const items = [
      { url: '/something/true' },
      { url: '/not/something/true' }
    ]
    expect(markActiveItems(items, '/something')).toEqual([
      { url: '/something/true', active: true },
      { url: '/not/something/true' }
    ])
  })

  it('throws when a non-absolute url provided', () => {
    expect(() => {
      markActiveItems(items, 'something/like/a/url')
    }).toThrow()
  })

  it('works for objects', () => {
    const items = {
      a: { url: '/about' },
      b: { url: '/about/company/index.html' },
      c: { url: '/new/index.html'},
    }
    expect(markActiveItems(items, '/about')).toMatchObject({
      a: { url: '/about', active: true },
      b: { url: '/about/company/index.html', active: true },
      c: { url: '/new/index.html'},
    })
  })
})
