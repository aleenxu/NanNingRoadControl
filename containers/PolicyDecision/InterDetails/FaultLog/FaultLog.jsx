import React from 'react'
import { Icon, Select } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './FaultLog.scss'

import { getFaultLogList } from '../../../../actions/interCofig'

class FaultLog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      faultLogList: null,
    }
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.props.getFaultLogList(1, this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { faultLogList } = this.props.data
    if (prevState.data.faultLogList !== faultLogList) {
      this.getFaultLog(faultLogList)
    }
  }
  getFaultLog = (faultLogList) => {
    this.setState({ faultLogList })
  }
  handleChangeType = (value, options) => {
    this.props.getFaultLogList(options.key, this.InterId)
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { Option } = Select
    return (
      <div className={styles.phaseConfigBox}>
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>故障日志</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          {/* <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddTimingPlan}>添加</div> */}
          <div className={styles.faultType}>
            <span>故障类型：</span>
            <Select defaultValue="1" onChange={this.handleChangeType}>
              <Option key="1" value="1">信号机故障</Option>
              <Option key="2" value="2">通信故障</Option>
            </Select>
          </div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>序号</div>
            <div className={styles.mountingTh}>类型</div>
            <div className={styles.mountingTh}>故障时间</div>
            <div className={styles.mountingTh}>事件</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              this.state.faultLogList &&
              this.state.faultLogList.map((item, index) => {
                return (
                  <div className={styles.mountingTr} key={index + item.LOG_TYPE}>
                    <div className={styles.mountingTd}>{index + 1}</div>
                    <div className={styles.mountingTd}>主控板</div>
                    <div className={styles.mountingTd}>{item.ALARM_TIME}</div>
                    <div className={styles.mountingTd}>{item.CODE_NAME}</div>
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
    getFaultLogList: bindActionCreators(getFaultLogList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(FaultLog)
