// import { Message } from '@arco-design/web-react'
import axios from 'axios'
import { clearKeys, json2search, localKey } from './index'
import { useRouter } from 'vue-router'
const router = useRouter()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const HOST = _GLOBAL_VARS_.VITE_HOST
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const MODE = _GLOBAL_VARS_.MODE

export const request = axios.create({
  baseURL: HOST,
  timeout: 60e3,
  method: 'POST',
})

const pendingRequest = new Map()

function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, json2search(params), json2search(data)]
}

function addPendingRequest(config) {
  const requestKey = generateReqKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel)
      }
    })
}

function removePendingRequest(config) {
  const requestKey = generateReqKey(config)
  if (pendingRequest.has(requestKey)) {
    const cancel = pendingRequest.get(requestKey)
    cancel(requestKey)
    pendingRequest.delete(requestKey)
  }
}

// 请求拦截器
request.interceptors.request.use(
  async (config) => {
    const { url, data } = config
    removePendingRequest(config) // 检查是否存在重复请求，若存在则取消已发的请求

    // 把当前请求添加到pendingRequest对象中 oss 接口不限制
    if (!url.includes('/oss/sts')) {
      addPendingRequest(config)
    }

    // 需要下载的Url默认设置
    if (url.includes('download')) {
      addPendingRequest(config)
      config.responseType = 'blob'
      config.method = 'GET'
    }

    const token = `${localKey('token')}`

    config.headers['jwt'] = token || null

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  async (response) => {
    removePendingRequest(response.config) // 从pendingRequest对象中移除请求

    const { status, statusText, config, headers, data } = response
    const { errcode, errmsg } = response?.data || {}

    if (errcode === 0) {
      return Promise.resolve(response?.data)
    }

    if (errcode >= 40001 && errcode <= 50000) {
      clearKeys()
      router.push({ path: '/login' })
      return Promise.reject(data)
    }

    // Message.error(errmsg)
    return Promise.reject(data)
  },
  function (error) {
    removePendingRequest(error.config || {}) // 从pendingRequest对象中移除请求

    if (axios.isCancel(error)) {
      console.warn(`已取消的重复请求：${error.message}`)
    } else {
      // 非重复的请求错误才报错
      // Message.error('network error')
      return Promise.reject(error)
    }
  }
)
