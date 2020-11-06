import React from 'react'
import { Icon, Input, Select, Modal, message, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './FlowPhase.scss'

import { getFlowPhaseList, getDeleteFlowPhase, getPhaseNoList, getSaveFollowPhase } from '../../../../actions/interCofig'

class FlowPhase extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flowPhaseList: null,
      showEditTiming: false,
      followPhaseMsg: null,
      phaseLists: null,
    }
    this.saveParams = {
      clearMode: 0,
      clearTime: 0,
      correctPhaseNos: 'string',
      followNo: 0,
      id: 'string',
      parentPhaseNos: 'string',
      redTime: 0,
      unitId: 0,
      yellowTime: 0,
    }
    this.coordPhases = []
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.props.getFlowPhaseList(this.InterId)
    this.props.getPhaseNoList(this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { flowPhase, phaseNoList } = this.props.data
    if (prevState.data.flowPhase !== flowPhase) {
      this.getFlowPhase(flowPhase)
    }
    if (prevState.data.phaseNoList !== phaseNoList) {
      this.getPhaseList(phaseNoList)
    }
  }
  getFlowPhase = (flowPhase) => {
    this.setState({ flowPhaseList: flowPhase })
  }
  getPhaseList = (phaseLists) => {
    this.setState({ phaseLists })
  }
  handleEditFlowPhase = (flowPhaseMsg) => {
    console.log(flowPhaseMsg)
    this.saveParams = {
      clearMode: flowPhaseMsg.CLEAR_MODE,
      clearTime: flowPhaseMsg.CLEAR_TIME,
      correctPhaseNos: flowPhaseMsg.CORRECT_PHASE_NO_LIST,
      followNo: flowPhaseMsg.FOLLOW_NO,
      id: flowPhaseMsg.FOLLOW_NO,
      parentPhaseNos: flowPhaseMsg.PARENT_PHASE_NO_LIST,
      redTime: flowPhaseMsg.RED_TIME,
      unitId: flowPhaseMsg.UNIT_ID,
      yellowTime: flowPhaseMsg.YELLOW_TIME,
    }
    this.saveType = 2
    this.coordPhases = flowPhaseMsg.PARENT_PHASE_NO_LIST ? flowPhaseMsg.PARENT_PHASE_NO_LIST.split(',') : []
    this.setState({ showEditTiming: true, followPhaseMsg: flowPhaseMsg })
  }
  handleDeleteFollowPhase = (e) => {
    const followNo = e.target.getAttribute('followno')
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteRoad(followNo, this.InterId).then((res) => {
          if (res.data.code === 200) {
            selfThis.props.getFlowPhaseList(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleCloseEdit = () => {
    this.setState({ showEditTiming: false })
  }
  handleEditChange = (e) => {
    const pName = e.target.getAttribute('pname')
    this.saveParams[pName] = e.target.value
  }
  handlePhaseChange = (e) => {
    const { id } = e.target
    const isChecked = e.target.checked
    if (isChecked) {
      this.coordPhases.push(id)
    } else {
      const index = this.coordPhases.indexOf(id)
      this.coordPhases.splice(index, 1)
    }
  }
  handleSaveFollowPhase = () => {
    this.saveParams.parentPhaseNos = this.coordPhases.join(',')
    this.props.getSaveFollowPhase(this.saveType, this.saveParams).then((res) => {
      if (res.data.code === 200) {
        this.props.getFlowPhaseList(this.InterId)
        this.setState({ showEditTiming: false })
      }
      message.info(res.data.message)
    })
  }
  handleAddFollowPhase = () => {
    this.saveType = 1
    this.saveParams.id = 0
    this.coordPhases = []
    const flowPhaseMsg = {
      CLEAR_MODE: 0,
      CLEAR_TIME: null,
      CORRECT_PHASE_NO_LIST: null,
      FOLLOW_NO: 1,
      PARENT_PHASE_NO_LIST: null,
      RED_TIME: 0,
      YELLOW_TIME: 0,
    }
    this.setState({ followPhaseMsg: flowPhaseMsg, showEditTiming: true })
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { Option } = Select
    const { flowPhaseList, showEditTiming, followPhaseMsg, phaseLists } = this.state
    return (
      <div className={styles.phaseConfigBox}>
        {
          showEditTiming &&
          <div className={styles.editBox}>
            <div className={styles.editDetails}>
              <div className={styles.editTitle}>
                编辑跟随相位
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>跟随相位号</div>
                <div className={styles.editItems}>
                  <Input defaultValue={followPhaseMsg && followPhaseMsg.FOLLOW_NO} pname="followNo" onChange={this.handleEditChange} />
                </div>
                <div className={styles.editItemsName}>修正相位</div>
                <div className={styles.editItems}>
                  <Input defaultValue={followPhaseMsg && followPhaseMsg.CORRECT_PHASE_NO_LIST} pname="correctPhaseNos" onChange={this.handleEditChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>绿灯时间</div>
                <div className={styles.editItems}>
                  <Input defaultValue={followPhaseMsg && followPhaseMsg.YELLOW_TIME} pname="yellowTime" onChange={this.handleEditChange} />
                </div>
                <div className={styles.editItemsName}>红灯时间</div>
                <div className={styles.editItems}>
                  <Input defaultValue={followPhaseMsg && followPhaseMsg.RED_TIME} pname="redTime" onChange={this.handleEditChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>清空模式</div>
                <div className={styles.editItems}>
                  <Select defaultValue={followPhaseMsg && followPhaseMsg.CLEAR_MODE} onChange={this.handleSaveParamsChange}>
                    <Option key="0" value={0} paramsname="clearMode">绿闪</Option>
                    <Option key="1" value={1} paramsname="clearMode">红闪</Option>
                    <Option key="2" value={2} paramsname="clearMode">黄闪</Option>
                  </Select>
                </div>
                <div className={styles.editItemsName}>清空时间</div>
                <div className={styles.editItems}>
                  <Input defaultValue={followPhaseMsg && followPhaseMsg.CLEAR_TIME} pname="clearTime" onChange={this.handleEditChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>协调相位</div>
                <div className={styles.editItems} style={{ height: '85px', overflowY: 'auto' }}>
                  {
                    phaseLists &&
                    phaseLists.map((item, index) => {
                      return (
                        <span className={styles.phaseSelBox} key={item + index}>
                          <Checkbox id={item} onChange={this.handlePhaseChange} defaultChecked={this.coordPhases.indexOf(item) >= 0}>相位{item}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveFollowPhase}>确定</div>
              </div>
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>跟随相位配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddFollowPhase}>添加</div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>跟随号</div>
            <div className={styles.mountingTh}>清空模式</div>
            <div className={styles.mountingTh}>绿灯时间</div>
            <div className={styles.mountingTh}>红灯时间</div>
            <div className={styles.mountingTh}>清空时间</div>
            <div className={styles.mountingTh}>修正相位</div>
            <div className={styles.mountingTh} style={{ flex: 1.3 }}>母相位</div>
            <div className={styles.mountingTh}>操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              flowPhaseList &&
              flowPhaseList.map((item) => {
                const correctPhase = item.PARENT_PHASE_NO_LIST ? (item.PARENT_PHASE_NO_LIST.split(',')).map(phase => `相位${phase}`) : null
                const clearMode = item.CLEAR_MODE === 0 ? '绿闪' : item.CLEAR_MODE === 1 ? '红闪' : '黄闪'
                return (
                  <div className={styles.mountingTr} key={item.FOLLOW_NO + item.UNIT_ID}>
                    <div className={styles.mountingTd}>{item.FOLLOW_NO}</div>
                    <div className={styles.mountingTd}>{clearMode}</div>
                    <div className={styles.mountingTd}>{item.YELLOW_TIME}</div>
                    <div className={styles.mountingTd}>{item.RED_TIME}</div>
                    <div className={styles.mountingTd}>{item.CLEAR_TIME}</div>
                    <div className={styles.mountingTd}>{`相位${item.CORRECT_PHASE_NO_LIST}`}</div>
                    <div className={styles.mountingTd} style={{ flex: 1.3 }}>{correctPhase && correctPhase.join(',')}</div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleEditFlowPhase(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span followno={item.FOLLOW_NO} onClick={this.handleDeleteFollowPhase}>删除</span></div>
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
    getFlowPhaseList: bindActionCreators(getFlowPhaseList, dispatch),
    getDeleteFlowPhase: bindActionCreators(getDeleteFlowPhase, dispatch),
    getPhaseNoList: bindActionCreators(getPhaseNoList, dispatch),
    getSaveFollowPhase: bindActionCreators(getSaveFollowPhase, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(FlowPhase)
