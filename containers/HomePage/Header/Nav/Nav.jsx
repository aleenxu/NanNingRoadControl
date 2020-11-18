import React from 'react'
import classNames from 'classnames'

import styles from './Nav.scss'

class EvaNav extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.navItems = [
      { name: '首页', path: '/home' },
      { name: '全局监控', path: '/monitoring' },
      { name: '步进管理', path: '/steppingManage' },
      {
        name: '协调监控', path: '',
        children: [
          { name: '特勤任务', path: '/secretTask' },
          { name: '干线协调', path: '/trunkLineCoordinate' },
          { name: '干线监控', path: '/trunkLineMonitoring' },
          { name: '区域协调', path: '/areaCoordinate' },
        ],
      },
    ]
    this.navItemsRight = [
      {
        name: '统计分析',
        path: '',
        children: [
          { name: '路口流量', path: '/roadTraffic' },
          { name: '路段流量', path: '/linkFlow' },
          { name: '路线流量', path: '/routeTraffic' },
          { name: '流量对比', path: '/contrastFlow' },
          { name: '运行状态', path: '/runningState' },
          { name: '设备统计', path: '/deviceStatistics' },
        ],
      },
      {
        name: '综合管理',
        path: '',
        children: [
          { name: '路口管理', path: '/InterManagement' },
          { name: '区域管理', path: '/RegiolManagement' },
          { name: '子区管理', path: '/RegiolManagementChild' },
          { name: '路线管理', path: '' },
          { name: '配时管理', path: '/timanagement' },
          { name: '设备管理', path: '' },
          { name: '时钟管理', path: '' },
          { name: '报警监视', path: '' },
        ],
      },
      {
        name: '系统维护',
        path: '',
        children: [
          { name: '用户操作日志', path: '/useractionlog' },
          { name: '系统故障日志', path: '/systemfaultlog' },
          { name: '信号控制记录', path: '/signalcontrolrecord' },
          { name: '用户管理', path: '/trafficsystem' },
          { name: '用户组管理', path: '/usergroup' },
          { name: '角色管理', path: '/jurisdiction' },
        ],
      },
    ]
  }
  componentDidMount = () => { }
  handGosystem = (e) => {
    const paths = e.target.getAttribute('path')
    console.log(paths);
    this.props.history.push(paths)
  }
  handleShowDefaultNav = (item) => {
    if (item.children) {
      const child = item.children.filter(items => items.path === this.props.location.pathname)
      if (child.length > 0) {
        return child[0]
      }
      return null
    }
    return null
  }
  handleNavMouseEnter = (e, item) => {
    if (item.children) {
      const innerBox = e.currentTarget.lastElementChild
      innerBox.style.height = item.children.length * 28 + 'px'
    }
  }
  handleNavMouseLeave = (e) => {
    const innerBox = e.currentTarget.lastElementChild
    innerBox.style.height = 0
  }
  render() {
    const { pathname } = this.props.location
    return (
      <div className={styles.navWrapper}>
        <div className={styles.navLeft}>
          {
            this.navItems.map((item) => {
              const child = this.handleShowDefaultNav(item)
              return (
                <div
                  className={styles.navItem}
                  key={item.name}
                  onMouseEnter={(e) => { this.handleNavMouseEnter(e, item) }}
                  onMouseLeave={this.handleNavMouseLeave}
                >
                  <p className={styles.navBg} />
                  <p
                    className={classNames({ [styles.navName]: true, [styles.navActive]: child ? pathname === child.path : pathname === item.path })}
                    path={child ? child.path : item.path}
                    onClick={this.handGosystem}
                  >
                    {child ? child.name : item.name}
                  </p>
                  <div className={styles.innerItemBox}>
                    {
                      item.children &&
                      item.children.map(items => <div className={styles.innerItem} onClick={this.handGosystem} key={items.name + items.path} path={items.path}>{items.name}</div>)
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={styles.navCenter} />
        <div className={styles.navRight}>
          {
            this.navItemsRight.map((item) => {
              const child = this.handleShowDefaultNav(item)
              return (
                <div
                  className={styles.navItem}
                  key={item.name}
                  onMouseEnter={(e) => { this.handleNavMouseEnter(e, item) }}
                  onMouseLeave={this.handleNavMouseLeave}
                >
                  <p className={styles.navBg} />
                  {/* <p className={classNames({ [styles.navName]: true, [styles.navActive]: this.props.location.pathname === item.path })}>{item.name}</p> */}
                  <p
                    className={classNames({ [styles.navName]: true, [styles.navActive]: child ? pathname === child.path : pathname === item.path })}
                    path={child ? child.path : item.path}
                    onClick={this.handGosystem}
                  >
                    {child ? child.name : item.name}
                  </p>
                  <div className={styles.innerItemBox}>
                    {
                      item.children &&
                      item.children.map(items => <div className={styles.innerItem} onClick={this.handGosystem} key={items.name + items.path} path={items.path}>{items.name}</div>)
                    }
                  </div>
                </div>
              )
            })
          }
        </div>

      </div>
    )
  }
}

export default EvaNav
