import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Checkbox } from 'antd'
import Histogram from './Hisrogram/histogram'
import HollowPie from './HollowPie/HollewPie'
import GraphCharts from './GraphCharts/GraphCharts'

import mineMapConf from '../../utils/minemapConf'
import styles from './HomePage.scss'

import requestUrl from '../../utils/getRequestBaseUrl'
import getReponseData from '../../utils/getResponseData'
import { getInterList, getBasicInterInfo, getControlStatus, getRealTimeStatus } from '../../actions/data'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      interList: null,
      simAreaDatas: null,
      simInterDatas: null,
      optEvaDatas: null,
      controlStateDatas: null,
      realTimeStatus: null,
      realTimeState: null,
      runBenefitDatas: null,
    }
    this.markers = []
    this.zhongkong = true
    this.haixin = true
    this.times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    this.simareaUrl = '/simulation/chartView/area/amount'
    this.siminterUrl = '/simulation/chartView/node/amount'
    this.runbenefit = '/simulation/chartView/benefit/amount'
    this.optevaUrl = '/simulation/chartView/kpi/amount'
  }
  componentDidMount = () => {
    this.renderMineMap()
    this.props.getInterList()
    this.props.getControlStatus()
    this.props.getRealTimeStatus()
    this.getAreaSimulations()
    this.getInterSimulations()
    this.getRunBenefitDatas()
    this.getOptimizeEvaluate()
  }
  componentDidUpdate = (prevState) => {
    const { interList, controlStatus, realTimeStatus } = this.props.data
    if (prevState.data.interList !== interList) {
      this.getInterList(interList)
    }
    if (prevState.data.controlStatus !== controlStatus) {
      this.getControlState(controlStatus)
    }
    if (prevState.data.realTimeStatus !== realTimeStatus) {
      this.getRealTimeState(realTimeStatus)
    }
  }
  getInterList = (interList) => {
    this.searchInterList = interList
    this.setState({
      interList,
    }, () => {
      this.addMarker(interList)
    })
  }
  // 实时状态
  getRealTimeState = (realTimeStatus) => {
    console.log(realTimeStatus)
    const serise = []
    const obj = {}
    let totleDevice = 0
    realTimeStatus.forEach((item) => {
      if (item.SIGNAL_SYSTEM_CODE === 3 || item.SIGNAL_SYSTEM_CODE === 4) {
        const devices = {}
        devices.value = item.UNNORMALSIZE + item.NORMALSIZE
        devices.name = item.CODE_NAME
        totleDevice += devices.value
        serise.push(devices)
      }
    })
    obj.seriseData = serise
    obj.totleDevice = totleDevice
    this.setState({
      realTimeStatus: obj,
      realTimeState: realTimeStatus,
    })
  }
  // 实时信号控制状态
  getControlState = (controlMsg) => {
    if (controlMsg.length) {
      const resetContent = controlMsg.map(item => ({ area_name: item.CODE_NAME, amount: item.CSIZE }))
      this.setState({ controlStateDatas: resetContent })
    } else {
      this.setState({ controlStateDatas: [] })
    }
  }
  // 优化评价指标产出统计
  getOptimizeEvaluate = () => {
    getReponseData('get', this.optevaUrl).then((res) => {
      const { code, content } = res.data
      if (code === 200 && content.length) {
        const resetContent = content.map(item => ({ area_name: item.kpi_type_name, amount: item.amount }))
        this.setState({ optEvaDatas: resetContent })
      } else {
        this.setState({ optEvaDatas: [] })
      }
    })
  }
  // 运行效益走势曲线
  getRunBenefitDatas = () => {
    getReponseData('get', this.runbenefit).then((res) => {
      console.log(res)
      const { code, content } = res.data
      if (code === 200) {
        const { today, yesterday } = content
        const resetToday = new Array(this.times.length).fill('')
        const resetYestoday = new Array(this.times.length).fill('')
        today.forEach((item) => {
          const hasIndex = this.times.indexOf(item.point_of_time)
          if (hasIndex >= 0) {
            resetToday.splice(hasIndex, 1, item.point_of_benefit)
          }
        })
        yesterday.forEach((item) => {
          const hasIndex = this.times.indexOf(item.point_of_time)
          if (hasIndex >= 0) {
            resetYestoday.splice(hasIndex, 1, item.point_of_benefit)
          }
        })
        console.log(resetToday, resetYestoday)
        this.setState({ runBenefitDatas: { today: resetToday, yesterday: resetYestoday } })
      }
    })
  }
  // 仿真区域建模统计
  getAreaSimulations = () => {
    getReponseData('get', this.simareaUrl).then((res) => {
      const { code, content } = res.data
      if (code === 200 && content.length > 0) {
        this.setState({ simAreaDatas: content })
      } else {
        this.setState({ simAreaDatas: [] })
      }
    })
  }
  // 仿真路口建模统计
  getInterSimulations = () => {
    getReponseData('get', this.siminterUrl).then((res) => {
      const { code, content } = res.data
      if (code === 200 && content.length > 0) {
        this.setState({ simInterDatas: content })
      } else {
        this.setState({ simInterDatas: [] })
      }
    })
  }
  // 添加坐标点
  addMarker = (interList) => {
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
  // 关闭自定义信息窗体
  removeInterInfo = () => {
    if (this.popup) {
      this.popup.remove()
      this.popup = null
    }
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
      simAreaDatas, simInterDatas, optEvaDatas, controlStateDatas, realTimeStatus, realTimeState, runBenefitDatas,
    } = this.state
    return (
      <div className={styles.homePageBox} id="mapContainer">
        <div className={styles.homeLeft}>
          <div className={styles.itemBox}>
            <div className={styles.title}>信号机实时状态统计</div>
            <div className={styles.itemContent}>
              <div className={styles.chartsItem}>
                {
                  realTimeStatus &&
                  <HollowPie chartsDatas={realTimeStatus} />
                }
              </div>
              <div className={styles.chartsItem}>
                {
                  realTimeState &&
                  realTimeState.map((item, index) => {
                    return (
                      <div className={styles.msg} key={item.CODE_NAME}>
                        <div className={styles.msgInfo}>
                          <span className={styles.legendIcon} style={{ backgroundColor: index === 0 ? '#C99D27' : '#456FB5' }} />
                          <p className={styles.text}>{item.CODE_NAME}</p>
                          <p className={styles.num}>{Math.round(((item.UNNORMALSIZE + item.NORMALSIZE) / realTimeStatus.totleDevice) * 100)}%</p>
                        </div>
                        <div className={styles.msgInfo} style={{ color: index === 0 ? '#C99D27' : '#456FB5' }}>
                          <p>在线{item.NORMALSIZE}处</p>
                          <p>离线{item.UNNORMALSIZE}处</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={styles.interSysBox}>
            <div style={{ color: '#08FBED' }}>系统点位分布类型：</div>
            <div className={styles.systemPoint}>
              <div><Checkbox defaultChecked onChange={this.showHisense} />海信系统</div>
              <div><Checkbox defaultChecked onChange={this.CentralControl} />中控</div>
              {/* <div><span className={styles.circleBox} />泰尔文特</div> */}
            </div>
          </div>
          <div className={styles.itemBox}>
            <div className={styles.title}>实时信号控制状态</div>
            <div className={styles.itemContent}>
              {
                controlStateDatas && controlStateDatas.length ?
                  <Histogram chartsDatas={controlStateDatas} /> :
                  <div style={{ textAlign: 'center' }}>暂无数据</div>
              }
            </div>
          </div>
          <div className={styles.itemBox}>
            <div className={styles.title}>优化评价指标产出统计</div>
            <div className={styles.itemContent}>
              {
                optEvaDatas && optEvaDatas.length > 0 ?
                  <Histogram chartsDatas={optEvaDatas} /> :
                  <div style={{ textAlign: 'center' }}>暂无数据</div>
              }
            </div>
          </div>
        </div>
        <div className={styles.homeRight}>
          <div className={styles.itemBox}>
            <div className={styles.title}>仿真路口建模统计</div>
            <div className={styles.itemContent}>
              {
                simInterDatas && simInterDatas.length > 0 ?
                  <Histogram chartsDatas={simInterDatas} /> :
                  <div style={{ textAlign: 'center' }}>暂无数据</div>
              }
            </div>
          </div>
          <div className={styles.itemBox}>
            <div className={styles.title}>仿真区域建模统计</div>
            <div className={styles.itemContent}>
              {
                simAreaDatas && simAreaDatas.length > 0 ?
                  <Histogram chartsDatas={simAreaDatas} /> :
                  <div style={{ textAlign: 'center' }}>暂无数据</div>
              }
            </div>
          </div>
          <div className={styles.itemBox}>
            <div className={styles.title}>运行效益走势曲线</div>
            <div className={styles.itemContent}>
              {
                runBenefitDatas &&
                <GraphCharts chartsDatas={runBenefitDatas} times={this.times} />
              }
            </div>
          </div>
        </div>
        <div className={styles.homeCenter}>
          <div className={styles.messageItems}>
            <div>
              <span>全市信号</span>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ flex: 0 }}>点</span><span style={{ flex: 0.4 }}>位</span>
              </span>
            </div>
            <div>
              {/* <span>0</span>
              <span>0</span>
              <span>0</span> */}
              {
                this.state.interList &&
                new Array(String(this.state.interList.length).length).fill(true).map((item, index) => (
                  <span key={item + index}>{String(this.state.interList.length).charAt(index)}</span>
                ))
              }
            </div><div>处</div>
          </div>
          <div className={styles.messageItems}>
            <div>
              <span>仿真建模</span>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ flex: 0 }}>点</span><span style={{ flex: 0.4 }}>位</span>
              </span>
            </div>
            <div>
              <span>0</span>
              <span>0</span>
              <span>4</span>
            </div><div>处</div>
          </div>
          <div className={styles.messageItems}>
            <div>
              <span>优化评价</span>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ flex: 0 }}>点</span><span style={{ flex: 0.4 }}>位</span>
              </span>
            </div>
            <div>
              <span>0</span>
              <span>0</span>
              <span>4</span>
            </div><div>处</div>
          </div>
        </div>
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
    getControlStatus: bindActionCreators(getControlStatus, dispatch),
    getRealTimeStatus: bindActionCreators(getRealTimeStatus, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(HomePage)
