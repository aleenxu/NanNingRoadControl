import React, { PureComponent } from 'react'
import reactDom from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import mineMapConf from '../../../utils/minemapConf'
import publicStyles from './../Monitoring/Monitoring.scss'
import styles from './TrunkLineMonitoring.scss'
import ChangePopLayer from './ChangePop/ChangePop'
import Video from '../../../components/video/videoForMap'
import videoPic from './imgs/cerame.png'
import { Icon, Input, message, DatePicker, Select, Modal, Checkbox, Switch } from 'antd'
import { getBasicInterInfo, getInterList } from '../../../actions/data'
import requestUrl from '../../../utils/getRequestBaseUrl'
const lineData1 = [
  [106.64513697965267,26.62257492842266],
  [106.65013697965267,26.62257492842266],
  [106.65313697965267,26.62257492842266]
] 
const lineData2 = [
  [106.64427610830967 , 26.596210970562536],
  [106.64870396760267 , 26.594710970562536],
  [ 106.65115762213628 , 26.594010970562536]
] 
const lineData3 = [
  [106.53506321981879 , 26.577590803467606],
  [106.54188594473704 , 26.57920550974212]
] 
class TrunkLineMonitoring extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      interTree: null,
      interList: null,
      roadName: '',
      changeFlag: null,
      //视频
      url: { url: "rtmp://58.200.131.2:1935/livetv/cctv2", id: "videoUrlDemo"},
      stageData: ['01.png', '02.png', '03.png', '04.png', '11.png', 'red.png', 'yellow.png' ],
    }
    this.searchInterList = []
    this.markers = []
    this.pointMarkers = []
    this.drawLines = []
    this.zhongkong = true
    this.haixin = true
    this.confItems = ['阳光大道','北京西路','观清路','枣山路','解放路','花冠路','大营路','市南路','兴关路']
  }
  componentDidMount = () => {
    window.handleStage = this.handleStage
    this.renderMineMap()
    this.props.getInterList()
  }
  componentDidUpdate = (prevState) => {
    const { interList, loadPlanloadchildsr } = this.props.data
    if (prevState.data !== this.props.data) {
      // console.log(this.props.data)
    }
    if (prevState.data.loadPlanloadchildsr !== loadPlanloadchildsr) {
      this.getloadPlanLoads(loadPlanloadchildsr)
    }
    if (prevState.data.interList !== interList) {
      this.getInterList(interList)
    }
  }
  handleStage = (stageIndex) => {
    $("#stage_current_" + stageIndex).siblings().removeClass(styles.imgCurHover).addClass(styles.imgHover)
    $("#stage_current_" + stageIndex).addClass(styles.imgCurHover)
  }
  // 计算起始与终点之间的中心点 > 用于重置地图中心点
  returnCenterLnglat = (startPoint, endPoint) => {
    const lng = startPoint[0] + (Math.abs(startPoint[0] - endPoint[0]) / 2)
    const lat = startPoint[1] + (Math.abs(startPoint[1] - endPoint[1]) / 2)
    return [lng, lat]
  }
  drawLine = (lineData, lineId, lineColor, lineWidth) => {
    const degsArr = []; // 所有两点间的夹角度
    if (this.map) {
      this.delPointMarker()
      this.delLines()
      const layer = {
        "id": lineId ? lineId : 'demo1',
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "geometry": {
              "type": "LineString",
              "coordinates": lineData
            }
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": lineColor ? lineColor : 'yellow',
          "line-width": lineWidth ? lineWidth : 6
        }
      }
      this.drawLines.push(layer)
      this.map.addLayer(layer);
      this.map.setZoom(15)
      this.map.setCenter(this.returnCenterLnglat(lineData[0],lineData[lineData.length - 1]))
      this.addPointMarkers(lineData)
    }
  }
  // 删除绘线时坐标点
delPointMarker = () => {
  if (this.map && this.pointMarkers.length) {
    this.pointMarkers.forEach((item) => {
      item.remove()
    })
    this.pointMarkers = []
  }
}
  // 删除绘线
