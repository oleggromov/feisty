const flatten = deepArray => {
  let flat = []
  for (const el of deepArray) {
    if (Array.isArray(el)) {
      flat = [...flat, ...flatten(el)]
    } else {
      flat.push(el)
    }
  }
  return flat
}

module.exports = flatten
