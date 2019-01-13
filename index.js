function on(listeners, callback, value) {
  listeners.push(callback)
  if(value !== void 0) callback(value)
  return function off() {
    const index = listeners.indexOf(callback)
    if(index > -1) listeners.splice(index, 1)
  }
}
function emit(listeners, value) {
  for(const listener of listeners) {
    listener(value)
  }
}
function map(callback) {
  const target = value()
  this(value => target(callback(value)))
  return target
}
function scan(current, callback) {
  const target = value(current)
  this(value => target(current = callback(current, value)))
  return target
}
function flatMap(callback) {
  const target = value()
  this(value => {
    const result = callback(value)
    if(typeof result === 'function') {
      return result(target)
    }
    return target(result)
  })
  return target
}

function startWith(current) {
  const target = value(current)
  this(target)
  return target
}

function filter(callback) {
  const target = value()
  this(value => callback(value) && target(value))
  return target
}

function changed(current, callback) {
  if(typeof current === 'function') {
    return changed(void 0, current)
  }
  const target = value(current)
  this(value => {
    if(value !== current) {
      return target(current = value)
    }
  })
  return target
}

export const api = { map, scan, flatMap, startWith, filter, changed }

export function value(current, listeners=[]) {
  function watch(value) {
    if(typeof value === 'undefined') {
      return current
    } else if(typeof value !== 'function') {
      return emit(listeners, current = value)
    }
    return on(listeners, value, current)
  }
  return Object.assign(watch, api)
}

export function merge(sources, current = Array.isArray(sources) ? [] : {}) {
  const target = value(current)
  for(const [ key, source ] of Object.entries(sources)) {
    source(value => {
      current[key] = value
      target(current)
    })
  }
  return target
}

export default value
