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
    callbacks.forEach(fn => fn.apply(this, params))
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
    this.dexonWeb3.currentProvider.publicConfigStore.on('update', (data) => {
      if ('networkVersion' in data)
        if (data.networkVersion === '237'){
          this.selectedAddress = 'selectedAddress' in data ? data.selectedAddress : ''
          this.emit('update',this.selectedAddress)
        }
    })
  }

  login(){
    if ( !this.dexon) return alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)')

    this.dexon.enable()
    init()
  }
}

export default Dexon