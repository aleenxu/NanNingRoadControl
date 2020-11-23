/**
 * @file 配置环境变量
 */

const getRequestBaseUrl = () => {
  // http://39.100.128.220:7002 公网
  // http://192.168.1.123 本地环境 http://39.100.128.220:7002 http://192.168.1.40:20205/ http://192.168.1.123
  // http://192.168.1.216:20205 调试单路口数据
  // http://10.11.57.101:20206 内网(贵阳)
  return process.env.NODE_ENV === 'development' ? 'http://39.100.128.220:7002' :
    process.env.NODE_ENV === 'production' ? 'http://39.100.128.220:7002' : null
    // process.env.NODE_ENV === 'production' ? 'http://10.11.57.101:20206' : null
}

export default getRequestBaseUrl()
