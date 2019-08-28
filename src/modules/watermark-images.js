const gm = require('gm')

const getImageSize = from => new Promise((resolve, reject) => {
  gm(from).size((err, value) => {
    if (err) return reject(err)
    resolve(value)
  })
})

const watermarkImage = ({ from, to, text }) =>
  new Promise(async (resolve, reject) => {
    const size = await getImageSize(from)
    gm(from)
      .noProfile()
      .font('Arial')
      .fontSize(Math.ceil(size.width / 50))
      .gravity('SouthEast')
      .fill('white')
      .draw(`text 10,10 '${text}'`)
      .write(to, (err) => {
        if (err) return reject(err)
        resolve()
      })
  })

module.exports = async ({ images, text }) => {
  const promises = []

  for (let i = 0; i < images.length; i++) {
    const { from, to } = images[i]
    promises.push(watermarkImage({ from, to, text}))
  }

  return Promise.all(promises)
}
