import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, Select, message, Pagination, Modal, DatePicker } from 'antd'
import roadStyles from '../Roadtraffic.scss'
import styles from '../TrafficSystem.scss'
import userStyles from './SystemFaultLog.scss'
import { getalaloadDistrict, getalaloadUnit, getalaloadAlarmLogList, getaladelete, getalaexportExcelThing } from '../../../actions/logManagement'

const { Option } = Select
const { confirm } = Modal
// 日志管理
class TrafficMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: null,
      systemList: null,
      userLimit: null,
      current: 1,
      MaintenanceUnitList: [],
      MaintenanceUnitLister: [],
      ManagementStart: '2019-01-01 00:00:00',
      ManagementUnit: this.formatDate(new Date() * 1),
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
  }
  componentDidMount = () => {
    this.props.getalaloadDistrict()
    this.props.getalaloadUnit()
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getalaloadAlarmLogList(str)
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    const userLimit = []
    limitArr.forEach((item) => {
      userLimit.push(item.id)
    })
    this.setState({ userLimit })
  }
  componentDidUpdate = (prevState) => {
    const { alaloadDistrict, alaloadUnit, alaloadAlarmLogList, alaexportExcelThing } = this.props.data
    if (prevState.data.alaloadDistrict !== alaloadDistrict) {
      this.getalaloadDistricts(alaloadDistrict)
    }
    if (prevState.data.alaloadUnit !== alaloadUnit) {
      this.getalaloadUnits(alaloadUnit)
    }
    if (prevState.data.alaloadAlarmLogList !== alaloadAlarmLogList) {
      this.getalaloadAlarmLogLists(alaloadAlarmLogList)
    }
    if (prevState.data.alaexportExcelThing !== alaexportExcelThing) {
      this.getalaexportExcelThings(alaexportExcelThing)
    }
  }
  getalaexportExcelThings = (getTimingInfoByExcel) => {
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
  getalaloadDistricts = (alaloadDistrict) => {
    this.setState({
      MaintenanceUnitList: alaloadDistrict,
    })
  }
  getalaloadUnits = (alaloadUnit) => {
    this.setState({
      MaintenanceUnitLister: alaloadUnit,
    })
  }
  getalaloadAlarmLogLists = (loadSystemOperationLogList) => {
    this.setState({ systemList: loadSystemOperationLogList.list, totalCount: loadSystemOperationLogList.page.totalSize, current: Number(loadSystemOperationLogList.page.fromPage) })
  }
  getaddMenu = () => {
    this.dataList = {
      name: '',
      parentId: '0',
      path: '',
      perms: '',
      sort: '',
      type: 0,
    }
    this.setState({ dataList: this.dataList })
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
  // 转格式
  exportTable = () => {
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getalaexportExcelThing(str)
  }
  delectList = (userid, times) => {
    this.props.getaladelete(userid, times).then((res) => {
      if (res.data.code === 200) {
        message.info('删除成功')
        const { ManagementStart, ManagementUnit } = this.state
        const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
        this.props.getalaloadAlarmLogList(str)
      }
    })
  }
  handlePagination = (pageNumber) => {
    this.page = pageNumber
    const { ManagementStart, ManagementUnit } = this.state
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getalaloadAlarmLogList(str)
  }
  handleInputChangeUser = (value) => {
    this.dateListUser = value
  }
  handleInputChangeUserGroups = (value) => {
    this.dateListUserGroups = value
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
    const str = `beginDate=${ManagementStart}&endDate=${ManagementUnit}&fromPage=${this.page}&pagesize=${this.pageNum}&unitId=${this.dateListUserGroups}&districtId=${this.dateListUser}`
    this.props.getalaloadAlarmLogList(str)
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
      systemList, totalCount, current, userLimit, MaintenanceUnitList,
      ManagementUnit, MaintenanceUnitLister, ManagementStart,
    } = this.state
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
                    <Option value={0} key="124ssswwwa">全部</Option>
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
                  <div className={styles.listTd} >路口</div>
                  <div className={styles.listTd} >所属区域</div>
                  <div className={styles.listTd} >设备名称</div>
                  <div className={styles.listTd} >故障名称</div>
                  <div className={styles.listTd} >故障类型</div>
                  <div className={styles.listTd} >记录时间</div>
                  <div className={styles.listTd} >描述</div>
                  <div className={styles.listTd} >操作</div>
                </div>
                {!!systemList && systemList.map((item, index) => {
                  return (
                    <div className={styles.listItems} key={item + index}>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.UNIT_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.DISTRICT_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.DEVICE_NAME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.DETAIL}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.T_TYPE}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.UPDATE_TIME}</span></div>
                      <div className={styles.listTd} ><span className={styles.roadName}>{item.ALARM_NAME}</span></div>
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
    getalaloadDistrict: bindActionCreators(getalaloadDistrict, dispatch),
    getalaloadUnit: bindActionCreators(getalaloadUnit, dispatch),
    getalaloadAlarmLogList: bindActionCreators(getalaloadAlarmLogList, dispatch),
    getaladelete: bindActionCreators(getaladelete, dispatch),
    getalaexportExcelThing: bindActionCreators(getalaexportExcelThing, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(TrafficMenu)
