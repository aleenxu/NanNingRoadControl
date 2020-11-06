import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, Input, Select, Modal, message } from 'antd'
import styles from './PhaseConfig.scss'

import { getPhaseList, getSavePhaseInfo, getDeletePhaseInfo } from '../../../../actions/interCofig'

class PhaseConfig extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      phaseLists: null,
      showPhaseEditBox: false,
      editItemData: null,
    }
    this.saveParams = {
      UnitExtendGreenTime: 0,
      addInitialValue: 0,
      allRedTime: 0,
      beforeDecrementCarNumber: 0,
      beforeDecrementTime: 0,
      concurrentPhaseNos: 'string',
      decrementTime: 0,
      direction: 0,
      firstCycleGreenTime: 0,
      flowDirection: 0,
      followOffPhaseNo: 0,
      greenFlashTime: 0,
      initialState: 0,
      maxGreenTimeOne: 0,
      maxGreenTimeTwo: 0,
      maxInitialValue: 0,
      maxRunTime: 0,
      minGreenTime: 0,
      minInterval: 0,
      minRedTime: 0,
      noninductive: 0,
      other: 0,
      peopleGreenFlashTime: 0,
      peopleGreenTime: 0,
      phaseName: 'string',
      phaseNo: 0,
      redYellowTime: 0,
      ringNo: 0,
      runStepSize: 0,
      safeRedTime: 0,
      setByBit: 0,
      unitDecrementValue: 0,
      unitExtendGreenTime: 0,
      unitId: 0,
      yellowTime: 0,
    }
    this.direction = [
      { dir: '无', id: 0 },
      { dir: '北', id: 1 },
      { dir: '东北', id: 2 },
      { dir: '东', id: 3 },
      { dir: '东南', id: 4 },
      { dir: '南', id: 5 },
      { dir: '西南', id: 6 },
      { dir: '西', id: 7 },
      { dir: '西北', id: 8 },
    ]
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.saveParams.unitId = this.InterId
    this.props.getPhaseList(this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { phaseLists } = this.props.data
    if (prevState.data.phaseLists !== phaseLists) {
      this.getPhaseLists(phaseLists)
    }
  }
  getPhaseLists = (phaseLists) => {
    this.setState({ phaseLists })
  }
  getPhaseEditMsg = (itemMsg) => {
    console.log(itemMsg)
    const editItem = [
      { name: '相位编号', paramsName: 'phaseNo', value: itemMsg.PHASE_NO },
      { name: '相位名称', paramsName: 'phaseName', value: itemMsg.PHASE_NAME },
      { name: '所属环', paramsName: 'ringNo', value: itemMsg.RING_NO },
      { name: '红黄时间', paramsName: 'redYellowTime', value: itemMsg.RED_YELLOW_TIME },
      { name: '绿闪时间', paramsName: 'greenFlashTime', value: itemMsg.GREEN_FLASH_TIME },
      { name: '安全红灯', paramsName: 'safeRedTime', value: itemMsg.SAFE_RED_TIME },
      { name: '第一周期绿灯', paramsName: 'firstCycleGreenTime', value: itemMsg.FIRST_CYCLE_GREEN_TIME },
      { name: '跟随同断相位', paramsName: 'followOffPhaseNo', value: itemMsg.FOLLOW_OFF_PHASE_NO },
      { name: '最大初始值', paramsName: 'maxInitialValue', value: itemMsg.MAX_INITIAL_VALUE },
      { name: '递减前时间', paramsName: 'beforeDecrementTime', value: itemMsg.BEFORE_DECREMENT_TIME },
      { name: '递减前车辆', paramsName: 'beforeDecrementCarNumber', value: itemMsg.BEFORE_DECREMENT_CAR_NUMBER },
      { name: '递减时间', paramsName: 'decrementTime', value: itemMsg.DECREMENT_TIME },
      { name: '单位递减率', paramsName: 'unitDecrementValue', value: itemMsg.UNIT_DECREMENT_VALUE },
      { name: '最小间隔', paramsName: 'minInterval', value: itemMsg.MIN_INTERVAL },
      { name: '行人放行', paramsName: 'peopleGreenTime', value: itemMsg.PEOPLE_GREEN_TIME },
      { name: '行人清空', paramsName: 'peopleGreenFlashTime', value: itemMsg.PEOPLE_GREEN_FLASH_TIME },
      { name: '并发相位', paramsName: 'concurrentPhaseNos', value: itemMsg.CONCURRENT_PHASE_NO_LIST },
      { name: '初始状态', paramsName: 'initialState', value: itemMsg.INITIAL_STATE },
      { name: '非感应', paramsName: 'noninductive', value: itemMsg.NONINDUCTIVE },
      { name: '对应方向', paramsName: 'direction', value: itemMsg.DIRECTION, type: 'select' },
      { name: '对应车道方向', paramsName: 'flowDirection', value: itemMsg.FLOW_DIRECTION },
      { name: '最小绿', paramsName: 'minGreenTime', value: itemMsg.MIN_GREEN_TIME },
      { name: '最大绿1', paramsName: 'maxGreenTimeOne', value: itemMsg.MAX_GREEN_TIME_ONE },
      { name: '最大绿2', paramsName: 'maxGreenTimeTwo', value: itemMsg.MAX_GREEN_TIME_TWO },
      { name: '单位延长绿', paramsName: 'UnitExtendGreenTime', value: itemMsg.UNIT_EXTEND_GREEN_TIME },
      { name: '最大限制值', paramsName: 'maxRunTime', value: itemMsg.MAX_RUN_TIME },
      { name: '动态步长', paramsName: 'runStepSize', value: itemMsg.RUN_STEP_SIZE },
      { name: '黄灯时间', paramsName: 'yellowTime', value: itemMsg.YELLOW_TIME },
      { name: '全红时间', paramsName: 'allRedTime', value: itemMsg.ALL_RED_TIME },
      { name: '红灯保护', paramsName: 'minRedTime', value: itemMsg.MIN_RED_TIME },
      { name: '增加初始值', paramsName: 'addInitialValue', value: itemMsg.ADD_INITIAL_VALUE },
      { name: '按位设置', paramsName: 'setByBit', value: itemMsg.SET_BY_BIT },
    ]
    editItem.forEach((item) => {
      this.saveParams[item.paramsName] = item.value
    })
    console.log(this.saveParams)
    this.setState({ editItemData: editItem })
  }
  handleEditPhaseMsg = (itemMsg) => {
    this.saveType = 1
    this.setState({ showPhaseEditBox: true })
    this.getPhaseEditMsg(itemMsg)
  }
  handlePhaseMsgChange = (e) => {
    const paramsName = e.target.getAttribute('paramsname')
    const { value } = e.target
    this.saveParams[paramsName] = value
    console.log(this.saveParams)
  }
  handleCloseEdit = () => {
    this.setState({ showPhaseEditBox: false })
  }
  handleDirChange = (val, options) => {
    const { value, paramsname } = options.props
    this.saveParams[paramsname] = value
  }
  handleSavePhaseInfo = () => {
    this.props.getSavePhaseInfo(this.saveType, this.saveParams).then((res) => {
      console.log(res)
      const { code } = res.data
      if (code === 200) {
        this.props.getPhaseList(this.InterId)
        this.setState({ showPhaseEditBox: false })
      }
      message.info(res.data.message)
    })
  }
  handleAddPhase = () => {
    const defaultPhaseMsg = {
      MIN_GREEN_TIME: 14,
      FLOW_DIRECTION: 0,
      UNIT_ID: this.InterId,
      FIRST_CYCLE_GREEN_TIME: 0,
      MAX_GREEN_TIME_ONE: 60,
      PEOPLE_GREEN_TIME: 0,
      MIN_RED_TIME: 0,
      RING_NO: 1,
      MAX_RUN_TIME: 0,
      PHASE_NAME: '相位0',
      RED_YELLOW_TIME: 3,
      MAX_INITIAL_VALUE: 80,
      ALL_RED_TIME: 0,
      UNIT_EXTEND_GREEN_TIME: 0,
      PHASE_NO: 1,
      NONINDUCTIVE: 1,
      BEFORE_DECREMENT_CAR_NUMBER: 0,
      CONCURRENT_PHASE_NO_LIST: '5,6,7,8',
      UNIT_DECREMENT_VALUE: 0,
      YELLOW_TIME: 30,
      BEFORE_DECREMENT_TIME: 120,
      MIN_INTERVAL: 0,
      PEOPLE_GREEN_FLASH_TIME: 5,
      SET_BY_BIT: 34,
      SAFE_RED_TIME: 0,
      DIRECTION: 0,
      RUN_STEP_SIZE: 0,
      MAX_GREEN_TIME_TWO: 0,
      OTHER: 28,
      GREEN_FLASH_TIME: 4,
      DECREMENT_TIME: 0,
      INITIAL_STATE: 0,
      ADD_INITIAL_VALUE: 100,
      FOLLOW_OFF_PHASE_NO: 0,
    }
    this.saveType = 0
    this.setState({ showPhaseEditBox: true })
    this.getPhaseEditMsg(defaultPhaseMsg)
  }
  handleDeletePhase = (e) => {
    const phaseNo = e.target.getAttribute('phaseno')
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeletePhaseInfo(phaseNo, selfThis.InterId).then((res) => {
          const { code } = res.data
          if (code === 200) {
            selfThis.props.getPhaseList(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { phaseLists, showPhaseEditBox, editItemData } = this.state
    const { Option } = Select
    return (
      <div className={styles.phaseConfigBox}>
        {
          showPhaseEditBox &&
          <div className={styles.phaseEditBox}>
            <div className={styles.phaseEditDetails}>
              <div className={styles.editTitle}>
                编辑车道表信息
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.detailsBox}>
                {
                  editItemData &&
                  editItemData.map((item) => {
                    return (
                      <div className={styles.msgItems} key={item.name + item.value}>
                        <div className={styles.itemText}>{item.name}</div>
                        <div className={styles.itemValue}>
                          {
                            item.type ?
                              <Select defaultValue={item.value} onChange={this.handleDirChange}>
                                {
                                  this.direction.map(dirItem => (
                                    <Option key={dirItem.id} value={dirItem.id} paramsname={item.paramsName}>{dirItem.dir}</Option>
                                  ))
                                }
                              </Select> :
                              <Input paramsname={item.paramsName} type="text" defaultValue={item.value} onChange={this.handlePhaseMsgChange} />
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className={styles.subBtnBox}>
                <div className={styles.subBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.subBtn} onClick={this.handleSavePhaseInfo}>确定</div>
              </div>
            </div>
          </div>

        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>相位配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
          <div className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddPhase}>添加</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>相位编号</div>
            <div className={styles.mountingTh}>相位名称</div>
            {/* <div className={styles.mountingTh}>相序环号</div> */}
            <div className={styles.mountingTh}>最小绿</div>
            <div className={styles.mountingTh}>最大绿1</div>
            <div className={styles.mountingTh}>最大绿2</div>
            <div className={styles.mountingTh}>操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              phaseLists &&
              phaseLists.map((item) => {
                return (
                  <div className={styles.mountingTr} key={item.PHASE_NO}>
                    <div className={styles.mountingTd}>{item.PHASE_NO}</div>
                    <div className={styles.mountingTd}>{item.PHASE_NAME}</div>
                    {/* <div className={styles.mountingTd}>{item.RING_NO}</div> */}
                    <div className={styles.mountingTd}>{item.MIN_GREEN_TIME}</div>
                    <div className={styles.mountingTd}>{item.MAX_GREEN_TIME_ONE}</div>
                    <div className={styles.mountingTd}>{item.MAX_GREEN_TIME_TWO}</div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleEditPhaseMsg(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span phaseno={item.PHASE_NO} onClick={this.handleDeletePhase}>删除</span></div>
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
    getPhaseList: bindActionCreators(getPhaseList, dispatch),
    getSavePhaseInfo: bindActionCreators(getSavePhaseInfo, dispatch),
    getDeletePhaseInfo: bindActionCreators(getDeletePhaseInfo, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(PhaseConfig)
