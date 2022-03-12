import { getCurrentInstance } from '@vue/composition-api'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { prefix } from '../utils/app'

Vue.use(VueRouter)

export const createRouter = () => {
  return new VueRouter({
    base: prefix,
    mode: 'history',
    routes: [
      {
        name: 'upload',
        path: '/upload',
        component: () => import('../views/Upload.vue'),
      },
      {
        name: 'list',
        path: '/list',
        component: () => import('../views/List.vue'),
      },
      {
        name: 'workspace',
        path: '/workspace',
        component: () => import('../views/Workspace.vue'),
      },
      { path: '/', redirect: '/upload' },
    ],
  })
}

export const useRouter = () => {
  const { proxy } = getCurrentInstance()

  return proxy.$router
}

export const useRoute = () => {
  const { proxy } = getCurrentInstance()

  return proxy.$route
}
