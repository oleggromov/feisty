const Jimp = require('jimp')

// ToDo: switch to https://github.com/aheckmann/gm
const getLabelCanvas = async (label) => {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE)
  const width = Jimp.measureText(font, label)
  const height = Jimp.measureTextHeight(font, label)
  const canvas = await Jimp.create(width, height)

  canvas.print(font, 0, 0, label).rotate(90)

  return { canvas, width, height }
}

module.exports = async (images) => {
  const { canvas, width, height } = await getLabelCanvas('© oleggromov.com')
  const promises = []

  for (let i = 0; i < images.length; i++) {
    const {from, to} = images[i]
    const image = await Jimp.read(from)
    promises.push(image
      .composite(canvas, image.bitmap.width - height - 10, image.bitmap.height - width - 10)
      .writeAsync(to)
    )
  }

  return Promise.all(promises)
}
