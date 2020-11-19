import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import mineMapConf from '../../../utils/minemapConf'
import publicStyles from './../Monitoring/Monitoring.scss'
import styles from './TrunkLineMonitoring.scss'
import ChangePopLayer from './ChangePop/ChangePop'
import { Icon, Input, message, DatePicker, Select, Modal, Checkbox } from 'antd'
import { getBasicInterInfo, getInterList } from '../../../actions/data'
import requestUrl from '../../../utils/getRequestBaseUrl'
class TrunkLineMonitoring extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      interTree: null,
      interList: null,
      roadName: '',
      changeFlag: null,
    }
    this.searchInterList = []
    this.markers = []
    this.zhongkong = true
    this.haixin = true
    this.confItems = ['北京路','中华北路','宝山北路','枣山路','解放路','花冠路','大营路','市南路','兴关路']
  }
  componentDidMount = () => {
    this.renderMineMap()
    this.props.getInterList()
  }
  componentDidUpdate = (prevState) => {
    const { interList, loadPlanloadchildsr } = this.props.data
    if (prevState.data !== this.props.data) {
      console.log(this.props.data)
    }
    if (prevState.data.loadPlanloadchildsr !== loadPlanloadchildsr) {
      this.getloadPlanLoads(loadPlanloadchildsr)
    }
    if (prevState.data.interList !== interList) {
      this.getInterList(interList)
    }
  }
  ChangePop = () => {
    this.setState({
      changeFlag: !this.state.changeFlag
    })
  }
  handleShowInterConf = (roadName) => {
    console.log('当前路的名字：',roadName)
    this.setState({ roadName })
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
  // 添加坐标点
  // addMarker = (interList) => {
  //   if (this.map) {
  //     this.infowindow += 1
  //     interList && interList.forEach((item) => {
  //       const el = document.createElement('div')
  //       el.id = `marker${item.ID}`
  //       if (item.SIGNAL_SYSTEM_CODE === 4 || item.SIGNAL_SYSTEM_CODE === 3) {
  //         const sysIcon = item.CONTROL_STATE === 10 && item.SIGNAL_SYSTEM_CODE === 4 ? '#ff0000' :
  //           item.CONTROL_STATE !== 10 && item.SIGNAL_SYSTEM_CODE === 4 ? '#00E500' :
  //             item.CONTROL_STATE === 10 && item.SIGNAL_SYSTEM_CODE === 3 ? '#ff0000' :
  //               item.CONTROL_STATE !== 10 && item.SIGNAL_SYSTEM_CODE === 3 ? '#00E500' : null
  //         el.style.backgroundColor = sysIcon
  //         // el.style['background-size'] = '100% 100%'
  //         el.style.width = '20px'
  //         el.style.height = '20px'
  //         el.style.borderRadius = '50%'
  //         el.style.boxShadow = `0 0 20px ${sysIcon}`
  //         el.addEventListener('click', (e) => {
  //           e.stopPropagation()
  //           this.props.getBasicInterInfo(item.ID).then((res) => {
  //             const { code, data } = res.data
  //             if (code === 200) {
  //               this.showCustomInfoWin(data, item.LONGITUDE, item.LATITUDE)
  //             }
  //           })
  //         })
  //         const marker = new window.minemap.Marker(el, { offset: [-10, -10] }).setLngLat({ lng: item.LONGITUDE, lat: item.LATITUDE }).addTo(this.map)
  //         this.markers.push(marker)
  //       }
  //     })
  //   }
  // }
// 添加坐标点
addMarker = (interList) => {
  if (this.map) {
    this.infowindow += 1
    interList && interList.forEach((item) => {
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
  // 自定义信息窗体
  // showCustomInfoWin = (interInfo, lng, lat) => {
  //   this.removeInterInfo()
  //   const runStatePic = `${requestUrl}/atms/imgs/stage/${interInfo.STAGE_IMAGE}`
  //   const id = `monitor${interInfo.UNIT_ID}`
  //   const el = document.createElement('div')
  //   el.className = 'custom-popup-class' // custom-popup-class为自定义的css类名
  //   const d1 = document.createElement('div')
  //   d1.innerHTML = `
  //     <div style="width:480px;height:260px;background:linear-gradient(to bottom, rgba(29, 64, 113, 0.9), rgba(21, 46, 83, 0.9));">
  //       <div style="color:#60B5F1;position:relative;height:50px;padding-top:13px;padding-left:20px;line-height:50px;font-size:16px;">
  //         路口名称 ：${interInfo.UNIT_NAME}
  //       </div>
  //       <div style="height:130px;display:flex;padding-top:20px;font-size:14px;">
  //         <div style="flex:1;color:#CED8E1;">
  //           <p style="height:32px;line-height:32px;padding-left:40px"><span style="color:#599FE0">所属城区 ：</span>${interInfo.DISTRICT_NAME}</p>
  //           <p style="height:32px;line-height:32px;padding-left:40px"><span style="color:#599FE0">信号系统 ：</span>${interInfo.SIGNALSYSTEM}</p>
  //           <p style="height:32px;line-height:32px;padding-left:40px"><span style="color:#599FE0">运行阶段 ：</span><img width="36px" height="36px" src="${runStatePic}" />${interInfo.STAGE_CODE}</p>
  //         </div>
  //         <div style="flex:1;color:#CED8E1;">
  //           <p style="height:32px;line-height:32px;padding-left:20px"><span style="color:#599FE0">控制状态 ：</span>${interInfo.CONTROLSTATE}</p>
  //           <p style="height:32px;line-height:32px;padding-left:20px"><span style="color:#599FE0">信号机IP ：</span>${interInfo.SIGNAL_IP}</p>
  //           <p style="height:32px;line-height:32px;padding-left:20px"><span style="color:#599FE0">设备状态 ：</span><span style="color:#168830;"></span>${interInfo.ALARMSTATE}</p>
  //         </div>
  //       </div>
  //       <div style="height:40px;display:flex;justify-content:center;align-items:center;">
  //         <div id="${id}" style="width:80px;color:#fff;height:30px;margin:20px auto 0;background-color:#0673B6;text-align:center;line-height:30px;border-radius:4px;cursor:pointer;">路口监控</div>
  //       </div>
  //     </div>
  //   `
  //   el.appendChild(d1)
  //   this.popup = new window.minemap.Popup({ closeOnClick: false, closeButton: false, offset: [-1, -12] })
  //     .setLngLat([lng, lat])
  //     .setDOMContent(el)
  //     .addTo(this.map)
  //   if (document.getElementById(id)) {
  //     document.getElementById(id).addEventListener('click', () => {
  //       window.open(`/interdetails?interid=${interInfo.UNIT_ID}`)
  //     })
  //   }
  // }
  // 初始化地图
  renderMineMap = () => {
    const map = new window.minemap.Map(mineMapConf)
    this.map = map
    this.map.on('click', () => {
      if (this.popup) {
        this.removeInterInfo()
      }
    })
    this.addMarker(this.state.interList)
  }
  render() {
    const { roadName, changeFlag } = this.state
    const { Option } = Select
    return (
      <div className={publicStyles.monitorWrapper} id="mapContainer" style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <div className={styles.modeTab} onClick={this.ChangePop}>模式切换</div>
        { changeFlag ? 
          <ChangePopLayer /> : null
        }
        <div className={styles.interSysBox}>
          <div style={{ color: '#08FBED' }}>系统点位分布类型：</div>
          <div className={styles.systemPoint}>
            <div><Checkbox defaultChecked onChange={this.showHisense} />海信系统</div>
            <div><Checkbox defaultChecked onChange={this.CentralControl} />中控</div>
            {/* <div><span className={styles.circleBox} />泰尔文特</div> */}
          </div>
        </div>
        <div className={styles.areaOptContainer}>
          <div className={styles.interTreeBox}>
            <div className={styles.interSearch}>
              <Select defaultValue="1">
                <Option key="1">贵阳市</Option>
              </Select>
              <span className={styles.searchBox}>
                <input className={styles.searchInput} type="text" placeholder="请输入你要搜索的内容" />
                <Icon className={styles.searchIcon} type="search" />
              </span>
            </div>
            <div className={styles.interTree}>
              <ul className={styles.confUl}>
                {
                  this.confItems.map(item => (
                    <li className={roadName === item ? `${styles.confLi} ${styles.currentHover}` : styles.confLi} key={item} onClick={() => this.handleShowInterConf(item)}>{item}<span className={styles.innterBorder} /></li>
                  ))
                }
              </ul>
              {/* {
                this.state.interTree &&
                <CustomTree treeData={this.state.interTree} keys={this.state.expendskey} getCurrentId={this.getCurrentId} getchildArea={this.getchildArea} />
              } */}
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
    getBasicInterInfo: bindActionCreators(getBasicInterInfo, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(TrunkLineMonitoring)