import React from 'react'
import { Checkbox, Icon, Select, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './GreenWave.scss'
import mineMapConf from '../../../utils/minemapConf'
import requestUrl from '../../../utils/getRequestBaseUrl'
import getResponseData from '../../../utils/getResponseData'
// import Nav from '../Header/Nav/Nav'
import CustomInterTree from '../Surveillance/CustomTree/CustomTree'

import { getInterList, getBasicInterInfo, getLineTreeData } from '../../../actions/data'

const { Option } = Select
class GreenWaveMonitor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleTop: 0,
      visible: false,
      interList: null,
      showGreenWaveMsg: false,
      searchInterLists: null,
      showAddInterWrapper: false,
      addInterDetails: null,
      baseUnit: null,
      lineName: null,
      lineMileage: null,
      lineIntroduce: null,
    }
    this.markers = []
    this.zhongkong = true
    this.haixin = true
    this.searchInterList = []
    this.interDetails = []
    this.searchTimer = null
    this.searchKeyWord = ''
    this.loadTreeUrl = '/atms/greenWaveCoordinate/loadTree'
    this.unitInfoUrl = '/atms/greenWaveCoordinate/loadUnitInfoToAdd'
    this.deleteLine = '/atms/greenWaveCoordinate/toDelete'
    this.addline = '/atms/greenWaveCoordinate/toSave'
    this.lineDetails = '/atms/greenWaveCoordinate/loadGreenWaveCoordinateById'
    this.addlineParams = {
      baseUnit: '',
      detail: '',
      id: '',
      mileage: '',
      planName: '',
      taskState: '',
      unitList: [
        {
          coordinateState: '',
          planId: '',
          planList: [
            {
              coordinatePhase: '',
              offSet: '',
              planCycle: '',
              planId: '',
              planNo: '',
              stageList: [],
              unitId: '',
              unitOrder: '',
            },
          ],
          unitId: '',
          unitName: '',
          unitOrder: '',
        },
      ],
      updateTime: '',
      updateUser: '',
    }
  }
  componentDidMount = () => {
    this.renderMineMap()
    this.props.getInterList()
    this.props.getLineTreeData(true)
  }
  componentDidUpdate = (prevState) => {
    const { interList } = this.props.data
    if (prevState.data.interList !== interList) {
      this.getInterList(interList)
    }
  }
  getNowDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + (today.getDate())).slice(-2)
    const hour = ('0' + (today.getHours())).slice(-2)
    const minutes = ('0' + (today.getMinutes())).slice(-2)
    const seconds = ('0' + (today.getSeconds())).slice(-2)
    const nowTime = year + '-' + month + '-' + day
    const nowMse = hour + ':' + minutes + ':' + seconds
    return `${nowTime} ${nowMse}`
  }
  // 路口列表
  getInterList = (interList) => {
    this.searchInterList = interList
    this.setState({ interList, searchInterLists: interList }, () => {
      this.addMarker(interList)
    })
  }
  getGreenWaveDetails = () => {
    getResponseData('get', `${this.lineDetails}?id=${this.lineId}`).then((res) => {
      const { code, data } = res.data
      if (code === 200) {
        this.interDetails = data.unitList
        console.log(this.interDetails)
        this.setState({
          baseUnit: data.baseUnit,
          lineName: data.planName,
          lineMileage: data.mileage,
          lineIntroduce: data.detail,
          addInterDetails: this.interDetails,
        })
        Object.keys(this.addlineParams).forEach((item) => {
          if (item !== 'unitList') {
            this.addlineParams[item] = data[item]
          }
        })
      } else {
        message.info(res.data.message)
        if (this.interDetails.length) {
          this.interDetails = []
          this.setState({
            baseUnit: null,
            lineName: null,
            lineMileage: null,
            lineIntroduce: null,
            addInterDetails: this.interDetails,
          })
          Object.keys(this.addlineParams).forEach((item) => {
            if (item !== 'unitList') {
              this.addlineParams[item] = ''
            } else {
              this.addlineParams[item] = []
            }
          })
        }
      }
    })
  }
  // 从子集获取区域id和index 请求路口
  getSelectTreeId = (id) => {
    console.log(id)
    this.props.getLineTreeData(false, id)
  }
  // 获取子id, 路口id
  getSelectChildId = (chidlId, lng, lat) => {
    const marker = document.getElementById('marker' + chidlId)
    if (marker && this.map) {
      this.map.setCenter([lng, lat])
      marker.click()
    } else {
      message.info('该路口尚未接入')
    }
  }
  // 添加坐标点
  addMarker = (interList) => {
    this.delMarker()
    if (this.map) {
      this.infowindow += 1
      interList.forEach((item) => {
        const el = document.createElement('div')
        el.id = `marker${item.ID}`
        if (item.SIGNAL_SYSTEM_CODE === 4 || item.SIGNAL_SYSTEM_CODE === 3) {
          const sysIcon = item.CONTROL_STATE === 10 && item.SIGNAL_SYSTEM_CODE === 4 ? '#ff0000' :
            item.CONTROL_STATE !== 10 && item.SIGNAL_SYSTEM_CODE === 4 ? '#00E500' :
              item.CONTROL_STATE === 10 && item.SIGNAL_SYSTEM_CODE === 3 ? '#ff0000' :
                item.CONTROL_STATE !== 10 && item.SIGNAL_SYSTEM_CODE === 3 ? '#00E500' : null
          el.style.backgroundColor = sysIcon
          // el.style['background-size'] = '100% 100%'
          el.style.width = '20px'
          el.style.height = '20px'
          el.style.borderRadius = '50%'
          el.style.boxShadow = `0 0 20px ${sysIcon}`
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            this.props.getBasicInterInfo(item.ID).then((res) => {
              const { code, data } = res.data
              if (code === 200) {
                this.showCustomInfoWin(data, item.LONGITUDE, item.LATITUDE)
              }
            })
          })
          const marker = new window.minemap.Marker(el, { offset: [-10, -10] }).setLngLat({ lng: item.LONGITUDE, lat: item.LATITUDE }).addTo(this.map)
          this.markers.push(marker)
        }
      })
    }
  }
  // 删除坐标点
  delMarker = () => {
    if (this.map && this.markers.length) {
      this.markers.forEach((item) => {
        item.remove()
      })
      this.markers = []
    }
  }
  // 关闭自定义信息窗体
  removeInterInfo = () => {
    if (this.popup) {
      this.popup.remove()
      this.popup = null
    }
  }
  // 自定义信息窗体
  showCustomInfoWin = (interInfo, lng, lat) => {
    this.removeInterInfo()
    const runStatePic = `${requestUrl}/atms/imgs/stage/${interInfo.STAGE_IMAGE}`
    const id = `monitor${interInfo.UNIT_ID}`
    const el = document.createElement('div')
    el.className = 'custom-popup-class' // custom-popup-class为自定义的css类名
    const d1 = document.createElement('div')
    d1.innerHTML = `
      <div style="width:480px;height:260px;background:linear-gradient(to bottom, rgba(29, 64, 113, 0.9), rgba(21, 46, 83, 0.9));">
        <div style="color:#60B5F1;position:relative;height:50px;padding-top:13px;padding-left:20px;line-height:50px;font-size:16px;">
          路口名称 ：${interInfo.UNIT_NAME}
        </div>
        <div style="height:130px;display:flex;padding-top:20px;font-size:14px;">
          <div style="flex:1;color:#CED8E1;">
            <p style="height:32px;line-height:32px;padding-left:40px"><span style="color:#599FE0">所属城区 ：</span>${interInfo.DISTRICT_NAME}</p>
            <p style="height:32px;line-height:32px;padding-left:40px"><span style="color:#599FE0">信号系统 ：</span>${interInfo.SIGNALSYSTEM}</p>
            <p style="height:32px;line-height:32px;padding-left:40px"><span style="color:#599FE0">运行阶段 ：</span><img width="36px" height="36px" src="${runStatePic}" />${interInfo.STAGE_CODE}</p>
          </div>
          <div style="flex:1;color:#CED8E1;">
            <p style="height:32px;line-height:32px;padding-left:20px"><span style="color:#599FE0">控制状态 ：</span>${interInfo.CONTROLSTATE}</p>
            <p style="height:32px;line-height:32px;padding-left:20px"><span style="color:#599FE0">信号机IP ：</span>${interInfo.SIGNAL_IP}</p>
            <p style="height:32px;line-height:32px;padding-left:20px"><span style="color:#599FE0">设备状态 ：</span><span style="color:#168830;"></span>${interInfo.ALARMSTATE}</p>
          </div>
        </div>
        <div style="height:40px;display:flex;justify-content:center;align-items:center;">
          <div id="${id}" style="width:80px;color:#fff;height:30px;margin:20px auto 0;background-color:#0673B6;text-align:center;line-height:30px;border-radius:4px;cursor:pointer;">路口监控</div>
        </div>
      </div>
    `
    el.appendChild(d1)
    this.popup = new window.minemap.Popup({ closeOnClick: false, closeButton: false, offset: [-1, -12] })
      .setLngLat([lng, lat])
      .setDOMContent(el)
      .addTo(this.map)
    if (document.getElementById(id)) {
      document.getElementById(id).addEventListener('click', () => {
        window.open(`/interdetails?interid=${interInfo.UNIT_ID}`)
      })
    }
  }
  showHisense = (e) => { // 筛选符合条件的海信点位
    const { interList } = this.state
    if (e.target.checked) {
      this.haixin = true
      this.delMarker()
      if (this.zhongkong) {
        this.addMarker(interList)
      } else {
        this.searchInterList = interList.filter(item => item.SIGNAL_SYSTEM_CODE === 4)
        this.addMarker(this.searchInterList)
      }
    } else {
      this.haixin = false
      this.delMarker()
      if (this.zhongkong) {
        this.searchInterList = interList.filter(item => item.SIGNAL_SYSTEM_CODE === 3)
        this.addMarker(this.searchInterList)
      } else {
        this.delMarker()
      }
    }
  }
  CentralControl = (e) => { // 筛选符合条件的中控点位
    const { interList } = this.state
    if (e.target.checked) {
      this.zhongkong = true
      this.delMarker()
      if (this.haixin) {
        this.addMarker(interList)
      } else {
        this.searchInterList = interList.filter(item => item.SIGNAL_SYSTEM_CODE === 3)
        this.addMarker(this.searchInterList)
      }
    } else {
      this.zhongkong = false
      this.delMarker()
      if (this.haixin) {
        this.searchInterList = interList.filter(item => item.SIGNAL_SYSTEM_CODE === 4)
        this.addMarker(this.searchInterList)
      } else {
        this.delMarker()
      }
    }
  }
  visibleShowLeft = (top, id, show) => { // 框的跳转与位置
    this.lineId = id
    if (top || id) {
      this.setState({
        visible: show,
        visibleTop: top,
      })
    } else {
      this.setState({
        visible: show,
      })
    }
  }
  handleShowGreenWaveMsg = () => {
    if (this.interDetails.length) {
      this.interDetails = []
      this.setState({
        baseUnit: null,
        lineName: null,
        lineMileage: null,
        lineIntroduce: null,
        addInterDetails: this.interDetails,
      })
      Object.keys(this.addlineParams).forEach((item) => {
        if (item !== 'unitList') {
          this.addlineParams[item] = ''
        } else {
          this.addlineParams[item] = []
        }
      })
    }
    this.setState({ showGreenWaveMsg: true })
    this.lineType = 1
  }
  handleHideGreenWaveMsg = () => {
    this.setState({ showGreenWaveMsg: false, showAddInterWrapper: false })
  }
  handleSearchInterValue = (val, options) => {
    this.addInterId = options.key
  }
  handleAddInter = () => {
    this.setState({ showAddInterWrapper: true })
  }
  handleHideAddInter = () => {
    this.setState({ showAddInterWrapper: false })
  }
  handleSureAddInter = () => {
    getResponseData('get', `${this.unitInfoUrl}?unitId=${this.addInterId}`).then((res) => {
      const { code, data } = res.data
      if (code === 200) {
        this.interDetails.push(data.greenWaveCoordinateUnit)
        this.setState({ addInterDetails: this.interDetails, showAddInterWrapper: false })
        if (!this.state.baseUnit) {
          this.setState({ baseUnit: this.interDetails[0].unitName })
          this.addlineParams.baseUnit = this.interDetails[0].unitId
        }
      }
    })
  }
  handleDeleteLine = () => {
    getResponseData('post', `${this.deleteLine}?id=${this.lineId}`).then((res) => {
      const { code, data } = res.data
      if (code === 200 && data > 0) {
        this.props.getLineTreeData(true)
        this.props.getInterList()
      }
      message.info(res.data.message)
      this.setState({ visible: false })
    })
  }
  handleEditLineMsg = (e) => {
    this.lineType = 2
    this.getGreenWaveDetails()
    this.setState({ showGreenWaveMsg: true, visible: false })
  }
  handleAddGreenWave = () => {
    const { planName, mileage, unitList } = this.addlineParams
    if (!planName || !mileage) {
      message.warning('请输入干线相关信息')
      return
    }
    if (unitList.length === 0) {
      message.warning('请添加路口')
      return
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.addlineParams.updateUser = userInfo.id
    this.addlineParams.unitList = this.interDetails
    getResponseData('post', `${this.addline}?type=${this.lineType}`, this.addlineParams).then((res) => {
      const { code, data } = res.data
      if (code === 200 && data > 0) {
        this.setState({ showGreenWaveMsg: false })
        if (this.lineType === 1) {
          this.props.getLineTreeData(true)
        }
      }
      message.info(res.data.message)
    })
  }
  handleModifiMsg = (e) => {
    const pName = e.target.getAttribute('pname')
    this.addlineParams[pName] = e.target.value
    console.log(this.addlineParams)
  }
  handleModifiBaseUnit = (val, options) => {
    this.addlineParams.baseUnit = options.key
  }
  handleChangeOffset = (e) => {
    const unitId = e.target.getAttribute('unitid')
    const planNo = e.target.getAttribute('planno')
    const interMsg = this.interDetails.find(item => item.unitId === unitId)
    const { planList } = interMsg
    const planMsg = planList.find(item => item.planNo === planNo)
    planMsg.offSet = e.target.value
  }
  // 修改阶段
  // handleChangePlanStage = (value, options) => {
  //   console.log(value, options)
  //   const { unitid, planno } = options.props
  //   const interMsg = this.interDetails.find(item => item.unitId === unitid)
  //   const { planList } = interMsg
  //   const planMsg = planList.find(item => item.planNo === planno)
  //   planMsg.planId = options.key
  // }
  handleSearchKeyword = (e) => {
    this.searchKeyWord = e.target.value
  }
  handleSearchLine = () => {
    this.props.getLineTreeData(true, '', this.searchKeyWord)
  }
  handleDleInter = (e) => {
    const indexs = e.currentTarget.getAttribute('itemindex')
    this.interDetails.splice(indexs, 1)
    this.setState({ addInterDetails: this.interDetails })
  }
  // 初始化地图
  renderMineMap = () => {
    const map = new window.minemap.Map(mineMapConf)
    this.map = map
    this.map.on('click', () => {
      if (this.popup) {
        this.removeInterInfo()
      }
    })
  }
  render() {
    const {
      showGreenWaveMsg, visible, visibleTop, searchInterLists, showAddInterWrapper, addInterDetails, baseUnit,
      lineName, lineMileage, lineIntroduce,
    } = this.state
    return (
      <div id="mapContainer" className={styles.greenWaveWrapper}>
        {/* <Nav {...this.props} /> */}
        <div className={styles.interSysBox}>
          <div style={{ color: '#08FBED' }}>系统点位分布类型：</div>
          <div className={styles.systemPoint}>
            <div><Checkbox defaultChecked onChange={this.showHisense} />海信系统</div>
            <div><Checkbox defaultChecked onChange={this.CentralControl} />中控</div>
          </div>
        </div>
        <div className={styles.treeBox} ref={(input) => { this.treeBox = input }}>
          <div className={styles.titles}>协调路线列表</div>
          <div className={styles.searchBox}>
            <span className={styles.innerSearch}>
              <input className={styles.searchInput} type="text" placeholder="请输入关键字" onChange={this.handleSearchKeyword} />
              <Icon className={styles.searchIcon} type="search" onClick={this.handleSearchLine} />
            </span>
          </div>
          <div className={styles.treeDetails}>
            <CustomInterTree
              {...this.props}
              visibleShowLeft={this.visibleShowLeft}
              getSelectTreeId={this.getSelectTreeId}
              getSelectChildId={this.getSelectChildId}
            />
            {
              visible ?
                <ul style={{ top: `${visibleTop - 100}px` }} onContextMenu={this.noShow} className={styles.contextMenu}>
                  <li onClick={this.handleEditLineMsg}>查看</li>
                  <li onClick={this.handleDeleteLine}>删除</li>
                </ul> : null
            }
          </div>
          <div className={styles.newLinePlan}>
            <div className={styles.newLineBtn} onClick={this.handleShowGreenWaveMsg}>新建绿波方案</div>
          </div>
        </div>
        {
          showGreenWaveMsg &&
          <div className={styles.editGreenWave}>
            <div className={styles.editBox}>
              <div className={styles.editTitle}>编辑干线协调信息 <span className={styles.closeIcon} onClick={this.handleHideGreenWaveMsg}><Icon type="close" /></span></div>
              <div className={styles.eidtMsg}>
                <span>
                  干线名称：<input className={styles.lineName} defaultValue={lineName} type="text" pname="planName" onChange={this.handleModifiMsg} />
                </span>
                <span style={{ marginLeft: '20px' }}>
                  干线总里程：<input className={styles.mileage} defaultValue={lineMileage} type="text" pname="mileage" onChange={this.handleModifiMsg} />
                </span>
              </div>
              <div className={styles.eidtMsg}>
                <span>
                  备注描述：<input className={styles.lineDis} defaultValue={lineIntroduce} type="text" pname="detail" onChange={this.handleModifiMsg} />
                </span>
                <span className={styles.saveEditBtn} onClick={this.handleAddGreenWave}>保存</span>
              </div>
              <div className={styles.lineInterMsg}>
                <div className={styles.interMsg}>
                  基准路口：
                  <Select defaultValue={baseUnit} key={baseUnit} onChange={this.handleModifiBaseUnit}>
                    {
                      addInterDetails &&
                      addInterDetails.map(item => <Option key={item.unitId} value={item.unitId}>{item.unitName}</Option>)
                    }
                  </Select>
                  <span className={styles.addInterBtn} onClick={this.handleAddInter}>添加路口</span>
                </div>
                <div className={styles.interDetailsList}>
                  {
                    addInterDetails &&
                    addInterDetails.map((item, index) => {
                      return (
                        <div className={styles.detailsTable} key={item.unitId}>
                          <div className={styles.detailsTh}>
                            {item.unitName}<span className={styles.closeIcon} itemindex={index} onClick={this.handleDleInter}><Icon type="close" /></span>
                          </div>
                          <div className={styles.detailsTr}>
                            <div className={styles.detailsTd}>时段</div>
                            <div className={styles.detailsTd}>方案号</div>
                            <div className={styles.detailsTd} style={{ flex: 2.5 }}>阶段链</div>
                            <div className={styles.detailsTd}>周期(秒)</div>
                            <div className={styles.detailsTd} style={{ flex: 2 }}>协调相位</div>
                            <div className={styles.detailsTd}>绝对相位差(秒)</div>
                          </div>
                          {
                            item.planList &&
                            item.planList.map((plan) => {
                              return (
                                <div className={styles.detailsTr} key={plan.planNo}>
                                  <div className={styles.detailsTd}>{plan.startTime}</div>
                                  <div className={styles.detailsTd}>{plan.planNo}</div>
                                  <div className={styles.detailsTd} style={{ flex: 2.5 }}>
                                    {
                                      plan.stageList.length > 0 &&
                                      plan.stageList.map((stagePic, index) => (<img key={stagePic.STAGE_IMAGE + plan.planNo + index} src={`${requestUrl}/atms/comm/images/anniu/${stagePic.STAGE_IMAGE}`} alt="" />))
                                    }
                                    
                                  </div>
                                  <div className={styles.detailsTd}>{plan.planCycle}</div>
                                  <div className={styles.detailsTd} style={{ flex: 2 }}>
                                    {
                                      plan.stageList.length > 0 &&
                                      <Select defaultValue={plan.planId || plan.stageList[0].STAGENAME} onChange={this.handleChangePlanStage}>
                                        {
                                          plan.stageList.map((stage, index) => (
                                            <Option key={stage.STAGENO + plan.planNo + index} unitid={item.unitId} planno={plan.planNo} value={stage.STAGENO}>{stage.STAGENAME}</Option>
                                          ))
                                        }
                                      </Select>
                                    }
                                  </div>
                                  <div className={styles.detailsTd}>
                                    <input className={styles.offsetTd} type="text" defaultValue={plan.offSet} unitid={item.unitId} planno={plan.planNo} onChange={this.handleChangeOffset} />
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {
                showAddInterWrapper &&
                <div className={styles.addInterWrapper}>
                  <div className={styles.checkedInter}>
                    <div className={styles.title}>
                      添加路口<span className={styles.closeIcon} onClick={this.handleHideAddInter}><Icon type="close" /></span>
                    </div>
                    <div className={styles.addInter}>
                      <Select
                        showSearch
                        placeholder="请选择路口或查询"
                        defaultActiveFirstOption={false}
                        showArrow
                        filterOption
                        notFoundContent={null}
                        style={{ width: '240px' }}
                        onSelect={this.handleSearchInterValue}
                      >
                        {
                          searchInterLists &&
                          searchInterLists.map(item => <Option key={item.UNIT_ID} value={item.UNIT_NAME}>{item.UNIT_NAME}</Option>)
                        }
                      </Select>
                    </div>
                    <div className={styles.addBtnBox}>
                      <span onClick={this.handleSureAddInter}>确定</span>
                      <span onClick={this.handleHideAddInter}>取消</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getInterList: bindActionCreators(getInterList, dispatch),
    getBasicInterInfo: bindActionCreators(getBasicInterInfo, dispatch),
    getLineTreeData: bindActionCreators(getLineTreeData, dispatch),
  }
}

export default connect(mapStateToProps, mapDisPatchToProps)(GreenWaveMonitor)
