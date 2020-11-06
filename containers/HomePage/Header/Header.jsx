import React from 'react'

import styles from './Header.scss'

import Nav from './Nav/Nav'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nowTime: null,
      nowMse: null,
      nowtoday: null,
    }
  }
  componentDidMount = () => {
    this.coustomInterval()
  }
  componentWillUnmount = () => {
    if (this.headerTimer) {
      clearTimeout(this.headerTimer)
      this.headerTimer = null
    }
  }
  getNowDate = () => {
    const today = new Date()
    const x = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + (today.getDate())).slice(-2)
    const hour = ('0' + (today.getHours())).slice(-2)
    const minutes = ('0' + (today.getMinutes())).slice(-2)
    const seconds = ('0' + (today.getSeconds())).slice(-2)
    const nowTime = year + '年' + month + '月' + day + '日'
    const nowMse = hour + ':' + minutes + ':' + seconds
    const nowtoday = (x[today.getDay()])
    this.setState({
      nowTime,
      nowMse,
      nowtoday,
    })
  }
  handleLogout = () => {
    // getResponseData('post', this.logoutUrl).then((res) => {
    //   const { code, msg } = res.data
    //   if (code === 0) {
    //     localStorage.clear()
    //     window.location.href = 'http://10.11.56.10:62000/gytocc/yjzh/login.jsp?lastURL=%2Fgytocc%2Firest%2Fview%2Fmain%2Fentrance'
    //   } else {
    //     message.warning(msg)
    //   }
    // })
    this.props.history.push('/login')
  }
  handleGoBack = () => {
    this.props.history.push('/home')
  }
  coustomInterval = () => {
    this.getNowDate()
    this.headerTimer = setTimeout(this.coustomInterval, 1000)
  }
  render() {
    const { pathname } = this.props.location
    return (
      <div className={styles.headerWrapper}>
        <div className={styles.headTime} key={this.state.nowTime}>
          <span className={styles.timeSpan}>{this.state.nowTime}</span>
          <span className={styles.timeSpan}>{this.state.nowMse}</span>
          <span className={styles.timeSpan}>{this.state.nowtoday}</span>
        </div>
        {
          pathname === '/home' ?
            <div className={styles.goBack} onClick={this.handleLogout}>退出登录</div> :
            <div className={styles.goBack} onClick={this.handleGoBack}>返回首页</div>
        }
        <Nav {...this.props} />
      </div>
    )
  }
}

export default Header
