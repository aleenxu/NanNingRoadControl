import React from 'react'
import styles from './Nav.scss'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      navtime: '',
      navmse: '',
      navtoday: '',
    }
    this.urls = '/simulation/parameterInfo/list'
  }
  componentDidMount = () => {
    this.timer = setInterval(this.getDate, 1000)
  }
  componentWillUnmount = () => {
    clearInterval(this.timer)
  }

  getDate = () => {
    const today = new Date()
    const x = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + (today.getDate())).slice(-2)
    const hour = ('0' + (today.getHours())).slice(-2)
    const minutes = ('0' + (today.getMinutes())).slice(-2)
    const seconds = ('0' + (today.getSeconds())).slice(-2)
    const navtime = year + '年' + month + '月' + day + '日'
    const navmse = hour + ':' + minutes + ':' + seconds
    const navtoday = (x[today.getDay()])
    this.setState({
      navtime,
      navmse,
      navtoday,
    })
  }
  handleGoEntrance = () => {
    const hashName = window.location.hash
    window.location.href = window.location.hash.replace(hashName, '#/entrance') // entrance作为产品入口 entrnaces人民大道入口
  }
  render() {
    return (
      <div className={styles.navWrapper}>
        <div className={styles.navWrapper_left}>
          <span>{this.state.navtime}</span>
          <span>{this.state.navmse}</span>
          <span>{this.state.navtoday}</span>
        </div>
        <div className={styles.headerName}>系统管理</div>
        {
          (window.location.hash !== '#/login' && window.location.hash !== '#/entrance') &&
          <div className={styles.navWrapper_right}>
            <div className={styles.homepage} onClick={this.handleGoEntrance}>主&nbsp;&nbsp;页<i /></div>
          </div>
        }
      </div>
    )
  }
}

export default Nav