delLines = () => {
  if (this.map && this.drawLines.length) {
    debugger
    this.drawLines.forEach((item) => {
      this.map.removeLayer(item.id)
      this.map.removeSource(item.id)
    })
    this.drawLines = []
  }
}
  ChangePop = () => {
    this.setState({
      changeFlag: !this.state.changeFlag
    })
  }
  handleShowInterConf = (roadName) => {
    // console.log('当前路的名字：',roadName)
    this.setState({ roadName })
    switch(roadName) {
      case '阳光大道':case '枣山路':case '大营路':
        this.drawLine(lineData1, 'road1')
        break;
      case '北京西路':case '解放路':case '市南路':
        this.drawLine(lineData2, 'road2')
        break;
      default:
        this.drawLine(lineData3, 'road3')
        break;
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
  // 绘制线时添加的光点与video图标
  addPointMarkers = (interList) => {
    if (this.map) {
      this.infowindow += 1
      interList && interList.forEach((item) => {
        const elParent = document.createElement('div')
        elParent.style.width = '40px'
        elParent.style.height = '20px'
        elParent.style.position = 'relative'

        const elVideo = document.createElement('div')
        elVideo.style.width = '25px'
        elVideo.style.height = '25px'
        elVideo.style.cursor = 'pointer'
        elVideo.style.position = 'relative'
        elVideo.style.top = '-60px'
        elVideo.style.left = '7.5px'
        elVideo.style.background = `url(${videoPic})`
        
        const elAnimation = document.createElement('div')
        elAnimation.setAttribute('class',styles.animationS)
        const el = document.createElement('div')
        el.style.width = '40px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = 'rgba(34,245,248)'
        el.style.cursor = 'pointer'
        el.style.position = 'absolute'
        el.style.left = '0'
        el.style.top = '0'
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          this.showStageInfo(item[0], item[1])
        })
        elVideo.addEventListener('click', (e) => {
          e.stopPropagation()
          this.showVideoInfo(item[0], item[1])
        })
        elParent.appendChild(elAnimation)
        elParent.appendChild(el)
        elParent.appendChild(elVideo)
        const point = new window.minemap.Marker(elParent, { offset: [-10, -10] }).setLngLat([item[0], item[1]]).addTo(this.map)
        this.pointMarkers.push(point)
      })
    }
  }
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
  removeInterInfo = (param) => {
    if (param) {
      param.remove()
      param = null
    }
    if (window.playerMap) {
      window.playerMap.dispose()
      window.playerMap = null
    }
  }
  // 自定义信息窗体
  showCustomInfoWin = (interInfo, lng, lat) => {
    this.removeInterInfo(this.popup)
    this.removeInterInfo(this.popupVideo)
    this.removeInterInfo(this.popupStage)
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
        window.open(`/#/interdetails?interid=${interInfo.UNIT_ID}`)
      })
    }
  }
  // 自定义信息窗体 之 视频
  showVideoInfo = (lng, lat) => {
    this.removeInterInfo(this.popup)
    this.removeInterInfo(this.popupVideo)
    this.removeInterInfo(this.popupStage)
    const el = document.createElement('div')
    el.className = 'custom-popup-class' // custom-popup-class为自定义的css类名
    const d1 = document.createElement('div')
    d1.innerHTML = `
      <div style="width:480px;height:260px;border-radius:5px;border:2px #26528C solid;background:linear-gradient(to bottom, rgba(29, 64, 113, 0.9), rgba(21, 46, 83, 0.9));">
        <div style="color:#60B5F1;position:relative;height:40px;padding:10px 0;padding-left:20px;line-height:20px;font-size:16px;">
          名称 ：${this.state.roadName}
        </div>
        <div id='videoCon'></div>
      </div>
    `
    el.appendChild(d1)
    this.popupVideo = new window.minemap.Popup({ closeOnClick: false, closeButton: false, offset: [10, -50] })
      .setLngLat([lng, lat])
      .setDOMContent(el)
      .addTo(this.map)
    if (document.getElementById('videoCon')) {
      reactDom.render(
          <div>
              <Video url={this.state.url} showB={true} ></Video>
          </div>,
          document.getElementById('videoCon')
      );
    }
  }
  // 自定义信息窗体 之 相位
  showStageInfo = (lng, lat) => {
    this.removeInterInfo(this.popup)
    this.removeInterInfo(this.popupVideo)
    this.removeInterInfo(this.popupStage)
    let htmlStr = '<div style="width:100%;padding-top:60px;display:flex;align-items: center;justify-content: center;flex-wrap:wrap; position:relative;">'
    htmlStr += `<div style="position:absolute;top:0;left:0;right:0;height:60px;display: flex;justify-content: center;align-items: center;
    flex-wrap: wrap;"><div id="switchBox"></div>开启手动</div>
    <div style="width:100%;height:260px;padding-top:10px;overflow-y:auto;">`
      for (let i = 0; i < this.state.stageData.length; i++){
        let imgName = this.state.stageData [i]
        htmlStr += `<div id="stage_current_`+i+`" onclick="handleStage(`+i+`)" class=${styles.imgHover}><img style='width:44px;height:43px;' src=${require('./imgs/' + imgName)} /></div>`
      }
    htmlStr += '</div></div>'
    const el = document.createElement('div')
    el.className = 'custom-popup-class' // custom-popup-class为自定义的css类名
    const d1 = document.createElement('div')
    d1.innerHTML = `
      <div style="width:70px;border-radius:2px;border:1px #26528C solid;">
        `+htmlStr+`
      </div>
    `
    el.appendChild(d1)
    this.popupStage = new window.minemap.Popup({ closeOnClick: false, closeButton: false, offset: [12.5, 5] })
      .setLngLat([lng, lat])
      .setDOMContent(el)
      .addTo(this.map)
    if (document.getElementById('switchBox')) {
      reactDom.render(
          <div>
              <Switch defaultChecked />
          </div>,
          document.getElementById('switchBox')
      );
    }
  }
  // 初始化地图
  renderMineMap = () => {
    const map = new window.minemap.Map(mineMapConf)
    this.map = map
    this.map.on('click', (event) => {
      console.log('地图触发点：',event.lngLat.lng,",",event.lngLat.lat)
      if (this.popup) {
        this.removeInterInfo(this.popup)
      }
      if (this.popupVideo) {
        this.removeInterInfo(this.popupVideo)
      }
      if (this.popupStage) {
        this.removeInterInfo(this.popupStage)
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