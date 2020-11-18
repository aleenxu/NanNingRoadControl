import React from 'react'
import { Icon, message } from 'antd'

import styles from './Login.scss'

import getResponseDatas from '../../utils/getResponseData'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.loginUrl = '/simulation/sys/user/login'
    this.limitUrl = '/simulation/sys/menu/getUserMentList?userId='
    this.loginParams = {
      loginName: '',
      password: '',
    }
  }
  componentDidMount = () => {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        console.log(e, e.keCode)
        this.handleLogin()
      }
    })
  }
  // 转格式
  getFormData = (obj) => {
    const formData = new FormData()
    Object.keys(obj).forEach((item) => {
      formData.append(item, obj[item])
    })
    return formData
  }
  getUserLimit = (id) => {
    getResponseDatas('post', `${this.limitUrl}${id}`).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        localStorage.setItem('userLimit', JSON.stringify(data))
      }
    })
  }
  handleLogin = () => {
    const { loginName, passWord } = this.loginParams
    if (loginName !== '' && passWord !== '') {
      getResponseDatas('post', this.loginUrl, this.getFormData(this.loginParams)).then((res) => {
        const { code, data, msg } = res.data
        if (code === 0) {
          this.getUserLimit(data.id)
          localStorage.setItem('userInfo', JSON.stringify(data))
          this.loginParams = {
            loginName: '',
            passWord: '',
          }
          this.props.history.push('/redirect')
        } else {
          message.warning(msg)
        }
      })
    }
  }
  handleUserName = (e) => {
    this.loginParams.loginName = e.target.value
  }
  handlePassWord = (e) => {
    this.loginParams.password = e.target.value
  }
  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>交通信号控制管理平台</h1>
          <div className={styles.usermsgBox}>
            <div className={styles.welcome} />
            <div className={styles.userInput}>
              <div className={styles.userMsg}>
                <span><Icon type="user" /></span>
                <input placeholder="请输入用户名" type="text" onChange={this.handleUserName} />
              </div>
              <div className={styles.userMsg}>
                <span><Icon type="lock" theme="filled" /></span>
                <input placeholder="请输入密码" type="password" onChange={this.handlePassWord} />
              </div>
              <div className={styles.loginBtn} onClick={this.handleLogin}>登录</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
