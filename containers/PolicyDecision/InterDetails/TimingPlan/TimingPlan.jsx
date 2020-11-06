import React from 'react'
import { Icon, Input, Checkbox, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './TimingPlan.scss'
import requestUrl from '../../../../utils/getRequestBaseUrl'
import { getTimingPlan, getTimePlanInfo, getSaveTimingPlan, getAddTimingPlan, getDeleteTimingPlan, getPlanStageList, getStageInfoList, getStagePics } from '../../../../actions/interCofig'

class TimingPlan extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      timingPlans: null,
      showEditTiming: false,
      planDetails: null,
      planStageLists: null,
      phaseNoList: null,
      editPlanStageList: null,
      editStageSelect: false,
      stageRadioIndex: 0,
    }
    this.saveParams = {
      coordPhase: '',
      id: '',
      lose_phase: '',
      offset: '',
      phase_Sequence_No: '',
      planName: '',
      planNo: '',
      stageNos: '',
      stageTimes: '',
      unitId: '',
      planStageList: [],
      planStageListStr: '',
    }
    this.coordPhases = []
    this.planStageList = []
    this.stageNos = []
    this.processUrl = requestUrl
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.saveParams.unitId = this.InterId
    this.props.getTimingPlan(this.InterId)
    this.props.getStagePics()
  }
  componentDidUpdate = (prevState) => {
    const {
      timingPlan, timePlanInfo, addTimingPlan, stageInfoList, stagePics,
    } = this.props.data
    if (prevState.data.timingPlan !== timingPlan) {
      this.getTimingPlanList(timingPlan)
    }
    if (prevState.data.timePlanInfo !== timePlanInfo) {
      this.getTimePlanDetails(timePlanInfo)
    }
    if (prevState.data.addTimingPlan !== addTimingPlan) {
      this.getAdd(addTimingPlan)
    }
    if (prevState.data.stageInfoList !== stageInfoList) {
      this.getStageInfo(stageInfoList)
    }
    if (prevState.data.stagePics !== stagePics) {
      this.getStageImgs(stagePics)
    }
  }
  getStageImgs = (stagePics) => {
    this.setState({ editPlanStageList: stagePics })
  }
  getStageInfo = (stagePics) => {
    const { STAGENO, GREEN, STAGE_IMAGE } = stagePics[0]
    this.radioStageCheck.push({ STAGE_ID: STAGENO, GREEN, STAGE_IMAGE })
    
  }
  getAdd = (addTimingPlan) => {
    const planInfo = {
      COORD_PHASE: null,
      LOSE_PHASE: null,
      CYCLELEN: 0,
      PLANNAME: '添加方案',
      PHASE_SEQUENCE_NO: 1,
      OFFSET: 0,
      PLANNO: 1,
    }
    this.setState({
      planDetails: planInfo,
      planStageLists: addTimingPlan.planStageList,
      phaseNoList: addTimingPlan.phaseNoList,
    })
  }
  getTimingPlanList = (timingPlans) => {
    this.setState({ timingPlans })
  }
  getTimePlanDetails = (timePlanInfo) => {
    this.setState({
      planDetails: timePlanInfo.planInfo,
      planStageLists: timePlanInfo.planStageList,
      phaseNoList: timePlanInfo.phaseNoList,
    })
  }
  handleEditTimingMsg = (timingMsg) => {
    console.log(timingMsg)
    this.coordPhases = []
    this.stageNos = []
    this.saveParams = {
      coordPhase: timingMsg.COORD_PHASE,
      id: timingMsg.ID,
      lose_phase: timingMsg.LOSE_PHASE || '',
      offset: timingMsg.OFFSET,
      phase_Sequence_No: timingMsg.PHASE_SEQUENCE_NO || '',
      planName: timingMsg.PLANNAME,
      planNo: timingMsg.PLANNO,
      planStageList: [],
      unitId: this.InterId,
    }
    this.coordPhases = timingMsg.COORD_PHASE ? timingMsg.COORD_PHASE.split(',') : []
    this.props.getTimePlanInfo(timingMsg.ID, timingMsg.PLANNO, this.InterId)
    this.props.getPlanStageList(this.InterId)
    this.setState({ showEditTiming: true })
  }
  handleCloseEdit = () => {
    this.setState({ showEditTiming: false })
  }
  handleEditChange = (e) => {
    const paramsName = e.target.getAttribute('pname')
    this.saveParams[paramsName] = e.target.value
  }
  handleStageTimeChange = (e, indexs) => {
    this.state.planStageLists[indexs].GREEN = e.target.value
  }
  handleAddTimingPlan = () => {
    this.coordPhases = []
    this.stageNos = []
    this.saveParams.id = 0
    this.props.getAddTimingPlan(this.InterId)
    this.setState({ showEditTiming: true })
  }
  handleSaveTimingPlan = () => {
    this.saveParams.coordPhase = this.coordPhases.join(',')
    this.saveParams.planStageList = this.state.planStageLists
    this.saveParams.planStageListStr = JSON.stringify(this.state.planStageLists)
    console.log(this.coordPhases, this.state.planStageLists)
    console.log(this.saveParams)
    this.props.getSaveTimingPlan(this.saveParams).then((res) => {
      if (res.data.code === 200) {
        this.props.getTimingPlan(this.InterId)
      }
      message.info(res.data.message)
      this.setState({ showEditTiming: false })
    })
  }
  handleDelete = (e) => {
    const planNo = e.target.getAttribute('planno')
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteTimingPlan(planNo, selfThis.InterId).then((res) => {
          if (res.data.code === 200) {
            selfThis.props.getTimingPlan(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleAddStage = () => {
    this.radioStageCheck = []
    const { stageInfoList } = this.props.data
    if (stageInfoList) {
      const { STAGENO, GREEN, STAGE_IMAGE } = stageInfoList[0]
      this.radioStageCheck.push({ STAGE_ID: STAGENO, GREEN, STAGE_IMAGE })
      // this.setState({ editPlanStageList: stageInfoList })
    } else {
      this.props.getStageInfoList(this.InterId)
    }
    this.setState({ editStageSelect: true, stageRadioIndex: 0 })
  }
  handleDeleteStage = () => {
    const { planStageLists } = this.state
    const stageLists = JSON.parse(JSON.stringify(planStageLists))
    if (stageLists.length === 1) {
      message.info('请至少保留一个关联阶段')
    } else {
      stageLists.pop()
      console.log(stageLists)
      this.setState({ planStageLists: stageLists })
    }
  }
  handleCancelStage = () => {
    this.setState({ editStageSelect: false })
  }
  handleRadioStageCheck = (index, stage) => {
    this.radioStageCheck = []
    // const { STAGENO, GREEN, STAGE_IMAGE } = stage
    // this.radioStageCheck.push({ STAGE_ID: STAGENO, GREEN, STAGE_IMAGE })
    this.radioStageCheck.push({ STAGE_ID: index + 1, GREEN: 0, STAGE_IMAGE: stage })
    this.setState({ stageRadioIndex: index })
  }
  handleAddStageCheck = () => {
    const newStageList = [...this.state.planStageLists, ...this.radioStageCheck]
    this.setState({
      planStageLists: newStageList,
      editStageSelect: false,
    })
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const {
      timingPlans, showEditTiming, planDetails, phaseNoList, planStageLists, editPlanStageList, editStageSelect, stageRadioIndex,
    } = this.state
    return (
      <div className={styles.phaseConfigBox}>
        {
          showEditTiming &&
          <div className={styles.editBox}>
            <div className={styles.editDetails}>
              <div className={styles.editTitle}>
                编辑方案
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>方案编号</div>
                <div className={styles.editItems}>
                  <Input defaultValue={planDetails && planDetails.PLANNO} key={planDetails && planDetails.PLANNO} pname="planNo" onChange={this.handleEditChange} />
                </div>
                <div className={styles.editItemsName}>方案名称</div>
                <div className={styles.editItems}>
                  <Input defaultValue={planDetails && planDetails.PLANNAME} key={planDetails && planDetails.PLANNAME} pname="planName" onChange={this.handleEditChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>周期长</div>
                <div className={styles.editItems}>
                  <Input defaultValue={planDetails && planDetails.CYCLELEN} key={planDetails && planDetails.CYCLELEN} disabled />
                </div>
                <div className={styles.editItemsName}>协调相位差</div>
                <div className={styles.editItems}>
                  <Input defaultValue={planDetails && planDetails.OFFSET} key={planDetails && planDetails.OFFSET} pname="offset" onChange={this.handleEditChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>协调相位</div>
                <div className={styles.editItems} style={{ maxHeight: '65px', overflowY: 'auto' }}>
                  {
                    phaseNoList &&
                    phaseNoList.map((item, index) => {
                      return (
                        <span className={styles.phaseSelBox} key={item + index}>
                          <Checkbox id={item} onChange={this.handlePhaseChange} defaultChecked={this.coordPhases.indexOf(item) >= 0}>相位{item}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>关联阶段 <br />(含过渡时间)</div>
                <div className={styles.editItems} style={{ maxHeight: '85px', overflowY: 'auto' }}>
                  {
                    planStageLists &&
                    planStageLists.map((stage, index) => {
                      return (
                        <div className={styles.stageBox} key={stage.STAGE_ID}>
                          <p className={styles.phaseNo}>{stage.STAGE_ID}</p>
                          <img width="35px" height="35px" src={`${this.processUrl}/atms/comm/images/anniu/${stage.STAGE_IMAGE}`} alt="" />
                          <input type="text" defaultValue={stage.GREEN} onChange={(e) => { this.handleStageTimeChange(e, index) }} />
                        </div>
                      )
                    })
                  }
                  <div className={styles.stageBox}>
                    <span className={styles.editStageBtn} onClick={this.handleAddStage}><Icon type="plus" /></span>
                    <span className={styles.editStageBtn} onClick={this.handleDeleteStage}><Icon type="minus" /></span>
                  </div>
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveTimingPlan}>确定</div>
              </div>
              {
                editStageSelect &&
                <div className={styles.stageSelectMark}>
                  <div className={styles.stageSelectBox}>
                    <div className={styles.stageTilte}>选择阶段</div>
                    <div className={styles.stageContent}>
                      {
                        editPlanStageList &&
                        editPlanStageList.map((stages, index) => {
                          return (
                            <div className={styles.stageBox} key={stages}>
                              <p className={styles.phaseNo} onClick={() => { this.handleRadioStageCheck(index, stages) }}>
                                <span className={styles.radioBtn}><i className={styles.radioCheck} style={{ opacity: stageRadioIndex === index ? 1 : 0 }} /></span>
                                {index + 1}
                              </p>
                              <img width="38px" height="38px" src={`${this.processUrl}/atms/comm/images/anniu/${stages}`} alt="" />
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className={styles.stageAction}>
                      <div className={styles.stageActionBtn} onClick={this.handleAddStageCheck}>确定</div>
                      <div className={styles.stageActionBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCancelStage}>取消</div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>配时方案配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddTimingPlan}>添加</div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>方案号</div>
            <div className={styles.mountingTh}>方案名称</div>
            <div className={styles.mountingTh}>周期长</div>
            <div className={styles.mountingTh}>协调相位</div>
            <div className={styles.mountingTh}> 协调相位差(秒)</div>
            <div className={`${styles.mountingTh} ${styles.mountingcar}`}> 关联阶段</div>
            <div className={styles.mountingTh}> 操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              timingPlans &&
              timingPlans.map((item) => {
                return (
                  <div className={styles.mountingTr} key={item.ID}>
                    <div className={styles.mountingTd}>{item.PLANNO}</div>
                    <div className={styles.mountingTd}>{item.PLANNAME}</div>
                    <div className={styles.mountingTd}>{item.CYCLELEN}</div>
                    <div className={styles.mountingTd}>{item.COORD_PHASE}</div>
                    <div className={styles.mountingTd}>{item.OFFSET}</div>
                    <div className={`${styles.mountingTd} ${styles.mountingcar}`}>
                      {
                        item.STAGEIMAGES &&
                        item.STAGEIMAGES.split(',').map((stage, indexs) =>{
                          return (
                            <img key={item.ID + indexs} width="35px" height="35px" style={{ marginRight: '3px' }} src={`${this.processUrl}/atms/comm/images/anniu/${stage}`} alt="" />
                          )
                        })
                      }
                    </div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleEditTimingMsg(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span planno={item.PLANNO} onClick={this.handleDelete}>删除</span></div>
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
    getTimingPlan: bindActionCreators(getTimingPlan, dispatch),
    getTimePlanInfo: bindActionCreators(getTimePlanInfo, dispatch),
    getSaveTimingPlan: bindActionCreators(getSaveTimingPlan, dispatch),
    getAddTimingPlan: bindActionCreators(getAddTimingPlan, dispatch),
    getDeleteTimingPlan: bindActionCreators(getDeleteTimingPlan, dispatch),
    getPlanStageList: bindActionCreators(getPlanStageList, dispatch),
    getStageInfoList: bindActionCreators(getStageInfoList, dispatch),
    getStagePics: bindActionCreators(getStagePics, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(TimingPlan)
