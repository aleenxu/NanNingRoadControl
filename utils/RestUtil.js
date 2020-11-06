/**
 * @file Http request
 */

import axios from 'axios'
import requestUrl from './getRequestBaseUrl'

function createInstance() {
  axios.defaults.baseURL = requestUrl
  // 添加请求拦截器
  const loginUrl = '/simulation/sys/user/tokenLogin'
  axios.interceptors.request.use((config) => {
    const configUrl = config.url.split('?')[0]
    if (configUrl !== loginUrl) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (userInfo) {
        config.headers.Authorization = userInfo.token
        config.headers.singleToken = userInfo.singleToken
      } else {
        window.location.href = 'http://10.11.56.10:62000/gytocc/yjzh/login.jsp?lastURL=%2Fgytocc%2Firest%2Fview%2Fmain%2Fentrance'
      }
    }
    return config
  }, (error) => {
    console.log(error)
    return Promise.reject(error)
  })
  // 返回拦截
  axios.interceptors.response.use((response) => {
    if (response.data.code === -10) {
      console.log(response)
      localStorage.clear()
      window.location.href = 'http://10.11.56.10:62000/gytocc/yjzh/login.jsp?lastURL=%2Fgytocc%2Firest%2Fview%2Fmain%2Fentrance'
    }
    return response
  }, error => (Promise.reject(error)))
  return axios
}
export default createInstance()