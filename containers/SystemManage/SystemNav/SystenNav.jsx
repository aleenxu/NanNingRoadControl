import React from 'react'
import classNames from 'classnames'
import { message } from 'antd'
import navStyles from '../Navigation.scss'

class SystemNav extends React.Component {
  constructor(props) {
    super(props)
    this.stste = {}
    this.systemItems = [
      { item: '用户管理', path: '/TrafficSystem', limitId: 7 },
      { item: '部门管理', path: '/Usergroup', limitId: 27 },
      { item: '权限角色管理', path: '/Jurisdiction', limitId: 17 },
      // { item: '日志管理', path: '#/Journal', limitId: 32 },
      // { item: '菜单管理', path: '#/TrafficMenu', limitId: 22 },
      { item: '用户操作日志', path: '/useractionlog', limitId: 7 },
      { item: '系统故障日志', path: '/systemfaultlog', limitId: 7 },
      { item: '信号控制记录', path: '/signalcontrolrecord', limitId: 7 },
    ]
  }
  componentDidMount = () => {
    console.log(window.location, '地址栏')
  }
  getRoadtraffic = (link, limitId) => {
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    const userLimit = []
    limitArr.forEach((item) => {
      userLimit.push(item.id)
    })
    window.location.href = link
    if (userLimit.indexOf(limitId) === -1) {
      message.warning('暂无权限')
    } else {
      window.location.href = link
    }
  }
  render() {
    return (
      <div className={navStyles.road_administer}>
        {
          this.systemItems.map(item => (
            <div
              className={classNames({
                [navStyles.administer_itemclick]: window.location.pathname === item.path,
                [navStyles.road_administer_item]: true,
              })}
              onClick={() => { this.getRoadtraffic(item.path, item.limitId) }}
              key={item.path}
            >
              <span>{item.item}</span>
              <span />
            </div>
          ))
        }
      </div>
    )
  }
}

export default SystemNav
