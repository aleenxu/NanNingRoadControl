import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, Select, Checkbox, message, Modal } from 'antd'
import styles from './Schedule.scss'

import { getScheduleList, getRimgIntervalList, getScheduleNoList, getSaveScheduleInfo, getDeleteScheduleInfo } from '../../../../actions/interCofig'

class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduleList: null,
      showEditBox: false,
      timeIntervalList: null,
      scheduleNoList: null,
      scheduleMsg: null,
    }
    this.monthPlan = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    this.dayPlan = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    this.coordPhases = []
    this.weekPlan = [
      { week: '星期日', weekId: 1 },
      { week: '星期一', weekId: 2 },
      { week: '星期二', weekId: 3 },
      { week: '星期三', weekId: 4 },
      { week: '星期四', weekId: 5 },
      { week: '星期五', weekId: 6 },
      { week: '星期六', weekId: 7 },
    ]
    this.saveParams = {
      id: 0,
      scheduleDay: 1,
      scheduleMonth: 1,
      scheduleNo: 0,
      scheduleWeek: 1,
      timeintervalNo: 0,
      unitId: 0,
    }
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.props.getScheduleList(this.InterId)
    this.props.getRimgIntervalList(this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { scheduleList, timeIntervalList, scheduleNoList } = this.props.data
    if (prevState.data.scheduleList !== scheduleList) {
      this.getScheduleDetails(scheduleList)
    }
    if (prevState.data.timeIntervalList !== timeIntervalList) {
      this.getTimeIntervalLists(timeIntervalList)
    }
    if (prevState.data.scheduleNoList !== scheduleNoList) {
      this.getScheduleNoLists(scheduleNoList)
    }
  }
  getScheduleDetails = (scheduleList) => {
    this.setState({ scheduleList })
  }
  getTimeIntervalLists = (timeIntervalList) => {
    this.setState({ timeIntervalList })
  }
  getScheduleNoLists = (scheduleNoList) => {
    this.setState({ scheduleNoList })
  }
  // 编辑
  handleEditSchedule = (scheduleItem) => {
    console.log(scheduleItem)
    this.saveParams = {
      id: scheduleItem.ID,
      scheduleDay: scheduleItem.SCHEDULEDAY,
      scheduleMonth: scheduleItem.SCHEDULEMONTH,
      scheduleNo: scheduleItem.SCHEDULENO,
      scheduleWeek: scheduleItem.SCHEDULEWEEK,
      timeintervalNo: scheduleItem.TIME_INTERVAL_NO,
      unitId: this.InterId,
    }
    this.setState({ showEditBox: true, scheduleMsg: scheduleItem })
    this.props.getScheduleNoList(scheduleItem.ID, this.InterId)
  }
  handleCloseEdit = () => {
    this.setState({ showEditBox: false })
  }
  handleChangeSchedulePlan = (e) => {
    console.log(e)
    const { id, pname, checked } = e.target
    const planArr = this.saveParams[pname] && this.saveParams[pname].length > 0 ? this.saveParams[pname].split(',') : []
    const indexs = planArr.indexOf(String(id))
    if (checked) {
      planArr.push(id)
    } else {
      planArr.splice(indexs, 1)
    }
    this.saveParams[pname] = planArr.join(',')
  }
  handleAddSchedule = () => {
    this.props.getScheduleNoList(0, this.InterId)
    this.saveParams = {
      id: 0,
      scheduleDay: '',
      scheduleMonth: '',
      scheduleNo: 1,
      scheduleWeek: '',
      timeintervalNo: 1,
      unitId: this.InterId,
    }
    const scheduleMsg = {
      SCHEDULEDAY: '',
      SCHEDULEMONTH: '',
      SCHEDULEWEEK: '',
      SCHEDULENO: 1,
      TIME_INTERVAL_NO: 1,
    }
    this.setState({ scheduleMsg, showEditBox: true })
  }
  handleSaveSchedule = () => {
    this.props.getSaveScheduleInfo(this.saveParams).then((res) => {
      if (res.data.code === 200) {
        this.props.getScheduleList(this.InterId)
        this.setState({ showEditBox: false })
      }
      message.info(res.data.message)
    })
  }
  handleDeleteSchedule = (id) => {
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteScheduleInfo(id).then((res) => {
          if (res.data.code === 200) {
            selfThis.props.getScheduleList(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleChangeScheduleNo = (value, options) => {
    const { pname } = options.props
    this.saveParams[pname] = value
  }
  calculateArrange = (source) => {
    let t
    let ta = []
    const r = []
    const orderArr = []
    const sortSource = source.split(',').map(item => Number(item)).sort((a, b) => a - b)
    sortSource.forEach((v) => {
      if (t === Number(v)) {
        ta.push(t)
        t += 1
        return
      }

      ta = [v]
      t = Number(v) + 1
      r.push(ta)
    })
    r.forEach((item) => {
      if (item.length >= 3) {
        orderArr.push(`${item[0]}-${item[item.length - 1]}`)
      } else {
        orderArr.push(item.join(','))
      }
    })
    return orderArr.join(',')
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { Option } = Select
    const { scheduleList, showEditBox, timeIntervalList, scheduleNoList, scheduleMsg } = this.state
    return (
      <div className={styles.phaseConfigBox}>
        {
          showEditBox &&
          <div className={styles.editBox}>
            <div className={styles.editDetails}>
              <div className={styles.editTitle}>
                编辑阶段
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>调度计划号</div>
                <div className={styles.editItems}>
                  <Select defaultValue={scheduleMsg && scheduleMsg.SCHEDULENO} onChange={this.handleChangeScheduleNo}>
                    {
                      scheduleNoList &&
                      new Array(40).fill(true).map((item, index) => {
                        if (scheduleNoList.indexOf(String(index + 1)) === -1) {
                          return (
                            <Option key={`${index + 1}`} value={index + 1} pname="scheduleNo">{index + 1}</Option>
                          )
                        }
                      })
                    }
                  </Select>
                </div>
                <div className={styles.editItemsName}>时段表号</div>
                <div className={styles.editItems}>
                  <Select defaultValue={scheduleMsg && scheduleMsg.TIME_INTERVAL_NO} onChange={this.handleChangeScheduleNo}>
                    {
                      timeIntervalList &&
                      timeIntervalList.map((item) => {
                        return (
                          <Option key={'时段表' + item} value={`${item}`} pname="timeintervalNo">{item}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>月计划</div>
                <div className={styles.editItems} style={{ maxHeight: '85px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {
                    this.monthPlan.map((item) => {
                      const defaultMonth = (scheduleMsg && scheduleMsg.SCHEDULEMONTH) ? scheduleMsg.SCHEDULEMONTH.split(',') : scheduleMsg.SCHEDULEMONTH
                      return (
                        <span className={styles.phaseSelBox} key={item + '月'} style={{ width: '60px' }}>
                          <Checkbox id={`${item}`} pname="scheduleMonth" onChange={this.handleChangeSchedulePlan} defaultChecked={defaultMonth && defaultMonth.indexOf(String(item)) >= 0}>{item}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>日计划</div>
                <div className={styles.editItems} style={{ maxHeight: '85px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {
                    this.dayPlan.map((item) => {
                      const defaultDay = (scheduleMsg && scheduleMsg.SCHEDULEDAY) ? scheduleMsg.SCHEDULEDAY.split(',') : scheduleMsg.SCHEDULEDAY
                      return (
                        <span className={styles.phaseSelBox} key={'日' + item} style={{ width: '60px' }}>
                          <Checkbox id={`${item}`} pname="scheduleDay" onChange={this.handleChangeSchedulePlan} defaultChecked={defaultDay && defaultDay.indexOf(String(item)) >= 0}>{item}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>星期计划</div>
                <div className={styles.editItems}>
                  {
                    this.weekPlan.map((item) => {
                      const defaultWeek = (scheduleMsg && scheduleMsg.SCHEDULEWEEK) ? scheduleMsg.SCHEDULEWEEK.split(',') : scheduleMsg.SCHEDULEWEEK
                      return (
                        <span className={styles.phaseSelBox} key={item.week} style={{ width: '100px' }}>
                          <Checkbox id={`${item.weekId}`} pname="scheduleWeek" onChange={this.handleChangeSchedulePlan} defaultChecked={defaultWeek && defaultWeek.indexOf(String(item.weekId)) >= 0}>{item.week}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveSchedule}>确定</div>
              </div>
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>调度表配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddSchedule}>添加</div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>调度计划号</div>
            <div className={styles.mountingTh}>日计划</div>
            <div className={styles.mountingTh}>月计划</div>
            <div className={styles.mountingTh}>星期计划</div>
            <div className={styles.mountingTh}>时段表号</div>
            <div className={styles.mountingTh}>操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              scheduleList &&
              scheduleList.map((item) => {
                const day = (item.SCHEDULEDAY && item.SCHEDULEDAY.length > 0) ? this.calculateArrange(item.SCHEDULEDAY) : ''
                const month = (item.SCHEDULEMONTH && item.SCHEDULEMONTH.length > 0) ? this.calculateArrange(item.SCHEDULEMONTH) : ''
                const week = (item.SCHEDULEWEEK && item.SCHEDULEWEEK.split(',').length > 0) ? this.calculateArrange(item.SCHEDULEWEEK) : ''
                const weekDays = week.length > 0 && week.split(',').length > 3 ? `${week.substr(0, 1)} - ${week.substr(-1)}` : week
                return (
                  <div className={styles.mountingTr} key={item.ID}>
                    <div className={styles.mountingTd}>{item.SCHEDULENO}</div>
                    <div className={styles.mountingTd}>{`月份：${month}`}</div>
                    <div className={styles.mountingTd}>{`日期：${day}`}</div>
                    <div className={styles.mountingTd}>{`星期：${weekDays.replace('7', '日')}`}</div>
                    <div className={styles.mountingTd}>{item.TIME_INTERVAL_NO}</div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleEditSchedule(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleDeleteSchedule(item.ID) }}>删除</span></div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.interConfig,
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getScheduleList: bindActionCreators(getScheduleList, dispatch),
    getRimgIntervalList: bindActionCreators(getRimgIntervalList, dispatch),
    getScheduleNoList: bindActionCreators(getScheduleNoList, dispatch),
    getSaveScheduleInfo: bindActionCreators(getSaveScheduleInfo, dispatch),
    getDeleteScheduleInfo: bindActionCreators(getDeleteScheduleInfo, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Schedule)
