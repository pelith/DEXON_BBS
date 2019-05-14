const canonicalUrl = 'https://dett.cc'

module.exports = {
  root: './src',
  data: {
    title: 'DEXON BBS',
    description: '基於 DEXON 智慧合約的 BBS 系統' ,
    canonicalUrl,
  },
  filters: {
    prefixUrl: path => path ? `${canonicalUrl}/${path}` : `${canonicalUrl}`
  },
}
