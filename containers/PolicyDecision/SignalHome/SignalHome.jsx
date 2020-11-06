import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon, message, Checkbox } from 'antd'

// import Header from '../Header/Header'
import Nav from '../../HomePage/Header/Nav/Nav'
import Form from './form/Form'
import Histogram from '../../../components/Histogram/histogram'
import HollowPie from '../../../components/HollowPie/HollewPie'
import GraphCharts from '../../../components/GraphCharts/GraphCharts'
import mineMapConf from '../../../utils/minemapConf'
import styles from './Signahome.scss'

import requestUrl from '../../../utils/getRequestBaseUrl'
import { getInterList, getControlRoads, getControlCount, getPlanTime, getControlStatus, getRealTimeStatus, getfaultStatistics, getBasicInterInfo } from '../../../actions/data'

class SignalHome extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      interList: null,
      searchInterList: null,
      interListHeight: 0,
      controlRoads: [],
      controlCounts: [],
      planTimes: [],
      controlStatus: null,
      realTimeStatus: null,
      realTimeState: null,
      faultCompare: null,
      hisenseSingal: '000',
      siemensSingal: '000',
      iszhongK: true,
      ishaixin: true,
    }
    this.zhongkong = true
    this.haixin = true
    this.searchInterList = []
    this.markers = []
    this.infowindow = 0
    this.pieColor = ['#C99D27', '#456FB5', '#0f85ff', '#00E8FF']
    this.time = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  }
  componentDidMount = () => {
    this.renderMineMap()
    this.props.getInterList()
    this.props.getControlRoads()
    this.props.getControlCount()
    this.props.getPlanTime()
    this.props.getControlStatus()
    this.props.getRealTimeStatus()
    this.props.getfaultStatistics()
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        this.setState({ interListHeight: 0 })
      }
    })
  }
  componentDidUpdate = (prevState) => {
    const { interList, controlRoads, controlCounts, planTimes, controlStatus, realTimeStatus, faultStatistics } = this.props.data
    if (prevState.data.interList !== interList) {
      this.getInterList(interList)
    }
    if (prevState.data.controlRoads !== controlRoads) {
      this.getControlRoads(controlRoads)
    }
    if (prevState.data.controlCounts !== controlCounts) {
      this.getControlCount(controlCounts)
    }
    if (prevState.data.planTimes !== planTimes) {
      this.getPlanTimes(planTimes)
    }
    if (prevState.data.controlStatus !== controlStatus) {
      this.getControlState(controlStatus)
    }
    if (prevState.data.realTimeStatus !== realTimeStatus) {
      this.getRealTimeState(realTimeStatus)
    }
    if (prevState.data.faultStatistics !== faultStatistics) {
      this.getfaultTotle(faultStatistics)
    }
  }
  // 路口列表
  getInterList = (interList) => {
    this.searchInterList = interList
    this.setState({
      interList,
      searchInterList: interList,
    }, () => {
      this.addMarker(interList)
    })
  }
  // 手控路口
  getControlRoads = (controlRoads) => {
    this.setState({ controlRoads })
  }
  // 手控次数
  getControlCount = (controlCounts) => {
    this.setState({ controlCounts })
  }
  // 配时变更
  getPlanTimes = (planTimes) => {
    this.setState({ planTimes })
  }
  // 信号变更状态
  getControlState = (controlStatus) => {
    const xdata = []
    const serise = []
    const obj = {}
    controlStatus.forEach((item) => {
      xdata.push(item.CODE_NAME)
      serise.push(item.C_CODE)
    })
    obj.xData = xdata
    obj.seriseData = serise
    this.setState({ controlStatus: obj })
  }
  // 实时状态
  getRealTimeState = (realTimeStatus) => {
    const serise = []
    const obj = {}
    let totleDevice = 0
    let hisenseSingal = '000'
    let siemensSingal = '000'
    realTimeStatus.forEach((item) => {
      if (item.SIGNAL_SYSTEM_CODE === 3 || item.SIGNAL_SYSTEM_CODE === 4) {
        const devices = {}
        devices.value = item.UNNORMALSIZE + item.NORMALSIZE
        devices.name = item.CODE_NAME
        totleDevice += devices.value
        serise.push(devices)
        const num = item.UNNORMALSIZE + item.NORMALSIZE
        if (item.SIGNAL_SYSTEM_CODE === 4) {
          hisenseSingal = String(num).length === 2 ? '0' + num : String(num).length === 1 ? '00' + num : String(num)
        }
        if (item.SIGNAL_SYSTEM_CODE === 3) {
          siemensSingal = String(num).length === 2 ? '0' + num : String(num).length === 1 ? '00' + num : String(num)
        }
      }
    })
    obj.seriseData = serise
    obj.totleDevice = totleDevice
    this.setState({
      realTimeStatus: obj,
      realTimeState: realTimeStatus,
      hisenseSingal,
      siemensSingal,
    })
  }
  // 故障统计
  getfaultTotle = (faultTotle) => {
    const today = new Array(24).fill(0)
    const yesterday = new Array(24).fill(0)
    faultTotle.today.forEach((item) => {
      const indexs = this.time.indexOf(item.HOURTIME)
      if (indexs >= 0) {
        today.splice(indexs, 1, item.UNITSIZE)
      }
    })
    faultTotle.yesterday.forEach((item) => {
      const indexs = this.time.indexOf(item.HOURTIME)
      if (indexs >= 0) {
        yesterday.splice(indexs, 1, item.UNITSIZE)
      }
    })
    this.setState({ faultCompare: { today, yesterday } })
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
  // 更新坐标点
  updateMarkerPosition = () => {
    if (this.map && this.marker) {
      const lnglat = this.map.getCenter()
      this.marker.setLngLat([lnglat.lng + 0.01, lnglat.lat + 0.01])
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
  handleSearchInterFocus = () => {
    this.setState({ interListHeight: 300 })
  }
  hanleSelectInter = (e) => {
    const interId = e.target.getAttribute('interid')
    const marker = document.getElementById('marker' + interId)
    const lng = e.target.getAttribute('lng')
    const lat = e.target.getAttribute('lat')
    const interName = e.target.innerText
    if (marker && this.map) {
      this.map.setCenter([lng, lat])
      marker.click()
      this.searchInputBox.value = interName
      this.setState({ interListHeight: 0 })
    } else {
      message.info('该路口尚未接入')
    }
  }
  handleSearchInputChange = (e) => {
    const { value } = e.target
    const searchInters = []
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
      this.searchTimer = null
    }
    this.searchTimer = setTimeout(() => {
      this.searchInterList.forEach((item) => {
        if (item.UNIT_NAME.indexOf(value) >= 0) {
          searchInters.push(item)
        }
      })
      this.setState({ searchInterList: searchInters })
    }, 200)
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
    const { interListHeight, interList, hisenseSingal, siemensSingal, searchInterList, controlCounts, ishaixin, iszhongK } = this.state
    return (
      <div className={styles.signalHomeBox} id="mapContainer">
        {/* <Header {...this.props} /> */}
        {/* <Nav {...this.props} /> */}
        <div className={styles.interListBox}>
          <div className={styles.interSearch}>
            <span className={styles.searchBox}>
              <input
                className={styles.searchInput}
                onClick={this.handleSearchInterFocus}
                onChange={this.handleSearchInputChange}
                type="text"
                placeholder="请输入你要搜索的路口"
                ref={(input) => { this.searchInputBox = input }}
              />
              <Icon className={styles.searchIcon} type="search" />
            </span>
          </div>
          <div className={styles.interList} style={{ maxHeight: `${interListHeight}px`, overflowY: 'auto' }}>
            <div>
              {
                searchInterList &&
                searchInterList.map(item => (
                  <div
                    className={styles.interItem}
                    key={item.ID}
                    interid={item.ID}
                    lng={item.LONGITUDE}
                    lat={item.LATITUDE}
                    onClick={this.hanleSelectInter}
                  >{item.UNIT_NAME}
                  </div>
                ))
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
        <div className={styles.signaContainer_left}>
          <div className={`${styles.signaContainer_left_box} ${styles.controlRoadBox}`}>
            {
              this.state.controlRoads &&
              <Form name="最新手控路口TOP15" headOne="区域" headTwo="路口名称" headTre="最新控制时间" datas={this.state.controlRoads} />
            }
          </div>
          <div className={styles.signaContainer_left_box}>
            <div className={styles.title}>实时信号控制状态</div>
            <div style={{ height: '260px', background: 'rgba(24, 46, 83,.9)' }}>
              {
                this.state.controlStatus &&
                <Histogram chartsDatas={this.state.controlStatus} />
              }
            </div>
          </div>
          <div className={styles.title}>信号机实时状态统计</div>
          <div className={`${styles.signaContainer_left_box} ${styles.signaContainer_left_boxer}`}>
            <div className={styles.signaContainerLB_left}>
              <div style={{ height: '260px' }}>
                {
                  this.state.realTimeStatus &&
                  <HollowPie chartsDatas={this.state.realTimeStatus} />
                }
              </div>
            </div>
            <div className={styles.signaContainerLB_right}>
              <div className={styles.signaContainerLB_rightBox}>
                {
                  this.state.realTimeState &&
                  this.state.realTimeState.map((item, index) => {
                    const totle = this.state.realTimeStatus.totleDevice
                    if (item.SIGNAL_SYSTEM_CODE === 3 || item.SIGNAL_SYSTEM_CODE === 4) {
                      return (
                        <dl key={item.CODE_NAME}>
                          <dt><b className={styles.bone} style={{ backgroundColor: this.pieColor[index] }} /><li>{item.CODE_NAME}</li><li className={styles.lione} style={{ color: this.pieColor[index] }}>在线{item.NORMALSIZE}处</li></dt>
                          <dd><b /><li className={styles.nums}>{((item.NORMALSIZE + item.UNNORMALSIZE) / totle).toFixed(1) * 100}%</li><li className={styles.lione} style={{ color: this.pieColor[index] }}>离线{item.UNNORMALSIZE}处</li></dd>
                        </dl>
                      )
                    }
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.signaContainer_center}>
          <div className={`${styles.road_show_item} ${styles.buling}`}>
            <div><span>全市</span><span>信号点位</span></div>
            <div>
              {
                interList &&
                new Array(String(interList.length).length).fill(true).map((item, index) => (
                  <span key={item + index}>{String(interList.length).charAt(index)}</span>
                ))
              }
            </div><div>处</div>
          </div>
          <div className={`${styles.road_show_item} ${styles.buling}`}>
            <div><span>海信</span><span>接入</span></div>
            <div>
              {
                hisenseSingal &&
                new Array(hisenseSingal.length).fill(true).map((item, index) => (
                  <span key={item + index}>{hisenseSingal.charAt(index)}</span>
                ))
              }
            </div><div>处</div>
          </div>
          <div className={`${styles.road_show_item} ${styles.buling}`}>
            <div><span>中控</span><span>接入</span></div>
            <div>
              {
                siemensSingal &&
                new Array(siemensSingal.length).fill(true).map((item, index) => (
                  <span key={item + index}>{siemensSingal.charAt(index)}</span>
                ))
              }
            </div><div>处</div>
          </div>
        </div>
        <div className={styles.signaContainer_right}>
          <div className={styles.rightListPop}>
            <div className={styles.listBox}>
              {
                this.state.controlCounts &&
                <Form name="最新手控路口次数TOP15" headOne="路口名称" headTwo="当月控制次数" headTre="最新控制时间" datas={this.state.controlCounts} type="count" />
              }
            </div>
            <div className={styles.listBox}>
              {
                this.state.planTimes &&
                <Form name="最新方案配时变更路数TOP15" headOne="区域名称" headTwo="路口名称" headTre="配时变更时间" datas={this.state.planTimes} type="times" />
              }
            </div>
          </div>
          <div className={styles.malfunctionBox}>
            <div className={styles.title}>故障统计曲线图</div>
            <div style={{ height: '260px' }}>
              {
                this.state.faultCompare &&
                <GraphCharts chartsDatas={this.state.faultCompare} times={this.time} />
              }
            </div>
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
    getControlRoads: bindActionCreators(getControlRoads, dispatch),
    getControlCount: bindActionCreators(getControlCount, dispatch),
    getPlanTime: bindActionCreators(getPlanTime, dispatch),
    getControlStatus: bindActionCreators(getControlStatus, dispatch),
    getRealTimeStatus: bindActionCreators(getRealTimeStatus, dispatch),
    getfaultStatistics: bindActionCreators(getfaultStatistics, dispatch),
    getBasicInterInfo: bindActionCreators(getBasicInterInfo, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignalHome)
