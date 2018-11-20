import devtoolPlugin from './plugins/devtool'
import ModuleCollection from './module/module-collection'
import { forEachValue, isObject, isPromise, assert } from './util'

let Vue // bind on install

export class DataManager {
  constructor (options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof Promise !== 'undefined', `DataManager requires a Promise polyfill in this browser.`)
      assert(this instanceof DataManager, `DataManager must be called with the new operator.`)
    }

    // DataManager internal state
    this._data = {}
    this._epoch = 0 // 数据版本控制
    this._updating = false
    this._listenners = {}

    // const {
    //   plugins = [],
    //   strict = false
    // } = options

    // // DataManager internal state
    // this._committing = false
    // this._actions = Object.create(null)
    // this._actionSubscribers = []
    // this._mutations = Object.create(null)
    // this._wrappedGetters = Object.create(null)
    // this._modules = new ModuleCollection(options)
    // this._modulesNamespaceMap = Object.create(null)
    // this._subscribers = []
    // this._watcherVM = new Vue()

    // // bind commit and dispatch to self
    // const datamanager = this
    // const { dispatch, commit } = this
    // this.dispatch = function boundDispatch (type, payload) {
    //   return dispatch.call(datamanager, type, payload)
    // }
    // this.commit = function boundCommit (type, payload, options) {
    //   return commit.call(datamanager, type, payload, options)
    // }

    // // strict mode
    // this.strict = strict

    // const state = this._modules.root.state

    // // init root module.
    // // this also recursively registers all sub-modules
    // // and collects all module getters inside this._wrappedGetters
    // installModule(this, state, [], this._modules.root)

    // // initialize the store vm, which is responsible for the reactivity
    // // (also registers _wrappedGetters as computed properties)
    // resetStoreVM(this, state)

    // // apply plugins
    // plugins.forEach(plugin => plugin(this))
  }

  getByPath (_path) {
    let path = unifyArrayStyle(_path)
    let d = this._data
    for (let i = 0; i < path.length; i++) {
      d = d[path[i]]
      if (d === undefined) break
    }
    if (i < path.length - 1) return {} 
    return d
  }

  mergeData (source, epochIncrease=true, deleteNullObj=true) {
    if (epochIncrease) this._epoch += 1
    DataManager.mergeObject(this._data, source, this._epoch, deleteNullObj)
  }

  asyncGetByPath (_path, cb) {
    let path = unifyArrayStyle(_path)
    let d = this._data
    for (let i = 0; i < path.length; i++) {
      d = d[path[i]]
      if (d === undefined) break
    }
    if (i < path.length - 1) d = {}
    cb(d)
  }

  commit (_type, _payload) {
    // check object-style commit
    const {type, payload} = unifyObjectStyle(_type, _payload)
    const mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[datamanager] unknown mutation type: ${type}`)
      }
      return
    }
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    this._subscribers.forEach(sub => sub(mutation, this.state))
  }

  dispatch (_type, _payload) {
    // check object-style dispatch
    const {type, payload} = unifyObjectStyle(_type, _payload)
    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[datamanager] unknown action type: ${type}`)
      }
      return
    }

    this._actionSubscribers.forEach(sub => sub(action, this.state))

    return entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
  }

  subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  }

  subscribeAction (fn) {
    return genericSubscribe(fn, this._actionSubscribers)
  }

  watch (getter, cb, options) {
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof getter === 'function', `store.watch only accepts a function.`)
    }
    return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
  }

  replaceState (state) {
    this._withCommit(() => {
      this._vm._data.$$state = state
    })
  }

  registerModule (path, rawModule, options = {}) {
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
      assert(path.length > 0, 'cannot register the root module by using registerModule.')
    }

    this._modules.register(path, rawModule)
    installModule(this, this.state, path, this._modules.get(path), options.preserveState)
    // reset store to update getters...
    resetStoreVM(this, this.state)
  }

  unregisterModule (path) {
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
    }

    this._modules.unregister(path)
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1))
      Vue.delete(parentState, path[path.length - 1])
    })
    resetStore(this)
  }

  hotUpdate (newOptions) {
    this._modules.update(newOptions)
    resetStore(this, true)
  }

  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }

  // 静态方法
  static mergeObject(target, source, _epoch=0, deleteNullObj=true) {
    for (let property in source) {
      let value = source[property]
      switch (typeof value) {
        case 'object':
          if (value === null) {
            // 服务器 要求 删除对象
            if (deleteNullObj) delete target[property]
            continue
          } else if (Array.isArray(value) || property == "data") {
            //@note: 这里做了一个特例, 使得K线序列数据被保存为一个array, 而非object, 并且记录整个array首个有效记录的id
            if (!(property in target)) target[property] = []
            // @note: 后面使用 GET_KLINE 返回的是 target.data 的 proxy，这样可以方便取得 last_id target 不是每次都有 last_id
            // if (target.last_id) target['data']['last_id'] = target.last_id
          } else {
            if (!(property in target)) target[property] = {}
          }
          DataManager.mergeObject(target[property], value, _epoch, deleteNullObj);
          break;
        case 'string':
        case 'boolean':
        case 'number':
          target[property] = value === 'NaN' ? NaN : value;
          break;
        case 'undefined':
            
      }
    }
    // _epoch 不应该被循环到的 key
    if(!target['_epoch']) Object.defineProperty(target, "_epoch", {
        configurable: false,
        enumerable: false,
        writable: true
    })
    target['_epoch'] = _epoch
  }

}



const datamanager = {
  quotes: {},
  _epoch: 0
}

QuoteWs.addEventListener('message', message => {
    if (message.aid === 'rtn_data') {
      for (let i in message.data) { 
            mergeObject(datamanager, message.data[i], false)
        }
    }
})


function unifyArrayStyle (path) {
  if (!(path instanceof Array)) path = path.split('/')
  return path.filter(x => x!=='')
}

