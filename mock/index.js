'use strict'

// import Mock from 'mockjs'
// import { param2Obj } from '../src/utils'

// import application from './tpaas/application'
// import appInstance from './tpaas/appInstance'
// import cluster from './tpaas/cluster'
// import configuration from './tpaas/configuration'
// import namespace from './tpaas/namespace'
// import kubeResource from './tpaas/kubeResource'
// import user from './tpaas/user'
// import devopsApp from './devops/app'
// import loggersSearch from './loggers/search'
// import alertRuleGroup from './monitor/alertRuleGroup'
// import metrics from './monitor/metrics'
// import dashboard from './monitor/dashboard'
// import pipeline from './devops/pipeline'
// import secret from './devops/secret'
// import configMap from './devops/configMap'
// import zone from './hub/zone'
// import hubAppInstance from './hub/appInstance'
// import chartHub from './hub/chartHub'
// import imageHub from './hub/imageHub'
// import customRepo from './hub/customRepo'
// import hubKubeResource from './hub/kubeResource'
// import policy from './tpaas/policy'
// import policyGroup from './tpaas/policyGroup'
// import AuditLog from './tpaas/AuditLog'
// import other from './tpaas/other'
// import project from './jdos/project'
// import store from './jdos/store'
// import jdosCluster from './jdos/cluster'
// import region from './jdos/region'
// import resources from './jdos/resources'

const mocks = [
  {
    url: '/render-editor/testmock/aaaa/test1',
    type: 'get',
    response: () => ({
      data: { xxxx: 'sss' },
      headers: {},
      status: 200,
    }),
  },
  //   ...user,
  //   ...application,
  //   ...appInstance,
  //   ...cluster,
  //   ...namespace,
  //   ...kubeResource,
  //   ...project,
  //   ...devopsApp,
  //   ...loggersSearch,
  //   ...alertRuleGroup,
  //   ...secret,
  //   ...configMap,
  //   ...metrics,
  //   ...dashboard,
  //   ...pipeline,
  //   ...zone,
  //   ...hubAppInstance,
  //   ...chartHub,
  //   ...imageHub,
  //   ...hubKubeResource,
  //   ...policyGroup,
  //   ...policy,
  //   ...AuditLog,
  //   ...other,
  //   ...customRepo,
  //   ...configuration,
  //   ...store,
  //   ...jdosCluster,
  //   ...region,
  //   ...resources,
]

// // for front mock
// // please use it cautiously, it will redefine XMLHttpRequest,
// // which will cause many of your third-party libraries to be invalidated(like progress event).
// export function mockXHR() {
//   // mock patch
//   // https://github.com/nuysoft/Mock/issues/300
//   Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
//   Mock.XHR.prototype.send = function () {
//     if (this.custom.xhr) {
//       this.custom.xhr.withCredentials = this.withCredentials || false

//       if (this.responseType) {
//         this.custom.xhr.responseType = this.responseType
//       }
//     }
//     this.proxy_send(...arguments)
//   }

//   function XHR2ExpressReqWrap(respond) {
//     return function (options) {
//       let result = null
//       if (respond instanceof Function) {
//         const { body, type, url } = options
//         // https://expressjs.com/en/4x/api.html#req
//         result = respond({
//           method: type,
//           body: JSON.parse(body),
//           query: param2Obj(url),
//         })
//       } else {
//         result = respond
//       }
//       return Mock.mock(result)
//     }
//   }

//   for (const i of mocks) {
//     Mock.mock(
//       new RegExp(i.url),
//       i.type || 'get',
//       XHR2ExpressReqWrap(i.response),
//     )
//   }
// }

// // for mock server
// const responseFake = (url, type, respond) => {
//   return {
//     url: new RegExp(`${url}`),
//     type: type || 'get',
//     response(req, res) {
//       console.log('request invoke:' + req.path)
//       res.json(
//         Mock.mock(respond instanceof Function ? respond(req, res) : respond),
//       )
//     },
//   }
// }

// module.exports = mocks.map((route) => {
//   return responseFake(route.url, route.type, route.response)
// })
module.exports = mocks
