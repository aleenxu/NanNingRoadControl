import $ from 'jquery'

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const { authenticator, singleToken } = userInfo
if (singleToken) { // http:// 192.168.1.123:8089
  const url1 = 'http://10.11.57.101:20205/index.php/v6/index'
  const url2 = 'http://10.11.57.101:20205/index.php/v3/signal'
  $(document).ajaxSend((e, xhr, opt) => {
    const requestUrl = opt.url.split('?')[0]
    if (requestUrl !== url1 && requestUrl !== url2) {
      xhr.setRequestHeader('Authorization', authenticator)
      xhr.setRequestHeader('singleToken', singleToken)
    }
  })
  $(document).ajaxSuccess((e, xhr) => {
    if (xhr.responseText === '-10') {
      window.location.href = 'http://39.100.128.220:1521/'
      // window.location.href = 'http://localhost:11181/login'
    }
  })
} else {
  window.location.href = 'http://39.100.128.220:1521/'
  // window.location.href = 'http://localhost:11181/login'
}

