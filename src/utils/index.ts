import { request } from './request'
import COPY from 'copy-to-clipboard'
import dayjs from 'dayjs'

export { request }

/**
 * 时间戳转时间
 * @param date 时间戳
 * @param format 格式
 * @returns
 */
export const date = (date: number, format = 'YYYY-MM-DD HH:mm:ss') => {
  const isUnix = dayjs.unix(date).isValid()
  const val = isUnix ? dayjs.unix(date) : date
  return dayjs(val).format(format)
}

/**
 * localStorage函数
 * @param key key
 * @param value value: 赋值 null: 删除 undefined: 获取
 * @returns
 */
export const localKey = (key: string, value?: any) => {
  const _ = localStorage.getItem('$$') === null ? {} : JSON.parse(localStorage.getItem('$$'))
  if (typeof key !== 'undefined') {
    if (typeof value !== 'undefined') {
      if (value !== null) {
        //set
        _[key] = value
      } else {
        //remove
        delete _[key]
      }
    } else {
      //get
      return _[key]
    }
  }
  localStorage.setItem('$$', JSON.stringify(_))
}

/**
 * sessionStorage函数
 * @param key key
 * @param value value: 赋值 null: 删除 undefined: 获取
 * @returns
 */
export const sessionKey = (key: string, value?: any) => {
  const _ = sessionStorage.getItem('$$') === null ? {} : JSON.parse(sessionStorage.getItem('$$'))
  if (typeof key !== 'undefined') {
    if (typeof value !== 'undefined') {
      if (value !== null) {
        //set
        _[key] = value
      } else {
        //remove
        delete _[key]
      }
    } else {
      //get
      return _[key]
    }
  }
  sessionStorage.setItem('$$', JSON.stringify(_))
}

/**
 * 清楚本地储存
 */
export const clearKeys = () => {
  window.localStorage.clear()
  window.sessionStorage.clear()
}

/**
 * 复制函数
 * @param text 复制文本
 * @param msg 提示文案
 */
export const copy = (text = '', msg) => {
  COPY(text)
}

/**
 * 防抖函数
 * @param func 执行函数
 * @param delay 延迟时间 ms
 * @param immediate 是否立即执行
 */
export const debounce = (func: () => void, delay: number, immediate = false): (() => void) => {
  let timer: number | undefined
  return function (this: unknown, ...args: any[]) {
    if (immediate) {
      func.apply(this, args) // 确保引用函数的指向正确，并且函数的参数也不变
      immediate = false
      return
    }
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param func 执行函数
 * @param delay 延迟时间 ms
 */
export const throttle = (func: any, delay = 200) => {
  let startTime = Date.now()
  return (...args: any[]) => {
    const curTime = Date.now()
    const interval = delay - (curTime - startTime)
    if (interval <= 0) {
      startTime = Date.now()
      return func(...args)
    }
  }
}

/**
 * 查询字符串转对象
 * @param str 字符串
 * @returns
 */
export const search2json = (str: string) => {
  const arr = str.substring(str.indexOf('?') + 1, str.length).split('&')
  const obj = {}
  for (const i in arr) {
    const k = arr[i].split('=')
    obj[k[0]] = k[1]
  }
  return obj
}

/**
 * 对象转查询字符串
 * @param obj 对象
 * @returns
 */
export const json2search = (obj: object) => {
  const str = []
  for (const i in obj) {
    str.push(`${i}=${obj[i]}`)
  }
  if (str.length) {
    return '?' + str.join('&')
  } else {
    return ''
  }
}

/**
 * 设备判断
 */
export const device = {
  isMobile: (function () {
    return /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(
      window.navigator.userAgent.toLowerCase()
    )
  })(),
  isiOS: (function () {
    return /iphone|ipod|ipad/i.test(window.navigator.userAgent.toLowerCase())
  })(),
  isAndroid: (function () {
    return /android.*mobile/i.test(window.navigator.userAgent.toLowerCase())
  })(),
  isWechat: (function () {
    return /micromessenger/i.test(window.navigator.userAgent.toLowerCase())
  })(),
  isApplets: (function () {
    return window['__wxjs_environment'] === 'miniprogram' ? true : false
  })(),
}
