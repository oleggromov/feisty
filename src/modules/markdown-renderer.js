const marked = require('marked')
const { resolveUrl, getIsInternal } = require('./url-tools')

// ToDo transform found images into a set
const getCustomRenderer = options => {
  const { image: { foundImages, baseImageUrl } } = options

  const Renderer = new marked.Renderer()

  Renderer.image = (href, title, text) => {
    foundImages.push(href)

    return [
      '<figure class="source-image">',
      `<img src="${resolveUrl(href, baseImageUrl)}" `,
      text ? ` alt="${text}"` : '',
      title ? ` title="${title}"` : '',
      ' />',
      title ? `<figcaption>${title}</figcaption>` : '',
      '</figure>'
    ].join('')
  }

  Renderer.link = (href, title, text) => {
    const isInternal = getIsInternal(href)
    const linkClass = isInternal ? 'internal' : 'external'
    return [
      `<a href="${href}"`,
      ` class="${linkClass}"`,
      !isInternal ? ' target="_blank"' : '',
      !isInternal ? ' rel="noopener"' : '',
      title ? ` title="${title}"` : '',
      `>${text}</a>`
    ].join('')
  }

  return Renderer
}

module.exports = getCustomRenderer
