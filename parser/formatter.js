const ret = {
  // toBuffer: arr => new (global.myBuffer || Buffer)(arr),
  toHextString: arr => (global.myBuffer || Buffer).from(arr).toString('hex')
}

module.exports = ret
