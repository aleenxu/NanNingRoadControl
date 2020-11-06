import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, Select, TimePicker, message, Modal, Input } from 'antd'
import moment from 'moment'
import styles from './TimeTable.scss'

import { getTimeTable, getDeleteTimeTable, getTimetableActions, getSaveTimeTable } from '../../../../actions/interCofig'

class TimeTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      timeTable: null,
      showEditBox: false,
      defaultOrderNo: null,
      defaultTime: '12:00',
      defaultAction: null,
      timeTableActions: null,
      isEdit: true,
      intervalNo: null,
    }
    this.orderList = []
    this.saveParams = {
      action: 0,
      id: 0,
      orderNo: 0,
      startTime: '00:00',
      timeintervalNo: 0,
      unitId: 0,
    }
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.props.getTimeTable(this.InterId)
    this.props.getTimetableActions(this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { timeTable, deleteTimeTable, timeTableActions } = this.props.data
    if (prevState.data.timeTable !== timeTable) {
      this.getTimeTable(timeTable)
    }
    if (prevState.data.deleteTimeTable !== deleteTimeTable) {
      message.info(deleteTimeTable)
    }
    if (prevState.data.timeTableActions !== timeTableActions) {
      this.getTimetableActionList(timeTableActions)
    }
  }
  getTimeTable = (timeTable) => {
    this.setState({ timeTable })
  }
  getTimetableActionList = (timeTableActions) => {
    this.setState({ timeTableActions })
  }
  handleEdit = (items) => {
    console.log(items, '当前')
    this.saveParams = {
      action: items.PLAN || 1,
      id: items.ID,
      orderNo: items.ORDER_NO,
      startTime: items.START_TIME,
      timeintervalNo: items.TIME_INTERVAL_NO,
      unitId: this.InterId,
    }
    this.orderList = []
    if (this.state.timeTable.length) {
      this.state.timeTable.forEach((item) => {
        if (item.ORDER_NO !== items.ORDER_NO) {
          this.orderList.push(item.ORDER_NO)
        }
      })
    }
    this.setState({
      showEditBox: true,
      defaultOrderNo: items.ORDER_NO,
      defaultTime: items.START_TIME,
      defaultAction: items.PLAN,
      intervalNo: items.TIME_INTERVAL_NO,
      isEdit: true,
    })
  }
  handleCloseEdit = () => {
    this.setState({ showEditBox: false })
  }
  handleDelete = (e) => {
    const id = e.target.getAttribute('id')
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteTimeTable(id).then((res) => {
          const { code } = res.data
          if (code === 200) {
            selfThis.props.getTimeTable(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleSaveTimeTalbe = () => {
    this.props.getSaveTimeTable(this.saveParams).then((res) => {
      const { code } = res.data
      if (code === 200) {
        this.props.getTimeTable(this.InterId)
      }
      this.setState({ showEditBox: false })
      message.info(res.data.message)
    })
  }
  handleChangeTimeNo = (e) => {
    this.saveParams.timeintervalNo = e.target.value
  }
  handleChangeTimeOrder = (e) => {
    this.saveParams.orderNo = e.target.value
  }
  handleChangeTime = (moment, time) => {
    this.saveParams.startTime = time
  }
  handleChangeAction = (value, options) => {
    this.saveParams.action = options.key
  }
  handleAddTimeTable = () => {
    this.setState({
      showEditBox: true,
      isEdit: false,
      defaultOrderNo: 1,
      intervalNo: 1,
    })
    this.saveParams = {
      action: 1,
      id: 0,
      orderNo: 1,
      startTime: '12:00',
      timeintervalNo: 1,
      unitId: this.InterId,
    }
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const {
      timeTable, showEditBox, defaultTime, defaultOrderNo, defaultAction, timeTableActions, isEdit, intervalNo,
    } = this.state
    const { Option } = Select
    const format = 'HH:mm'
    return (
      <div className={styles.phaseConfigBox}>
        {
          showEditBox &&
          <div className={styles.editBox}>
            <div className={styles.editDetails}>
              <div className={styles.editTitle}>
                编辑时段表信息
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItems}>时段表号</div>
                <div className={styles.editItems}>
                  <Input defaultValue={defaultOrderNo} disabled={isEdit} onChange={this.handleChangeTimeOrder} />
                </div>
                <div className={styles.editItems}>时段号</div>
                <div className={styles.editItems} style={{ flex: 1.2 }}>
                  <Input defaultValue={intervalNo} disabled={isEdit} onChange={this.handleChangeTimeNo} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItems}>开始时间</div>
                <div className={styles.editItems}>
                  <TimePicker key={defaultTime} defaultValue={moment(defaultTime, format)} format={format} minuteStep={15} allowClear={false} onChange={this.handleChangeTime} />
                </div>
                <div className={styles.editItems}>关联方案</div>
                <div className={styles.editItems} style={{ flex: 1.2 }}>
                  <Select defaultValue={defaultAction ? `方案${defaultAction}` : `方案${timeTableActions[0]}`} onChange={this.handleChangeAction}>
                    {
                      timeTableActions &&
                      timeTableActions.map((item) => {
                        return (
                          <Option key={item} value={`方案${item}`}>方案{item}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveTimeTalbe}>确定</div>
              </div>
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>时段表配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
          <div className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddTimeTable}>添加</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>时段表号</div>
            <div className={styles.mountingTh}>时段号</div>
            <div className={styles.mountingTh}>开始时间</div>
            <div className={styles.mountingTh}>关联方案</div>
            <div className={styles.mountingTh}> 操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              timeTable && timeTable.length > 0 &&
              timeTable.map((item) => {
                return (
                  <div className={styles.mountingTr} key={item.ID}>
                    <div className={styles.mountingTd}>{item.ORDER_NO}</div>
                    <div className={styles.mountingTd}>{item.TIME_INTERVAL_NO}</div>
                    <div className={styles.mountingTd}>{item.START_TIME}</div>
                    <div className={styles.mountingTd}>方案{item.PLAN}</div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleEdit(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span id={item.ID} onClick={this.handleDelete}>删除</span></div>
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
    getTimeTable: bindActionCreators(getTimeTable, dispatch),
    getDeleteTimeTable: bindActionCreators(getDeleteTimeTable, dispatch),
    getTimetableActions: bindActionCreators(getTimetableActions, dispatch),
    getSaveTimeTable: bindActionCreators(getSaveTimeTable, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(TimeTable)
