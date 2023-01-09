'use strict'

const isArray = (target) => {
  return Array.isArray(target)
}

const noop = () => {}

const isObject = (target) => {
  return (
    target !== undefined &&
    target !== null &&
    typeof target === 'object' &&
    Object.prototype.toString.call(target) === '[object Object]' &&
    !isArray(target)
  )
}

const isFunction = (target) => {
  return typeof target === 'function'
}

const isPromise = (target) => {
  return (
    !!target &&
    (typeof target === 'object' || typeof target === 'function') &&
    (isFunction(target.then) || isFunction(target.catch))
  )
}

const assignArray = (...targets) => {
  return targets.reduce((pre, cur) => {
    return pre.concat(cur)
  }, [])
}

const assignObject = (...targets) => {
  return Object.assign({}, ...targets)
}

const generateId = () => {
  let d = new Date().getTime()

  if (global.performance && typeof global.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0 // d是随机种子
      d = Math.floor(d / 16)
      // eslint-disable-next-line no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    },
  )
  return uuid
}

const generateCode = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0')}`
}

const isExternal = (path) => {
  return /^(https?:|mailto:|tel:|wss?:)/.test(path)
}

const isEmpty = (target) => {
  if (!target) {
    return true
  }

  if (typeof target === 'string') {
    return target.trim() === ''
  }

  return !target
}

const pipeline = (...inspects) => {
  return (scope) => {
    let currentScope = scope

    const dispatch = (i) => {
      const next = (nextScope) => {
        if (nextScope !== undefined) {
          currentScope = nextScope
        }

        return dispatch(i + 1)
      }

      return Promise.resolve(
        (i >= inspects.length ? noop : inspects[i])(currentScope, next),
      )
    }

    return dispatch(0)
  }
}

const compose = (middleware) => {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!')
  }

  // next
  return function fn(ctx) {
    function dispatch(i) {
      const middlewareFn = middleware[i]
      try {
        return Promise.resolve(middlewareFn(ctx, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}

module.exports = {
  assignArray,
  assignObject,
  compose,
  generateCode,
  generateId,
  isArray,
  isEmpty,
  isExternal,
  isFunction,
  isObject,
  isPromise,
  noop,
  pipeline,
}
