import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, Select, message, Pagination,Modal, DatePicker } from 'antd'
import Nav from '../Nav/Nav'
import roadStyles from '../Roadtraffic.scss'
import styles from '../TrafficSystem.scss'
import userStyles from './SignalControlRecord.scss'
import SystemNav from '../SystemNav/SystenNav'
import { getsigdelete, getsigexportExcelThing, getsigloadDistrict, getsigloadSignalControlLogList, getsigloadUnit, getsigloadUser } from '../../../actions/logManagement'

const { Option } = Select
const { confirm } = Modal
// 日志管理
class signalcontrolrecord extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: null,
      systemList: null,
      userLimit: null,
      current: 1,
      MaintenanceUnitList: [],
      ManagementStart: '2019-01-01 00:00:00',
      ManagementUnit: this.formatDate(new Date() * 1),
      MaintenanceUnitLister: [],
      MaintenanceUnitListers: [],
    }
    this.sysUser = { keyword: '', pageNo: '1' }
    this.dataList = {
      name: '',
      parentId: '',
      path: '',
      perms: '',
      sort: '',
      type: '0',
    }
    this.listUrl = '/simulation/sys/menu/listPage'
    this.listTrueUrl = '/simulation/sys/menu/listTrue' // 获取树结构
    this.saveUrl = '/simulation/sys/menu/save'
    this.updateUrl = '/simulation/sys/menu/update'
    this.deleteUrl = '/simulation/sys/menu/delete'
    this.dateFormat = 'YYYY-MM-DD'
    this.page = 1
    this.pageNum = 10
    this.dateListUser = 0
    this.dateListUserGroups = 0
    this.dateListUserGroupser = 0
  }
  componentDidMount = () => {
    this.props.getsigloadDistrict()
    this.props.getsigloadUnit()
    this.props.getsigloadUser()
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userId=${this.dateListUserGroupser}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getsigloadSignalControlLogList(str)
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    const userLimit = []
    limitArr.forEach((item) => {
      userLimit.push(item.id)
    })
    this.setState({ userLimit })
  }
  componentDidUpdate = (prevState) => {
    const { sigloadDistrict, sigloadUnit, sigloadUser, sigloadSignalControlLogList, sigexportExcelThing } = this.props.data
    if (prevState.data.sigloadDistrict !== sigloadDistrict) {
      this.getsigloadDistricts(sigloadDistrict)
    }
    if (prevState.data.sigloadUnit !== sigloadUnit) {
      this.getsigloadUnits(sigloadUnit)
    }
    if (prevState.data.sigloadUser !== sigloadUser) {
      this.getsigloadUsers(sigloadUser)
    }
    if (prevState.data.sigloadSignalControlLogList !== sigloadSignalControlLogList) {
      this.getsigloadSignalControlLogLists(sigloadSignalControlLogList)
    }
    if (prevState.data.sigexportExcelThing !== sigexportExcelThing) {
      this.getsigexportExcelThings(sigexportExcelThing)
    }
  }
  getsigexportExcelThings = (sigexportExcelThing) => {
    const blob = new Blob([sigexportExcelThing], { type: 'application/vnd.ms-excel,charset=utf-8' })
    const a = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    a.href = href
    document.body.appendChild(a)
    // a.click()
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    document.body.removeChild(a)
    window.URL.revokeObjectURL(href)
  }
  getsigloadSignalControlLogLists = async (loadSystemOperationLogList) => {
    const shows = await this.adds(loadSystemOperationLogList.list)
    if (shows) {
      this.setState({ systemList: shows, totalCount: loadSystemOperationLogList.page.totalSize, current: Number(loadSystemOperationLogList.page.fromPage) })
    }
  }
  getsigloadDistricts = (sigloadDistrict) => {
    this.setState({
      MaintenanceUnitList: sigloadDistrict,
    })
  }
  getsigloadUnits = (sigloadUnit) => {
    this.setState({
      MaintenanceUnitLister: sigloadUnit,
    })
  }
  getsigloadUsers = (sigloadUser) => {
    this.setState({
      MaintenanceUnitListers: sigloadUser,
    })
  }

  getfaciDelete = (userid, times) => {
    const that = this
    confirm({
      title: '确认要删除当前菜单?',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        that.delectList(userid, times)
      },
      onCancel() { },
    })
  }
  delectList = (userid, times) => {
    this.props.getsigdelete(userid, times).then((res) => {
      if (res.data.code === 200) {
        message.info('删除成功')
        const { ManagementStart, ManagementUnit } = this.state
        const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userId=${this.dateListUserGroupser}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
        this.props.getsigloadSignalControlLogList(str)
      }
    })
  }
  adds = (list) => {
    list.forEach((item) => {
      if (item.CONTROL_TYPE === 1) {
        if (item.formatcontrolValue === 1) {
          item.controlName = '步进'
        } else {
          item.controlName = '取消步进'
        }
      } else if (item.CONTROL_TYPE === 2) {
        if (item.formatcontrolValue === 0) {
          item.controlName = '取消勤务控制'
        } else {
          item.controlName = '勤务阶段' + item.formatcontrolValue
        }
      } else if (item.CONTROL_TYPE === 4) {
        if (item.formatcontrolValue === 0) {
          item.controlName = '取消锁定阶段'
        } else {
          item.controlName = '锁定阶段' + item.formatcontrolValue
        }
      } else if (item.CONTROL_TYPE === 5) {
        if (item.formatcontrolValue === 0) {
          item.controlName = '取消锁定控制方式'
        } else {
          item.controlName = '锁定'
          if (item.formatcontrolValue === 11) {
            item.controlName += '关灯控制'
          } else if (item.formatcontrolValue === 12) {
            item.controlName += '全红控制'
          } else if (item.formatcontrolValue === 13) {
            item.controlName += '黄闪控制'
          }
        }
      } else if (item.CONTROL_TYPE === 6) {
        if (item.formatcontrolValue === 0) {
          item.controlName = '取消锁定方案'
        } else {
          item.controlName = '锁定方案' + item.formatcontrolValue
        }
      } else if (item.CONTROL_TYPE === 7) {
        item.controlName = '上载'
        if (item.formatcontrolValue === 1) {
          item.controlName += '车道'
        } else if (item.formatcontrolValue === 2) {
          item.controlName += '检测器'
        } else if (item.formatcontrolValue === 3) {
          item.controlName += '相位'
        } else if (item.formatcontrolValue === 4) {
          item.controlName += '跟随相位'
        } else if (item.formatcontrolValue === 5) {
          item.controlName += '阶段'
        } else if (item.formatcontrolValue === 6) {
          item.controlName += '配时方案'
        } else if (item.formatcontrolValue === 7) {
          item.controlName += '时基动作表'
        } else if (item.formatcontrolValue === 8) {
          item.controlName += '时段表'
        } else if (item.formatcontrolValue === 9) {
          item.controlName += '调度表'
        }
      } else if (item.CONTROL_TYPE === 8) {
        item.controlName = '下载'
        if (item.formatcontrolValue === 1) {
          item.controlName += '车道'
        } else if (item.formatcontrolValue === 2) {
          item.controlName += '检测器'
        } else if (item.formatcontrolValue === 3) {
          item.controlName += '相位'
        } else if (item.formatcontrolValue === 4) {
          item.controlName += '跟随相位'
        } else if (item.formatcontrolValue === 5) {
          item.controlName += '阶段'
        } else if (item.formatcontrolValue === 6) {
          item.controlName += '配时方案'
        } else if (item.formatcontrolValue === 7) {
          item.controlName += '时基动作表'
        } else if (item.formatcontrolValue === 8) {
          item.controlName += '时段表'
        } else if (item.formatcontrolValue === 9) {
          item.controlName += '调度表'
        }
      }
    })
    return list
  }
  handlePagination = (pageNumber) => {
    this.page = pageNumber
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userId=${this.dateListUserGroupser}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getsigloadSignalControlLogList(str)
  }
  handleInputChangeUser = (value) => {
    this.dateListUser = value
  }
  handleInputChangeUserGroups = (value) => {
    this.dateListUserGroups = value
  }
  handleInputChangeUserGroupser = (value) => {
    this.dateListUserGroupser = value
  }
  sInstallationLocationsStart = (date) => {
    this.setState({
      ManagementStart: this.formatDate(new Date(date._d) * 1),
    })
  }
  sInstallationLocationsEnd = (date) => {
    this.setState({
      ManagementUnit: this.formatDate(new Date(date._d) * 1),
    })
  }
  searchPage = () => {
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userId=${this.dateListUserGroupser}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getsigloadSignalControlLogList(str)
  }
  handlePagination = (pageNumber) => {
    this.page = pageNumber
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userId=${this.dateListUserGroupser}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getsigloadSignalControlLogList(str)
  }
  exportTable = () => {
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}&userId=${this.dateListUserGroupser}`
    this.props.getsigexportExcelThing(str)
  }
  formatDate = (value) => { // 时间戳转换日期格式方法
    if (value == null) {
      return ''
    }
    const date = new Date(value)
    const y = date.getFullYear()// 年
    let MM = date.getMonth() + 1// 月
    MM = MM < 10 ? (`0${MM}`) : MM
    let d = date.getDate()// 日
    d = d < 10 ? (`0${d}`) : d
    let h = date.getHours()// 时
    h = h < 10 ? (`0${h}`) : h
    let m = date.getMinutes()// 分
    m = m < 10 ? (`0${m}`) : m
    let s = date.getSeconds()// 秒
    s = s < 10 ? (`0${s}`) : s
    return `${y}-${MM}-${d} ${h}:${m}:${s}`
  }
  render() {
    const { systemList, totalCount, current, userLimit, MaintenanceUnitList, ManagementStart, MaintenanceUnitLister, MaintenanceUnitListers, ManagementUnit } = this.state
    return (
      <div className={(roadStyles.Roadtcontent)}>
        {/* 地图 */}
        <div id="mapContainer" className={classNames(roadStyles.mapContainer, styles.mapContainer)} >
          <div className={styles.syetem_bg}>
            <div className={styles.syetem_top}>
              <div className={`${styles.syetem_item} ${userStyles.syetem_item}`}><span className={styles.item}>所属区域</span>
                <div className={styles.inSle}>
                  {/* <Input onChange={(e) => { this.handleInputChange(e) }} placeholder="查询条件" /> */}
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUser}
                  >
                    <Option value={0} key="124ssswwwsa">全部</Option>
                    {
                      MaintenanceUnitList && MaintenanceUnitList.map(item =>
                        <Option value={item.ID} key={item.ID}>{item.DISTRICT_NAME}</Option>)}
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item} ${userStyles.syetem_item}`}><span className={styles.item}>所属路口</span>
                <div className={styles.inSle}>
                  {/* <Input onChange={(e) => { this.handleInputChange(e) }} placeholder="查询条件" /> */}
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUserGroups}
                  >
                    <Option value={0} key="124ssswwwas">全部</Option>
                    {
                      MaintenanceUnitLister && MaintenanceUnitLister.map(item =>
                        <Option value={item.ID} key={item.ID}>{item.UNIT_NAME}</Option>)}
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item} ${userStyles.syetem_item}`}><span className={styles.item}>操作用户</span>
                <div className={styles.inSle}>
                  {/* <Input onChange={(e) => { this.handleInputChange(e) }} placeholder="查询条件" /> */}
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUserGroupser}
                  >
                    <Option value={0} key="124ssswwwars">全部</Option>
                    {
                      MaintenanceUnitListers && MaintenanceUnitListers.map(item =>
                        <Option value={item.ID} key={item.ID}>{item.LOGIN_NAME}</Option>)}
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item} ${userStyles.syetem_item}`}><span className={styles.item}>日志记录起始时间</span>
                <div style={{ marginRight: '20px' }} className={styles.inSle}>
                  <DatePicker style={{ width: '200px' }} value={moment(ManagementStart, this.dateFormat)} format={this.dateFormat} onChange={this.sInstallationLocationsStart} />
                </div>
                至
                <div style={{ marginLeft: '20px' }} className={styles.inSle}>
                  <DatePicker style={{ width: '200px' }} value={moment(ManagementUnit, this.dateFormat)} format={this.dateFormat} onChange={this.sInstallationLocationsEnd} />
                </div>
              </div>
              {
                userLimit && userLimit.indexOf(24) !== -1 ?
                  <span style={{ right: '160px' }} className={styles.searchBtn} onClick={() => { this.handlePagination('1') }} limitid="24">查询</span> : null
              }
              {
                userLimit && userLimit.indexOf(24) !== -1 ?
                  <span className={styles.searchBtn} onClick={this.exportTable} limitid="24">导出EXCEL</span> : null
              }
              <i className={styles.line} />
            </div>
            <div className={styles.syetem_buttom}>
              <div className={styles.title} />
              <div className={styles.listBox}>
                <div className={styles.listItems}>
                  <div className={styles.listTd} >路口</div>
                  <div className={styles.listTd} >所属区域</div>
                  <div className={styles.listTd} >控制时间</div>
                  <div className={styles.listTd} >控制类型</div>
                  <div className={styles.listTd} >具体控制</div>
                  <div className={styles.listTd} >操作用户</div>
                  <div className={styles.listTd} >用户真实姓名</div>
                  <div className={styles.listTd} >控制结果</div>
                  <div className={styles.listTd} >操作</div>
                </div>
                {!!systemList && systemList.map((item, index) => {
                  return (
                    <div className={styles.listItems} key={item + index}>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.UNIT_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.DISTRICT_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.UPDATE_TIME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.CODE_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.controlName}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.LOGIN_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.REAL_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.CONTROL_RESULT}</span></div>
                      <div className={styles.listTd} >
                        {
                          userLimit && userLimit.indexOf(26) !== -1 ?
                            <span className={styles.delectName} onClick={() => { this.getfaciDelete(item.ID, item.UPDATE_TIME) }} limitid="26">
                              <Icon type="close" className={styles.icon} />删除
                            </span> : null
                        }
                      </div>
                    </div>)
                })}
                {
                  !!systemList && systemList.length === 0 ? <div className={styles.noData}>当前查询无数据</div> : null
                }
              </div>
            </div>
          </div>
          <div className={styles.pagination}>
            <div className={styles.page}><span className={styles.count}>当前共{totalCount}条，每页显示10条</span><Pagination showQuickJumper current={current} total={totalCount} onChange={this.handlePagination} /></div>
          </div>
        </div>
        {/* <Nav /> */}
        {/* <SystemNav /> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.logManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getsigdelete: bindActionCreators(getsigdelete, dispatch),
    getsigexportExcelThing: bindActionCreators(getsigexportExcelThing, dispatch),
    getsigloadDistrict: bindActionCreators(getsigloadDistrict, dispatch),
    getsigloadSignalControlLogList: bindActionCreators(getsigloadSignalControlLogList, dispatch),
    getsigloadUnit: bindActionCreators(getsigloadUnit, dispatch),
    getsigloadUser: bindActionCreators(getsigloadUser, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(signalcontrolrecord) 
