const canonicalUrl = 'https://dett.cc'

module.exports = {
  root: './src',
  filters: {
    prefixUrl: path => path ? `https://dett.cc/${path}` : `https://dett.cc/`
  },
}
