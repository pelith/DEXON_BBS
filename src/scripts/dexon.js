import Web3 from 'web3'
// inject Web3 to Global
window.Web3 = Web3
Web3.utils = (new Web3('http://dummy')).utils

class EventEmitter{
  constructor(){
    this._events={}
  }
  on(event,callback){
    let callbacks = this._events[event] || []
    callbacks.push(callback)
    this._events[event] = callbacks
    return this
  }
  off(event,callback){
    let callbacks = this._events[event]
    this._events[event] = callbacks && callbacks.filter(fn => fn !== callback)
    return this
  }
  emit(...args){
    const event = args[0]
    const params = [].slice.call(args,1)
    const callbacks = this._events[event]
    if (callbacks) {
      callbacks.forEach(fn => fn.apply(this, params))
    }
    return this
  }
  once(event,callback){
    let wrapFunc = (...args) => {
      callback.apply(this,args)
      this.off(event,wrapFunc)
    }
    this.on(event,wrapFunc)
    return this
  }
}

class Dexon extends EventEmitter {
  constructor(_dexon) {
    super()
    this.dexon = _dexon
    this.dexonWeb3 = ''
    this.selectedAddress = ''
    this.init()
  }

  init() {
    if (!this.dexon) return

    this.dexonWeb3 = new Web3(this.dexon)

    if (this.dexonWeb3.currentProvider.publicConfigStore) {
      this.dexonWeb3.currentProvider.publicConfigStore.on('update', (data) => {
        if ('networkVersion' in data)
          if (data.networkVersion === '237'){
            this.selectedAddress = 'selectedAddress' in data ? data.selectedAddress : ''
            this.emit('update', this.selectedAddress)
          }
      })
    }
    else {
      const start = async () => {
        const networkID = await this.dexonWeb3.eth.net.getId()
        if (networkID === 237) {
          const accounts = await this.dexonWeb3.eth.getAccounts()
          this.selectedAddress = accounts.length > 0 ? accounts[0] : ''
          // XXX: only emit update when the address do change
          this.emit('update', this.selectedAddress)
        } else {
          const error = new Error('Wrong network')
          error.code = 'wrong-network'
          this.emit('error', error)
          return
        }
      }

      start()
      setInterval(start, 1000)
    }
  }

  login(){
    if ( !this.dexon) return alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)')

    this.dexon.enable()
    this.init()
  }
}

export default Dexon