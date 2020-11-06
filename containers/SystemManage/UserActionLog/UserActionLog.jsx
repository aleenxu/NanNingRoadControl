import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Select, Pagination, DatePicker } from 'antd'
import Nav from '../Nav/Nav'
import roadStyles from '../Roadtraffic.scss'
import styles from '../TrafficSystem.scss'
import userStyles from './UserActionLog.scss'
import SystemNav from '../SystemNav/SystenNav'
import { getloadManageMent, getloaduser, getloadSystemOperationLogList, getexportExcelThing } from '../../../actions/logManagement'

const { Option } = Select
// 日志管理
class TrafficMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: null,
      systemList: null,
      userLimit: null,
      current: 1,
      MaintenanceUnitList: [], // 所属用户
      MaintenanceUnitLister: [], // 所属用户组
      ManagementStart: '2019-01-01 00:00:00',
      ManagementUnit: this.formatDate(new Date() * 1),
    }
    this.num = 1
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
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    const userLimit = []
    this.props.getloadManageMent()
    this.props.getloaduser()
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userGroup=${this.dateListUserGroups}&userId=${this.dateListUser}`
    this.props.getloadSystemOperationLogList(str)
    limitArr.forEach((item) => {
      userLimit.push(item.id)
    })
    this.setState({ userLimit })
  }
  componentDidUpdate = (prevState) => {
    const { loadManageMenter, loaduser, loadSystemOperationLogList, exportExcelThing } = this.props.data
    if (prevState.data.loadManageMenter !== loadManageMenter) {
      this.getloadManageMenters(loadManageMenter)
    }
    if (prevState.data.loaduser !== loaduser) {
      this.getloadusers(loaduser)
    }
    if (prevState.data.loadSystemOperationLogList !== loadSystemOperationLogList) {
      this.getloadSystemOperationLogLists(loadSystemOperationLogList)
    }
    if (prevState.data.exportExcelThing !== exportExcelThing) {
      this.getexportExcelThings(exportExcelThing)
    }
  }
  getexportExcelThings = (getTimingInfoByExcel) => {
    const blob = new Blob([getTimingInfoByExcel], { type: 'application/vnd.ms-excel,charset=utf-8' })
    const a = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    a.href = href
    document.body.appendChild(a)
    // a.click()
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    document.body.removeChild(a)
    window.URL.revokeObjectURL(href)
  }
  getloadManageMenters = (loadManageMenter) => { // 所属用户组下拉框
    this.setState({
      MaintenanceUnitLister: loadManageMenter,
    })
  }
  getloadusers = (loaduser) => { // 所属用户下拉框
    this.setState({
      MaintenanceUnitList: loaduser,
    })
  }
  getloadSystemOperationLogLists = (loadSystemOperationLogList) => { // 分页查询列表
    this.setState({ systemList: loadSystemOperationLogList.list, totalCount: loadSystemOperationLogList.page.totalSize, current: Number(loadSystemOperationLogList.page.fromPage) })
  }
  handleInputChangeUser = (value) => {
    this.dateListUser = value
  }
  handleInputChangeUserGroups = (value) => {
    this.dateListUserGroups = value
  }
  handlePagination = (pageNumber) => {
    this.page = pageNumber
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userGroup=${this.dateListUserGroups}&userId=${this.dateListUser}`
    this.props.getloadSystemOperationLogList(str)
  }
  searchPage = () => {
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&userGroup=${this.dateListUserGroups}&userId=${this.dateListUser}`
    this.props.getloadSystemOperationLogList(str)
  }
  sInstallationLocationsStart = (date) => {
    this.ManagementUnitNumber = new Date(date._d) * 1
    this.setState({
      ManagementStart: this.formatDate(new Date(date._d) * 1),
    })
  }
  sInstallationLocationsEnd = (date) => {
    this.ManagementUnitNumber = new Date(date._d) * 1
    this.setState({
      ManagementUnit: this.formatDate(new Date(date._d) * 1),
    })
  }
  exportTable = () => {
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&userGroup=${this.dateListUserGroups}&userId=${this.dateListUser}`
    this.props.getexportExcelThing(str)
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
    const {
      systemList, totalCount, current, userLimit, ManagementStart,
      MaintenanceUnitList, ManagementUnit, MaintenanceUnitLister,
    } = this.state
    return (
      <div className={(roadStyles.Roadtcontent)}>
        {/* 地图 */}
        <div id="mapContainer" className={classNames(roadStyles.mapContainer, styles.mapContainer)} >
          <div className={styles.syetem_bg}>
            <div className={styles.syetem_top}>
              <div className={`${styles.syetem_item} ${userStyles.syetem_item}`}><span className={styles.item}>所属用户</span>
                <div className={styles.inSle}>
                  <Select
                    onChange={this.handleInputChangeUser}
                    defaultValue="全部"
                  >
                    <Option value={0} key="124ssswwwa">全部</Option>
                    {
                      MaintenanceUnitList && MaintenanceUnitList.map(item =>
                        <Option value={item.ID} key={item.ID}>{item.LOGIN_NAME}</Option>)}
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item} ${userStyles.syetem_item}`}><span className={styles.item}>所属用户组</span>
                <div className={styles.inSle}>
                  <Select
                    onChange={this.handleInputChangeUserGroups}
                    defaultValue="全部"
                  >
                    <Option value={0} key="124ssswwwar">全部</Option>
                    {
                      MaintenanceUnitLister && MaintenanceUnitLister.map(item =>
                        <Option value={item.ID} key={item.ID}>{item.USER_GROUP_NAME}</Option>)}
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
                  <span style={{ right: '160px' }} className={styles.searchBtn} onClick={this.searchPage} limitid="24">查询</span> : null
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
                  <div className={styles.listTd} >用户名称</div>
                  <div className={styles.listTd} >所属用户组</div>
                  <div className={styles.listTd} >IP</div>
                  <div className={styles.listTd} >操作模块</div>
                  <div className={styles.listTd} >操作动作</div>
                  <div className={styles.listTd} >操作时间</div>
                </div>
                {!!systemList && systemList.map((item, index) => {
                  return (
                    <div className={styles.listItems} key={item + index}>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.LOGIN_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.USER_GROUP_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.IP}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.DETAIL}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.OPERATION_TIME}</span></div>
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
        <SystemNav />
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
    getloadManageMent: bindActionCreators(getloadManageMent, dispatch),
    getloaduser: bindActionCreators(getloaduser, dispatch),
    getloadSystemOperationLogList: bindActionCreators(getloadSystemOperationLogList, dispatch),
    getexportExcelThing: bindActionCreators(getexportExcelThing, dispatch),
  }
}

export default connect(mapStateToProps, mapDisPatchToProps)(TrafficMenu) 
