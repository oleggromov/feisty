const { resolveUrl, getIsInternal } = require('./url-tools')

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

describe('getIsInternal', () => {
  it('works for internal URLs', () => {
    expect(getIsInternal('/hello/world')).toBe(true)
    expect(getIsInternal('/')).toBe(true)
  })

  it('works for external URLs', () => {
    expect(getIsInternal('http://hello.com/world')).toBe(false)
    expect(getIsInternal('https://google.com')).toBe(false)
    expect(getIsInternal('ftp://google.com')).toBe(false)
    expect(getIsInternal('//google.com')).toBe(false)
    expect(getIsInternal('mailto:ivan@pupkin.com')).toBe(false)
  })
})
