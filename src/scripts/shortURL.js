class ShortURL {
  static encode(num) {
    let str = ''
    while (num > 0) {
      str = ShortURL.alphabet.charAt(num % ShortURL.base) + str
      num = Math.floor(num / ShortURL.base)
    }
    return str
  }

  // static decode(str) {
  //   let num = 0
  //   for (let i = 0; i < str.length; i++) {
  //     num = num * ShortURL.base + ShortURL.alphabet.indexOf(str.charAt(i))
  //   }
  //   return num
  // }
}
ShortURL.alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'
ShortURL.base = ShortURL.alphabet.length

export default ShortURL

