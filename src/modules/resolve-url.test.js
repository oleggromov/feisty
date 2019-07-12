const resolveUrl = require('./resolve-url')

describe('resolveUrl', () => {
  const base = 'http://my-site.com/assets/'
  it('does not modify http and https urls', () => {
    expect(resolveUrl('https://hello.com', base)).toBe('https://hello.com')
    expect(resolveUrl('http://hello.com', base)).toBe('http://hello.com')
    expect(resolveUrl('//hello.com', base)).toBe('//hello.com')
  })

  it('does not modify other protocol urls', () => {
    expect(resolveUrl('ftp://hello.com', base)).toBe('ftp://hello.com')
  })

  it('does not modify absolute urls', () => {
    expect(resolveUrl('/hello.jpg', base)).toBe('/hello.jpg')
  })

  it('correctly joins relative urls', () => {
    expect(resolveUrl('hello.jpg', base)).toBe('http://my-site.com/assets/hello.jpg')
    expect(resolveUrl('hello.jpg', 'https://google.com')).toBe('https://google.com/hello.jpg')
  })
})
