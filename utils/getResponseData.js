import axios from 'axios'
import requestUrl from './getRequestBaseUrl'

const instance = axios.create({
  baseURL: requestUrl,
})
// 请求拦截
instance.interceptors.request.use((config) => {
  const pathName = (config.url.split('/')).pop()
  if (pathName !== 'login') {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      config.headers.Authorization = userInfo.token
      config.headers.singleToken = userInfo.singleToken
    } else {
      window.location.href = 'http://10.11.56.10:62000/gytocc/yjzh/login.jsp?lastURL=%2Fgytocc%2Firest%2Fview%2Fmain%2Fentrance'
    }
  }
  return config
}, error => (Promise.reject(error)))

// 返回拦截
instance.interceptors.response.use((response) => {
  if (response.data.code === -10) {
    localStorage.clear()
    // window.location.href = 'http://localhost:11181/login'
    window.location.href = 'http://39.100.128.220:1521/'
  }
  return response
}, error => (Promise.reject(error)))

export default async function getResponseDatas(type, url, requestParams, setHead) {
  try {
    let reponse = ''
    switch (type) {
      case 'get':
        reponse = await instance.get(url, { params: requestParams })
        break
      case 'post':
        reponse = await instance.post(url, requestParams, setHead)
        break
      case 'put':
        reponse = await instance.put(url, requestParams)
        break
      case 'delete':
        reponse = await instance.delete(url, requestParams)
        break
      default:
        break
    }
    return reponse
  } catch (error) {
    console.error(error)
  }
}

// ==== axios是基于ajax和promise（浏览器内置）进行封装的库
// fetch 浏览器内置API 内置的类，进行数据请求，天生就是基于Promise进行管理的

