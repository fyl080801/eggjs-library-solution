'use strict'

const {
  isFunction,
  noop,
  pipeline,
  generateId,
  isArray,
  isEmpty,
} = require('./helpers')

const sortHookServices = (services) => {
  const maps = services.reduce((target, item) => {
    target[item._name] = item
    return target
  }, {})

  const dependencies = services.reduce((target, item) => {
    const dts = services.filter((dt) => dt.dependents?.indexOf(item._name) >= 0)
    target[item._name] = [
      ...(item.dependencies || []),
      ...dts.map((dt) => dt._name),
    ]
    return target
  }, {})

  const used = new Set()

  const result = []

  let keys = Object.keys(dependencies)

  let items

  let length

  do {
    length = keys.length

    items = []

    // eslint-disable-next-line no-loop-func
    keys = keys.filter((k) => {
      if (!dependencies[k].every(Set.prototype.has, used)) {
        return true
      }

      items.push(k)

      return false
    })

    result.push(...items)

    items.forEach(Set.prototype.add, used)
  } while (keys.length && keys.length !== length)

  result.push(...keys)

  return result.map((key) => maps[key])
}

const createHookRunner = (options) => (handles, input) => {
  return pipeline(
    ...handles
      .filter((item) => isFunction(item))
      .map((provider) => provider(options))
      .filter((item) => isFunction(item)),
  )(input)
}

const createSingleService = (name) => {
  return () => {
    let instance = null

    return {
      name,
      setup(item) {
        instance = item
      },
      uninstall() {
        instance = null
      },
      resolve() {
        return instance
      },
    }
  }
}

const createHookService = (name) => {
  return () => {
    const handles = new Set()

    return {
      name,
      setup: (handle) => {
        if (isFunction(handle)) {
          handles.add(handle)
        }

        handle._name = generateId()

        handle.dependents = []

        handle.dependencies = []

        handle.named = (name) => {
          handle._name = name
          return handle
        }

        // 依赖。。。
        handle.depend = (name) => {
          if (handle.dependencies?.indexOf(name) < 0) {
            handle.dependencies.push(name)
          }
          return handle
        }

        // 被。。。依赖
        handle.dependBy = (name) => {
          if (handle.dependents?.indexOf(name) < 0) {
            handle.dependents.push(name)
          }
          return handle
        }

        return handle
      },
      uninstall: (handle) => {
        handles.delete(handle)
      },
      resolve: (parent) => {
        return sortHookServices([...(parent || []), ...Array.from(handles)])
      },
    }
  }
}

const createServiceProvider = (registers) => {
  const settings = {}

  let currentParent = null

  const addService = (factory) => {
    if (!isFunction(factory)) {
      console.warn('注册的服务构造函数不是一个方法')
      return
    }

    const service = factory()

    if (isEmpty(service.name)) {
      console.warn('服务注册失败, 没有服务名称标识 name')
      return
    }

    if (!isFunction(service.setup)) {
      console.warn('服务注册失败, 没有服务安装方法 setup')
      return
    }

    // if (!isFunction(service.uninstall)) {
    //   console.warn('没有服务卸载方法 uninstall, 注册的服务无法反安装')
    // }

    if (!isFunction(service.resolve)) {
      console.warn('服务注册失败, 没有服务取出方法 resolve')
    }

    settings[service.name] = service
  }

  isArray(registers) &&
    registers.forEach((item) => {
      addService(item)
    })

  const getSetup = () => {
    return Object.values(settings).reduce((target, item) => {
      target[item.name] = item.setup || noop
      return target
    }, {})
  }

  const getUninstall = () => {
    return Object.values(settings).reduce((target, item) => {
      target[item.name] = item.uninstall || noop
      return target
    }, {})
  }

  const provider = {
    addService(service) {
      addService(service)
      return provider
    },
    getSettings() {
      return settings
    },
    getSetup,
    getUninstall,
    build(parent) {
      currentParent = parent

      return (onSetup) => {
        if (isFunction(onSetup)) {
          onSetup(getSetup())
        }

        return {
          uninstall(onUninstall) {
            if (!isFunction(onUninstall)) {
              return
            }

            onUninstall(getUninstall())
          },
          getService(name) {
            return settings[name]
              ? (settings[name]?.resolve || noop)(
                  currentParent?.getService(name),
                )
              : currentParent?.getService(name)
          },
          getServiceNames() {
            return Array.from(
              new Set([
                ...Object.keys(settings),
                ...currentParent.getServiceNames(),
              ]),
            )
          },
        }
      }
    },
  }

  return provider
}

const globalServiceProvider = createServiceProvider()

const useServiceProvider = globalServiceProvider.build()

module.exports = {
  globalServiceProvider,
  useServiceProvider,
  createServiceProvider,
  createHookService,
  createSingleService,
  createHookRunner,
}
