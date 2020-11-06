import React from 'react'
import { Icon, Select, Input, Modal, message, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './StageConfig.scss'
import requestUrl from '../../../../utils/getRequestBaseUrl'
import { getStageInfoList, getSaveLaneInfo, getDeleteStage, getEditStageInfo, getAddSaveStage, getStagePics } from '../../../../actions/interCofig'

class StageConfig extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showEditRoadMsg: false,
      stageInfoLists: null,
      cfgPhaseInfos: null,
      stageMsg: null,
      stagePics: null,
    }
    this.saveParams = {
      allred: 0,
      attribute: 0,
      attributeName: '',
      green: 0,
      id: '',
      isController: 0,
      phasenolist: '',
      redyellow: 0,
      signal_statge_id: 0,
      special_output_phase: '',
      stageImage: '',
      stagename: '',
      stageno: 0,
      unitId: '',
      yellow: 0,
    }
    this.saveType = 2
    this.specialPhaseLists = []
    this.phaseLists = []
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.saveParams.unitId = this.InterId
    this.props.getStageInfoList(this.InterId)
    this.props.getStagePics()
  }
  componentDidUpdate = (prevState) => {
    const { directionList, directionForLane, roadTypeList, stageInfoList, editStageInfo, stagePics } = this.props.data
    if (prevState.data.directionList !== directionList) {
      this.getDirection(directionList)
    }
    if (prevState.data.directionForLane !== directionForLane) {
      this.getDirForLane(directionForLane)
    }
    if (prevState.data.roadTypeList !== roadTypeList) {
      this.getRoadTypes(roadTypeList)
    }
    if (prevState.data.stageInfoList !== stageInfoList) {
      this.getStageInfo(stageInfoList)
    }
    if (prevState.data.editStageInfo !== editStageInfo) {
      this.getEditStageMsg(editStageInfo)
    }
    if (prevState.data.stagePics !== stagePics) {
      this.getStageImgs(stagePics)
    }
  }
  getStageImgs = (stagePics) => {
    this.setState({ stagePics })
  }
  getStageInfo = (infoList) => {
    this.setState({ stageInfoLists: infoList })
  }
  getEditStageMsg = (stageInfo) => {
    this.setState({ cfgPhaseInfos: stageInfo.cfgPhaseInfos })
  }
  handleCloseEdit = () => {
    this.setState({ showEditRoadMsg: false })
  }
  // 添加
  handleAddRoad = () => {
    const stageMsg = {
      ALLRED: null,
      ATTRIBUTE: 0,
      GREEN: 0,
      ID: 2,
      IS_CONTROLLER: 0,
      LAMPSTATES: null,
      MAX_GREEN: null,
      MIN_GREEN: null,
      PEOPLE_GREEN_FLASH: null,
      PEOPLE_RED_FLASH: null,
      PHASENOLIST: '',
      REDYELLOW: 0,
      SIGNAL_STATGE_ID: null,
      SPECIAL_OUTPUT_PHASE: null,
      STAGENAME: '',
      STAGENO: 0,
      STAGE_IMAGE: '',
      UNIT_ID: 400034,
      VEHICLE_GREEN_FLASH: null,
      VEHICLE_RED_FLASH: null,
      YELLOW: 0,
      attributeName: '',
    }
    this.saveParams = {
      allred: 0,
      attribute: 0,
      attributeName: 0,
      green: 0,
      id: 0,
      isController: 0,
      phasenolist: '',
      redyellow: 0,
      signal_statge_id: '',
      special_output_phase: '',
      stageImage: '',
      stagename: '',
      stageno: 0,
      unitId: this.InterId,
      yellow: 0,
    }
    this.specialPhaseLists = []
    this.phaseLists = []
    this.props.getEditStageInfo(0, this.InterId)
    this.setState({ showEditRoadMsg: true, stageMsg })
  }
  handleDeleteStage = (id) => {
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteStage(id).then((res) => {
          if (res.data.code === 200) {
            selfThis.props.getStageInfoList(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleEditStage = (item) => {
    this.setState({
      showEditRoadMsg: true,
      stageMsg: item,
    })
    console.log(item)
    this.saveParams = {
      allred: item.ALLRED,
      attribute: item.ATTRIBUTE,
      attributeName: item.attributeName,
      green: item.GREEN,
      id: item.ID,
      isController: item.IS_CONTROLLER,
      phasenolist: item.PHASENOLIST,
      redyellow: item.REDYELLOW,
      signal_statge_id: item.SIGNAL_STATGE_ID,
      special_output_phase: item.SPECIAL_OUTPUT_PHASE,
      stageImage: item.STAGE_IMAGE,
      stagename: item.STAGENAME,
      stageno: item.STAGENO,
      unitId: item.UNIT_ID,
      yellow: item.YELLOW,
    }
    this.phaseLists = item.PHASENOLIST ? item.PHASENOLIST.split(',') : []
    this.specialPhaseLists = item.SPECIAL_OUTPUT_PHASE ? item.SPECIAL_OUTPUT_PHASE.split(',') : []
    this.props.getEditStageInfo(item.ID, item.UNIT_ID)
  }
  handleSaveParamsChange = (val, options) => {
    const pName = options.props.paramsname
    this.saveParams[pName] = val
  }
  handleStageNoChange = (e) => {
    const pName = e.target.getAttribute('paramsname')
    this.saveParams[pName] = e.target.value
  }
  handleChangeStagePlan = (e) => {
    console.log(e)
    const { checked, id, pname } = e.target
    console.log(checked, id)
    if (!checked) {
      if (pname === 'special_output_phase') {
        const indexs = this.specialPhaseLists.indexOf(id)
        this.specialPhaseLists.splice(indexs, 1)
      } else if (pname === 'phasenolist') {
        const indexs = this.phaseLists.indexOf(id)
        this.phaseLists.splice(indexs, 1)
      }
    } else {
      if (pname === 'special_output_phase') {
        this.specialPhaseLists.push(id)
      } else if (pname === 'phasenolist') {
        this.phaseLists.push(id)
      }
    }
  }
  handleSaveRoadInfo = () => {
    console.log(this.specialPhaseLists)
    this.saveParams.special_output_phase = this.specialPhaseLists.length > 0 ? this.specialPhaseLists.join(',') : ''
    this.saveParams.phasenolist = this.phaseLists.join(',')
    this.props.getAddSaveStage(this.saveParams).then((res) => {
      if (res.data.code === 200) {
        this.props.getStageInfoList(this.InterId)
        this.setState({ showEditRoadMsg: false })
      }
      message.info(res.data.message)
    })
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { showEditRoadMsg, stageInfoLists, cfgPhaseInfos, stageMsg, stagePics } = this.state
    const { Option } = Select
    return (
      <div className={styles.phaseConfigBox}>
        {
          showEditRoadMsg &&
          <div className={styles.editBox}>
            <div className={styles.editDetails}>
              <div className={styles.editTitle}>
                编辑阶段信息
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>阶段编号</div>
                <div className={styles.editItems}>
                  <Input defaultValue={stageMsg && stageMsg.STAGENO} paramsname="stageno" onChange={this.handleStageNoChange} />
                </div>
                <div className={styles.editItemsName}>阶段名称</div>
                <div className={styles.editItems}>
                  <Input defaultValue={stageMsg && stageMsg.STAGENAME} paramsname="stagename" onChange={this.handleStageNoChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>阶段图示</div>
                <div className={styles.editItems}>
                  {
                    stagePics &&
                    <Select defaultValue={stageMsg && stageMsg.STAGE_IMAGE} onChange={this.handleSaveParamsChange} style={{ width: '70px' }}>
                      {
                        stagePics.map((item) => {
                          return (
                            <Option key={item} value={item} paramsname="stageImage"><img width="35px" height="35px" src={`${requestUrl}/atms/comm/images/anniu/${item}`} alt="" /></Option>
                          )
                        })
                      }
                    </Select>
                  }
                </div>
                <div className={styles.editItemsName}>关联阶段号</div>
                <div className={styles.editItems}>
                  <Input defaultValue={stageMsg && stageMsg.SIGNAL_STATGE_ID} paramsname="signal_statge_id" onChange={this.handleStageNoChange} />
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>关联相位</div>
                <div className={styles.editItems} style={{ maxHeight: '85px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {
                    cfgPhaseInfos &&
                    cfgPhaseInfos.map((item) => {
                      const defaultPhase = stageMsg && stageMsg.PHASENOLIST.split(',')
                      return (
                        <span className={styles.phaseSelBox} key={item.PHASE_NO}>
                          <Checkbox id={`${item.PHASE_NO}`} pname="phasenolist" onChange={this.handleChangeStagePlan} defaultChecked={defaultPhase.indexOf(String(item.PHASE_NO)) >= 0}>{item.PHASE_NAME}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>特殊相位</div>
                <div className={styles.editItems} style={{ maxHeight: '85px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {
                    cfgPhaseInfos &&
                    cfgPhaseInfos.map((item) => {
                      const defaultPhase = (stageMsg && stageMsg.SPECIAL_OUTPUT_PHASE) ? stageMsg.SPECIAL_OUTPUT_PHASE.split(',') : []
                      return (
                        <span className={styles.phaseSelBox} key={item.PHASE_NO}>
                          <Checkbox id={`${item.PHASE_NO}`} pname="special_output_phase" onChange={this.handleChangeStagePlan} defaultChecked={defaultPhase.indexOf(String(item.PHASE_NO)) >= 0}>{item.PHASE_NAME}</Checkbox>
                        </span>
                      )
                    })
                  }
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveRoadInfo}>确定</div>
              </div>
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>阶段配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddRoad}>添加</div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>阶段编号</div>
            <div className={styles.mountingTh}>阶段名称</div>
            <div className={styles.mountingTh}>关联相位</div>
            <div className={styles.mountingTh}>特殊相位</div>
            <div className={styles.mountingTh}>阶段图示</div>
            <div className={styles.mountingTh}>关联信号系统阶段号</div>
            <div className={styles.mountingTh}>操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              stageInfoLists &&
              stageInfoLists.map((item, index) => {
                return (
                  <div className={styles.mountingTr} key={item.STAGENAME + index}>
                    <div className={styles.mountingTd}>{item.STAGENO}</div>
                    <div className={styles.mountingTd}>{item.STAGENAME}</div>
                    <div className={styles.mountingTd}>{item.PHASENOLIST}</div>
                    <div className={styles.mountingTd}>{item.SPECIAL_OUTPUT_PHASE}</div>
                    <div className={styles.mountingTd}><img width="35px" height="35px" src={`${requestUrl}/atms/comm/images/anniu/${item.STAGE_IMAGE}`} alt="" /></div>
                    <div className={styles.mountingTd}>{item.SIGNAL_STATGE_ID}</div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleEditStage(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span onClick={() => { this.handleDeleteStage(item.ID) }}>删除</span></div>
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
    getStageInfoList: bindActionCreators(getStageInfoList, dispatch),
    getDeleteStage: bindActionCreators(getDeleteStage, dispatch),
    getSaveLaneInfo: bindActionCreators(getSaveLaneInfo, dispatch),
    getEditStageInfo: bindActionCreators(getEditStageInfo, dispatch),
    getAddSaveStage: bindActionCreators(getAddSaveStage, dispatch),
    getStagePics: bindActionCreators(getStagePics, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(StageConfig)
