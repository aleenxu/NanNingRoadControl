/**
 * @file 将对象中得key value转换成字符串拼接得方式
 */

export const resetParams = (params) => {
  if (Object.prototype.toString.call(params) !== '[object Object]') return false
  let newParams = '?'
  Object.keys(params).forEach((item) => {
    const itemMsg = item + '=' + params[item] + '&'
    newParams += itemMsg
  })
  return newParams
}
