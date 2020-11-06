import React from 'react'
import { Icon, Select, Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Primitive from './Primitive/Primitive'
import PhaseConfig from './PhaseConfig/PhaseConfig'
import TimingPlan from './TimingPlan/TimingPlan'
import TimeTable from './TimeTable/TimeTable'
import RoadConfig from './RoadConfig/RoadConfig'
import ChannelConfig from './ChannelConfig/ChannelConfig'
import BaseAction from './BaseAction/BaseAction'
import StageConfig from './StageConfig/StageConfig'
import FlowPhase from './FlowPhase/FlowPhase'
import Schedule from './Schedule/Schedule'
import FaultLog from './FaultLog/FaultLog'
import styles from './InterDetails.scss'
import requestUrl from '../../../utils/getRequestBaseUrl'
import { getSingalInfo, getPlanStage, getMonitorInfo, getSingalController } from '../../../actions/interCofig'


class InterDetails extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      interMonitorLeft: 15,
      configPop: null,
      sinaglInfo: null,
      planRunStage: null,
      devicePics: null,
      stagePics: null,
      planTimeInfo: null,
      showDeviceInfo: false,
      systemTime: null,
      deviceMsgT: 0,
      deviceMsgL: 0,
      deviceInfoMsg: null,
      presentTime: 0,
      presentResidue: null,
      stageCode: 0,
      presentColor: '#008001',
      singalControler: null,
      InterId: null,
    }
    this.functionList = [
      { id: 1, name: '图元配置', configname: 'primitive' },
      { id: 2, name: '车道配置', configname: 'roadConfig' },
      { id: 3, name: '通道配置', configname: 'channelConfig' },
      { id: 4, name: '相位配置', configname: 'phaseConfig' },
      // { id: 5, name: '跟随相位配置', configname: 'flowPhase' },
      { id: 6, name: '阶段配置', configname: 'stageConfig' },
      { id: 7, name: '配时方案配置', configname: 'timePlan' },
      // { id: 8, name: '时基动作配置', configname: 'baseAction' },
      { id: 9, name: '时段表配置', configname: 'timetable' },
      { id: 10, name: '调度表配置', configname: 'schedule' },
      { id: 11, name: '信号机控制', configname: 'singalConfig' },
      { id: 12, name: '故障日志', configname: 'faultLog' },
    ]
    this.processUrl = requestUrl
  }
  componentDidMount = () => {
    const searchParams = this.props.location.search
    if (searchParams !== '') {
      this.InterId = searchParams.split('=')[1]
      this.setState({ InterId: this.InterId })
      this.getInterAllDatas()
    }
  }
  componentDidUpdate = (prevState) => {
    const { sinaglInfo, planStage, monitorInfo, singalControler } = this.props.data
    if (prevState.data.sinaglInfo !== sinaglInfo) {
      this.getInterSingalInfo(sinaglInfo)
    }
    if (prevState.data.planStage !== planStage) {
      this.getPlanRunStage(planStage)
    }
    if (prevState.data.monitorInfo !== monitorInfo) {
      this.getInfoMotor(monitorInfo)
    }
    if (prevState.data.singalControler !== singalControler) {
      this.getSingalControler(singalControler)
    }
  }
  getInterAllDatas = () => {
    const p1 = Promise.resolve(this.props.getSingalInfo(this.InterId))
    const p2 = Promise.resolve(this.props.getPlanStage(this.InterId))
    const p3 = Promise.resolve(this.props.getMonitorInfo(this.InterId))
    // this.realTimer = setTimeout(() => {
    //   Promise.all([p1, p2, p3]).then(() => {
    //     clearTimeout(this.realTimer)
    //     this.realTimer = null
    //     this.getInterAllDatas()
    //   })
    // }, 1100)
    // this.getInterAllDatas()
  }
  // 获取路口信号信息
  getInterSingalInfo = (sinaglInfo) => {
    this.setState({ sinaglInfo })
  }
  // 获取方案运行阶段
  getPlanRunStage = (planStage) => {
    this.setState({ planRunStage: planStage }, () => {
      if (planStage.length > 0) {
        const stageAll = planStage.map(item => item.STAGE_TIME)
        this.cycleTime = stageAll.reduce(this.getSum)
        const presentStage = (planStage.filter(item => item.STAGE_ID === item.STAGE_CODE))[0]
        if (presentStage) {
          const { ALLRED, YELLOW, stageAllIn, COORDSYNCSTATUS } = presentStage
          const residue = stageAllIn - COORDSYNCSTATUS // 当前阶段剩余的时间
          const presentResidue = residue > ALLRED + YELLOW ? residue - (ALLRED + YELLOW) :
            residue > YELLOW && residue <= YELLOW + ALLRED ? residue - YELLOW : residue
          const presentColor = residue > ALLRED + YELLOW ? '#008001' :
            residue > YELLOW && residue <= YELLOW + ALLRED ? '#ff0000' : 'yellow'
          this.setState({ presentResidue, presentColor, presentTime: COORDSYNCSTATUS }, () => {
            this.unitPx = 960 / this.cycleTime
          })
        }
      }
    })
  }
  // 获取设备图片信息
  getInfoMotor = (monitorInfo) => {
    this.setState({
      devicePics: monitorInfo.UI_UNIT_CONFIGS,
      stagePics: monitorInfo.cfgStageInfos,
      planTimeInfo: monitorInfo.cfgPlan,
      systemTime: monitorInfo.SINGE_SYSTEM_TIME,
      stageCode: monitorInfo.STAGE_CODE,
    })
  }
  // 信号机控制
  getSingalControler = (singalControler) => {
    this.setState({ singalControler })
  }
  getSum = (total, num) => {
    return total + num
  }
  handleShowInterMonitor = () => {
    if (this.state.interMonitorLeft > 0) {
      this.setState({ interMonitorLeft: -300 })
    } else {
      this.setState({ interMonitorLeft: 15 })
    }
  }
  handleShowDeviceInfo = (item) => {
    this.setState({
      deviceInfoMsg: item,
      showDeviceInfo: true,
      deviceMsgL: item.P_LEFT + 10,
      deviceMsgT: item.P_TOP,
    })
  }
  handleCloseDeviceInfo = () => {
    this.setState({ showDeviceInfo: false })
  }
  closeInterConfig = () => { // 图元配置出发关闭
    this.setState({ configPop: null })
  }
  showInterConfig = (e) => { // 展示图元配置
    const configName = e.target.getAttribute('configname')
    this.setState({ configPop: configName })
    if (configName === 'singalConfig') {
      this.props.getSingalController(this.InterId)
    }
  }
  handleCancel = () => { // 相位配置出发关闭
    this.setState({ configPop: null })
  }
  render() {
    const {
      interMonitorLeft, configPop, sinaglInfo, planRunStage, devicePics, stagePics, stageCode, singalControler,
      planTimeInfo, showDeviceInfo, systemTime, deviceInfoMsg, presentTime, presentResidue, presentColor, InterId,
    } = this.state
    const { Option } = Select
    return (
      <div className={styles.interDetailsBox}>
        <div className={styles.imgBox}>
          <div className={styles.presentTimeBox}>
            <div className={styles.presentTime} style={{ backgroundColor: presentColor }}>{presentResidue}</div>
          </div>
          {
            sinaglInfo &&
            <img width="100%" height="100%" src={`${this.processUrl}/atms/imgs/baseImg/${sinaglInfo.UNIT_BACKGROUND_IMG}`} alt="" />
          }
          {
            devicePics && sinaglInfo ?
              devicePics.map((item, index) => {
                const imgStyle = { position: 'absolute', top: `${item.P_TOP}px`, left: `${item.P_LEFT}px`, width: `${item.UI_WIDTH}px`, height: `${item.UI_HIGHT}px`, cursor: 'pointer' }
                const srcs = item.DEVICE_NAME === '信号机' && sinaglInfo.SIGNALSYSTEM === '海信' ? 'jm/' :
                  item.DEVICE_NAME === '信号机' && sinaglInfo.SIGNALSYSTEM === '西门子' ? 'byzt/' : ''
                if (!item.DEVICE_ID) {
                  return (
                    <div className={styles.deviceRoadName} key={item.ID + item} style={{ top: item.P_TOP, left: item.P_LEFT, width: item.UI_WIDTH > 0 ? 0 : 'auto' }}>{item.DETAIL}</div>
                  )
                }
                return (
                  <img
                    key={item.ID + item}
                    style={imgStyle}
                    src={`${this.processUrl}/atms/imgs/${item.UI_TYPE_ID}/${srcs}${item.UI_IMAGE_NAME}`}
                    alt=""
                    onClick={() => { this.handleShowDeviceInfo(item) }}
                  />
                )
              }) : null
          }
          {
            showDeviceInfo &&
            <div className={styles.messageBox} style={{ top: `${this.state.deviceMsgT}px`, left: `${this.state.deviceMsgL}px` }}>
              <div className={styles.messageBox_top} onClick={this.handleCloseDeviceInfo}><Icon type="close" /></div>
              <div className={styles.messageBox_bottom}>
                <ul className={styles.messageBox_bottom_left} style={{ paddingLeft: '34px' }}>
                  <li><span className={styles.fontColor}>关联编号 : </span> {deviceInfoMsg.DEVICE_CODE}</li>
                  <li><span className={styles.fontColor}>维护单位 : </span>&nbsp;<span className={styles.unitName}>{deviceInfoMsg.MAINTENANCE_UNIT_NAME}</span></li>
                  <li><span className={styles.fontColor}>管理单位 :</span> &nbsp;<span className={styles.unitName}>{deviceInfoMsg.MANAGEMENT_UNIT_NAME}</span></li>
                </ul>
                <ul className={styles.messageBox_bottom_right}>
                  <li><span className={styles.fontColor}>设备型号 :</span> {deviceInfoMsg.DEVICE_MODEL}</li>
                  <li><span className={styles.fontColor}>维护电话 :</span> {deviceInfoMsg.MAINTENANCE_UNIT_TEL}</li>
                  <li><span className={styles.fontColor}>设备状态 :</span><span className={styles.fontColorTwo}>&nbsp;{deviceInfoMsg.DEVICESTATENAME}</span></li>
                </ul>
              </div>
            </div>
          }
        </div>
        <div className={styles.interMonitorBox} style={{ left: `${interMonitorLeft}px` }}>
          <span className={styles.hideIcon} onClick={this.handleShowInterMonitor}>
            {interMonitorLeft > 0 ? <Icon type="backward" /> : <Icon type="forward" />}
          </span>
          <p className={styles.titleName}>{sinaglInfo ? sinaglInfo.UNIT_NAME : '--'}</p>
          <ul className={styles.regionList}>
            <li>所属区域 : <span>&nbsp;{sinaglInfo ? sinaglInfo.DISTRICT_NAME : '--'}</span></li>
            <li>管理单位 : {sinaglInfo ? sinaglInfo.USER_GROUP_NAME : '--'}</li>
            <li>信号机类型 : {sinaglInfo ? sinaglInfo.SIGNALSYSTEM : '--'}</li>
          </ul>
          <p className={styles.title}>功能列表</p>
          <ul className={styles.functionList}>
            {
              this.functionList.map(item => <li key={item.id + item.name} configname={item.configname} onClick={this.showInterConfig}>{item.name}</li>)
            }
          </ul>
        </div>
        <div className={styles.AnimationTime}>
          <div className={styles.palnRunBox}>
            <div className={styles.runStage} style={{ width: `${presentTime * this.unitPx}px` }}><span className={styles.stageInner} /></div>
            {
              planRunStage &&
              planRunStage.map((item, index) => {
                const greenWid = item.GREEN * this.unitPx
                const redWid = item.ALLRED * this.unitPx
                const yellowWid = item.YELLOW * this.unitPx
                return (
                  <div className={styles.planRunStage} key={item.STAGE_ID + item}>
                    <span className={styles.stageMsg}>阶段{item.STAGE_ID} &nbsp;{item.GREEN + item.ALLRED + item.YELLOW}秒</span>
                    <div className={styles.greenStage} style={{ width: `${greenWid}px` }} />
                    <div className={styles.redStage} style={{ width: `${redWid}px` }} />
                    <div className={styles.yellowStage} style={{ width: `${yellowWid}px` }} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className={styles.DeviceStatus}>
          <ul className={styles.DeviceStatus_left}>
            <li><span className={styles.fontColor}>设备状态 :</span><span>&nbsp;{sinaglInfo ? sinaglInfo.ALARMSTATE : '--'}</span></li>
            <li><span className={styles.fontColor}>控制状态 :</span>{sinaglInfo ? sinaglInfo.CONTROLSTATE : '--'}</li>
            <li>
              <span className={styles.fontColor}>当前时段 :</span>&nbsp;
              {
                sinaglInfo &&
                <span className={styles.stageImgBox}>
                  <img width="30px" height="30px" src={`${this.processUrl}/atms/comm/images/anniu/${sinaglInfo.STAGE_IMAGE}`} alt="" />
                </span>
              }&nbsp;
              {sinaglInfo ? sinaglInfo.STAGE_CODE : '--'}
            </li>
            <li><span className={styles.fontColor}>当前方案 : </span>{planTimeInfo ? planTimeInfo.PLANNAME : '--'}</li>
            <li><span className={styles.fontColorTwo}>{systemTime}</span></li>
          </ul>
          <div className={styles.DeviceStatus_right}>
            {/* <dl className={styles.deviceControlBtn}>
              <dt><span className={styles.stageImgBox}>锁定</span></dt>
              <dd>锁定</dd>
            </dl>
            <dl className={styles.deviceControlBtn}>
              <dt><span className={styles.stageImgBox}>自动</span></dt>
              <dd>取消步进</dd>
            </dl> */}
            {
              stagePics &&
              stagePics.map((item) => {
                return (
                  <dl key={item.STAGENAME}>
                    <dt>
                      <span className={styles.stageImgBox}>
                        {
                          item.STAGENO === stageCode &&
                          <span className={styles.runningStage}><Icon type="check" /></span>
                        }
                        <img width="30px" height="30px" src={`${this.processUrl}/atms/comm/images/anniu/${item.STAGE_IMAGE}`} alt="" />
                      </span>
                    </dt>
                    <dd>{item.STAGENAME}</dd>
                  </dl>
                )
              })
            }
            {/* <dl>
              <dt><span /></dt>
              <dd>锁定</dd>
            </dl> */}
          </div>
        </div>
        {/* <div className={styles.intersectionHeader_left}>
          <span>上个路口 : 中华北路与市北路交叉口</span>
        </div>
        <div className={styles.intersectionHeader_right}>
          <span>下个路口 : 中华北路与沙河街交叉口</span>
        </div> */}
        {
          (configPop === 'primitive' && !!InterId) &&
          <Primitive IsprimitiveNone={this.closeInterConfig} InterId={InterId} />
        }
        {
          configPop === 'singalConfig' &&
          <div className={styles.singalConfigBox}>
            <div className={styles.singlConfig}>
              <div className={styles.title}>
                信号机控制
                <span className={styles.colseSingalConfig} onClick={this.closeInterConfig}><Icon type="close" /></span>
              </div>
              <div className={styles.controlStagePic}>
                {
                  singalControler && singalControler.cfgPlan.cfgStageInfos.length > 0 ?
                    singalControler.cfgPlan.cfgStageInfos.map((item) => {
                      const picname = singalControler.STAGE_CODE === item.STAGENO ? item.STAGE_IMAGE : item.STAGE_IMAGE.replace('_ch.gif', '.gif')
                      return (
                        <div key={picname} className={styles.stagePic} style={{ cursor: 'pointer' }}>
                          <img width="35px" height="35px" src={`http://10.11.57.101:20206/atms/comm/images/anniu/${picname}`} alt="" />
                        </div>
                      )
                    }) : null
                }
                {
                  singalControler &&
                  new Array(15 - singalControler.cfgPlan.cfgStageInfos.length).fill(true).map((item, index) => {
                    return (
                      <div key={index} className={styles.stagePic}>未配置</div>
                    )
                  })
                }
                <div className={styles.stagePic} style={{ fontSize: '13px', color: '#f1f1fb', cursor: 'pointer' }}>自动</div>
              </div>
              <div className={styles.controlStage}>
                <div>当前控制方式 ：{singalControler ? singalControler.ControlStateName : '---'}</div>
                <div className={styles.controlStageList}>
                  <span>锁定控制方式 ：</span>
                  {
                    singalControler && singalControler.controlCodes.length > 0 ?
                      <Select defaultValue={singalControler.CONTROL_STATE}>
                        {
                          singalControler.controlCodes.map((item) => {
                            return (
                              <Option key={item.C_CODE + item.CODE_NAME} value={item.C_CODE}>{item.CODE_NAME}</Option>
                            )
                          })
                        }
                      </Select> : '---'
                  }
                  <span className={styles.controlExcute}>执行控制</span>
                </div>
              </div>
              <div className={styles.controlStage}>
                <div>当前方案 ：{singalControler ? singalControler.cfgPlan.PLANNAME : '---'}</div>
                <div className={styles.controlStageList}>
                  <span>锁定控制方案 ：</span>
                  {
                    singalControler && singalControler.cfgPlans.length > 0 ?
                      <Select defaultValue={singalControler.PLAN_ID}>
                        {
                          singalControler.cfgPlans.map((item) => {
                            return (
                              <Option key={item.PLANNO + item.PLANNAME} value={item.PLANNO}>{item.PLANNAME}</Option>
                            )
                          })
                        }
                      </Select> : '---'
                  }
                  <span className={styles.controlExcute}>执行控制</span>
                </div>
              </div>
            </div>
          </div>
        }
        {
          InterId &&
          <Modal
            visible={configPop && configPop !== 'singalConfig' && configPop !== 'primitive'}
            closable={false}
            bodyStyle={{ borderRadius: '5px', background: 'rgba(25, 55, 98, 0.9)', padding: 0, overflow: 'hidden' }}
            maskClosable={false}
            style={{ backgroundColor: '' }}
            centered
            onCancel={this.handleCancel}
            footer={null}
            wrapClassName="wrapbox"
            width="60%"
          >
            {
              configPop === 'phaseConfig' &&
              <PhaseConfig {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'timePlan' &&
              <TimingPlan {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'timetable' &&
              <TimeTable {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'roadConfig' &&
              <RoadConfig {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'channelConfig' &&
              <ChannelConfig {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'baseAction' &&
              <BaseAction {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'stageConfig' &&
              <StageConfig {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'flowPhase' &&
              <FlowPhase {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'schedule' &&
              <Schedule {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
            {
              configPop === 'faultLog' &&
              <FaultLog {...this.props} interId={InterId} closeConfigPop={this.handleCancel} />
            }
          </Modal>
        }
      </div >
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
    getSingalInfo: bindActionCreators(getSingalInfo, dispatch),
    getPlanStage: bindActionCreators(getPlanStage, dispatch),
    getMonitorInfo: bindActionCreators(getMonitorInfo, dispatch),
    getSingalController: bindActionCreators(getSingalController, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(InterDetails)

