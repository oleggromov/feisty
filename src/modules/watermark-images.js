const gm = require('gm')

const watermarkImage = ({ from, to, text }) =>
  new Promise(async (resolve, reject) => {
    gm(from)
      .noProfile()
      .font('Arial')
      .fontSize(16)
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
