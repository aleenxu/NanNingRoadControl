import React from 'react'
import { Select, Icon, Switch } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './AreaOptimize.scss'
// import Nav from '../Header/Nav/Nav'

import CustomTree from '../../../components/CustomTree/CustomTree'
import EchartsPage from '../../../components/ecahrtsPage/EchartsPage'
import echartss from './chartsOptions'
import Intersection from './IntersectionList/Intersection'
import AreaConfig from './AreaConfig/AreaConfig'
import InfoBg from './img/infobg.png'
import RegularCrossing from './img/01.png'
import KeyIntersection from './img/02.png'
import mineMapConf from '../../../utils/minemapConf'
import getResponseDatas from '../../../utils/getResponseData'
import { getInterDataTree, getAreaAvgDelayTime, getAreaAvgSpeed } from '../../../actions/management'

class AreaOptimize extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1,
      showConfig: false,
      interTree: null,
      expendskey: [],
      Listofintersections: [],
      isBtnShow: false,
      speedDelayDatas: null,
      trankLineName: null,
      areaCtlregionId: null,
      trankLineId: null,
      areaId: null,
    }
    this.echarts = echartss
    this.btnList = [
      { id: 1, name: '区域平均延误' },
      { id: 2, name: '区域平均车速' },
    ]
    this.markers = []
    this.infowindow = 0
    this.dir = 1
    this.interUrl = '/dws/evlregionOpt/getcycleoffset'
    this.interParams = {
      dir: 2, // 1反向，2正向
      evlregion_id: '',
      rdchl_id: '',
    }
  }

  componentDidMount = () => {
    this.renderMineMap()
    this.props.getInterDataTree()
  }
  componentDidUpdate = (prevState) => {
    const { InterDataTree, AreaAvgDelayTime, AreaAvgSpeed } = this.props.data
    if (prevState.data.InterDataTree !== InterDataTree) {
      this.getsInterDataTree(InterDataTree)
    }
    if (prevState.data.AreaAvgDelayTime !== AreaAvgDelayTime) {
      this.getsAreaAvgDelayTime(AreaAvgDelayTime)
    }
    if (prevState.data.AreaAvgSpeed !== AreaAvgSpeed) {
      this.getsAreaAvgSpeed(AreaAvgSpeed)
    }
  }
  getTrankLineDir = (isCheck) => { // 协调方向切换
    this.setState({ isBtnShow: isCheck })
    if (isCheck) {
      this.interParams.dir = 1
    } else {
      this.interParams.dir = 2
    }
    this.getInterLists()
  }
  // 获取树结构的点击 ，干线
  getCurrentId = (id, value) => {
    console.log(id, value)
    this.setState({ trankLineName: value })
  }
  // 点击子区的回调
  getchildArea = (id, value) => {
    console.log(id, value, '子区')
  }
  // 参数格式转换
  getFormData = (obj) => {
    const formData = new FormData()
    Object.keys(obj).forEach((item) => {
      formData.append(item, obj[item])
    })
    // console.log(formData)
    return formData
  }
  getsAreaAvgSpeed = (AreaAvgSpeed) => {
    const result = AreaAvgSpeed
    if (result.code === '1') {
      const initArr = new Array(result.x.length).fill(0)
      result.init['区域平均速度'].forEach((item, index) => {
        const _index = (result.x).indexOf(item.time)
        if (_index !== -1) {
          initArr.splice(_index, 1, item.data)
        }
      })
      const obj = {
        data: initArr,
        x: result.x,
      }
      this.setState({ speedDelayDatas: obj })
    }
  }
  getsAreaAvgDelayTime = (AreaAvgDelayTime) => {
    const result = AreaAvgDelayTime
    if (result.code === '1') {
      const initArr = new Array(result.x.length).fill(0)
      result.init['区域平均延误时间'].forEach((item, index) => {
        const _index = (result.x).indexOf(item.time)
        if (_index !== -1) {
          initArr.splice(_index, 1, item.data)
        }
      })
      const obj = {
        data: initArr,
        x: result.x,
      }
      console.log(obj)
      this.setState({ speedDelayDatas: obj })
    }
  }
  getsInterDataTree = (InterDataTree) => {
    const { code, data, firstAdcode, firstCtlregionId, firstRdchlId, firstRdchlName } = InterDataTree
    const expendskey = [firstAdcode, firstCtlregionId]
    this.firstAdcode = firstAdcode
    this.firstCtlregionId = firstCtlregionId
    if (code === '1') {
      this.interParams.evlregion_id = firstCtlregionId
      this.interParams.rdchl_id = firstRdchlId
      this.setState({
        interTree: data,
        expendskey,
        trankLineName: firstRdchlName,
        areaCtlregionId: firstCtlregionId,
        trankLineId: firstRdchlId,
        areaId: firstAdcode,
      })
      this.props.getAreaAvgDelayTime(firstCtlregionId)
      this.getInterLists()
    }
  }
  getCalculateXy = (fromX, fromY, toX, toY) => {
    const l = 0.00025
    const x1 = parseFloat(fromX)
    const y1 = parseFloat(fromY)
    const x2 = parseFloat(toX)
    const y2 = parseFloat(toY)
    let x3 = 0
    let y3 = 0
    let x4 = 0
    let y4 = 0
    let x5 = 0
    let y5 = 0
    let x6 = 0
    let y6 = 0
    if (x2 - x1 === 0) {
      x3 = x1 - (((y2 - y1) / Math.abs(y2 - y1)) * (l / 2))
      y3 = y1
      x4 = x1 + (((y2 - y1) / Math.abs(y2 - y1)) * (l / 2))
      y4 = y1
      x5 = x2 - (((y2 - y1) / Math.abs(y2 - y1)) * (l / 2))
      y5 = y2
      x6 = x2 + (((y2 - y1) / Math.abs(y2 - y1)) * (l / 2))
      y6 = y2
    } else {
      const k = (y2 - y1) / (x2 - x1)
      const s1 = (l / 2) * (1 / Math.sqrt(1 + Math.pow(k, 2))) * ((x2 - x1) / Math.abs(x2 - x1))
      const sk = (l / 2) * (k / Math.sqrt(1 + Math.pow(k, 2))) * ((x2 - x1) / Math.abs(x2 - x1))
      x3 = x1 + sk
      y3 = y1 - s1
      x4 = x1 - sk
      y4 = y1 + s1
      x5 = x2 + sk
      y5 = y2 - s1
      x6 = x2 - sk
      y6 = y2 + s1
    }
    // return [[x4, y4], [x6, y6]]
    return [[x3, y3], [x5, y5]]
  }
  // 获取路口
  getInterLists = () => {
    getResponseDatas('post', this.interUrl, this.getFormData(this.interParams)).then((res) => {
      const { code, data } = res.data
      if (code === '1') {
        this.setState({ Listofintersections: data })
        this.addMarker(data)
        if (data.length) {
          const lineSource = []
          const lineReverse = []
          data.forEach((item, index) => {
            const next = data[index + 1]
            if (next) {
              const pointXy = this.getCalculateXy(item.lng, item.lat, next.lng, next.lat)
              lineSource.push(...pointXy)
            }
          })
          data.reverse().forEach((item, index) => {
            const next = data[index + 1]
            if (next) {
              const pointXy = this.getCalculateXy(item.lng, item.lat, next.lng, next.lat)
              lineReverse.push(...pointXy)
            }
          })
          // 画线得坐标[...lineSource, ...lineReverse]
          this.map.on('load', () => {
            this.mapAddSources([...lineSource, ...lineReverse])
            this.mapAddLayers()
          })
        }
      }
    })
  }
  mapAddSources = (linePositions) => {
    const jsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            // coordinates: [
            //   [106.63513749871285, 26.60814304856755], [106.63166867016086, 26.60635692962945], [106.63174008196575, 26.606369988778603], [106.62697256813274, 26.606914673037704],
            //   [106.62694419045727, 26.6066662888443], [106.63171170429027, 26.606121604585198], [106.63178311609515, 26.606134663734352], [106.63525194464714, 26.60792078267245],
            // ],
            coordinates: linePositions,
          },
          properties: {
            kind: 1,
          },
        },
      ],
    }
    if (this.map) {
      this.map.addSource('lineSource', {
        type: 'geojson',
        data: jsonData,
      })
    }
  }
  //
  mapAddLayers = () => {
    console.log(this.map)
    if (this.map) {
      this.map.addLayer({
        id: 'lineLayer',
        type: 'line',
        source: 'lineSource',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-width': 5,
          'line-color': {
            type: 'categorical',
            property: 'kind',
            stops: [[1, 'green'], [2, 'green']],
            default: '#ff0000',
          },
        },
        minzoom: 7,
        maxzoom: 17.5,
      })

      this.map.addLayer({
        id: 'symbolLayer',
        type: 'symbol',
        source: 'lineSource',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': {
            type: 'categorical',
            property: 'kind',
            stops: [[1, 'direction-1-18'], [2, 'direction-1-18']],
            default: 'point-10-7',
          },
          'symbol-placement': 'line',
        },
        paint: {
          'icon-color': '#ff0000',
        },
        minzoom: 7,
        maxzoom: 17.5,
      })
    }
  }
  // 添加坐标点
  addMarker = (interList) => {
    if (this.markers.length) {
      this.delMarker()
    }
    if (this.map) {
      this.infowindow += 1
      interList.forEach((item) => {
        const imgUrl = item.is_key_inter === '1' ? KeyIntersection : RegularCrossing
        const el = document.createElement('div')
        el.id = `marker${item.ID}`
        el.style.width = '30px'
        el.style.height = '30px'
        el.style.borderRadius = '50%'
        // el.style.backgroundImage = 'linear-gradient(to bottom, #DFFBB3, #37DF1A)'
        el.style.background = `url(${imgUrl}) center center no-repeat`
        el.style.backgroundSize = '100% 100%'
        const marker = new window.minemap.Marker(el, { offset: [-15, -15] }).setLngLat({ lng: item.lng, lat: item.lat }).addTo(this.map)
        this.markers.push(marker)
      })
    }
  }
  // 删除坐标点
  delMarker = () => {
    if (this.map && this.markers) {
      this.markers.remove()
      this.markers = null
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
  showInterInfo = () => {
    this.removeInterInfo()
    const lnglat = this.map.getCenter()
    const id = `removeInterInfo${this.infowindow}`
    const infoHtml = `
      <div style="width:480px;height:260px;background:url(${InfoBg}) center center no-repeat;background-size:100% 100%;">
        <div style="position:relative;height:50px;padding-top:13px;padding-left:20px;line-height:50px;font-size:15px;">
          路口名称 ：123456
          <span id=${id} style="position:absolute;top:25px;right:25px;width:20px;height:20px;text-align:center;line-height:20px;font-size:16px;cursor:pointer;color:#49C2D5;">X</span>
        </div>
        <div style="height:200px;display:flex;padding-top:20px;font-size:14px;">
          <div style="flex:1;">
            <p style="height:32px;line-height:32px;padding-left:40px">所属城区 ：兴宁区</p>
            <p style="height:32px;line-height:32px;padding-left:40px">信号系统 ：海信</p>
            <p style="height:32px;line-height:32px;padding-left:40px">运行阶段 ：东西左转</p>
            <div style="width:80px;height:30px;margin:20px auto 0;background-color:#0F85FF;text-align:center;line-height:30px;border-radius:4px; cursor: pointer;">路口监控</div>
          </div>
          <div style="flex:1;">
            <p style="height:32px;line-height:32px;padding-left:20px">控制状态 ：本地多时段</p>
            <p style="height:32px;line-height:32px;padding-left:20px">信号机IP ：192.168.1.204</p>
            <p style="height:32px;line-height:32px;padding-left:20px">设备状态 ：正常</p>
            <div style="width:80px;height:30px;margin:20px auto 0;background-color:#0F85FF;text-align:center;line-height:30px;border-radius:4px; cursor: pointer;">路口优化</div>
          </div>
        </div>
      </div>
    `
    this.popup = new window.minemap.Popup({ closeOnClick: true, closeButton: false, offset: [-15, -25] })
      .setLngLat([lnglat.lng, lnglat.lat])
      .setHTML(infoHtml)
      .addTo(this.map)
    document.getElementById(id).addEventListener('click', this.removeInterInfo)
    return this.popup
  }
  btnRegion = (id) => { // 切点击区域
    this.setState({ num: id })
    if (id === 1) {
      this.props.getAreaAvgDelayTime(this.firstCtlregionId)
    } else {
      this.props.getAreaAvgSpeed(this.firstCtlregionId)
    }
  }
  closepage = () => { // 关闭当前页面
    this.setState({ showConfig: false })
  }
  handleShowConfig = () => {
    this.setState({ showConfig: true })
  }
  // 初始化地图
  renderMineMap = () => {
    const map = new window.minemap.Map(mineMapConf)
    this.map = map
  }
  render() {
    const { Option } = Select
    const {
      num, showConfig, Listofintersections, isBtnShow, speedDelayDatas, trankLineName, areaCtlregionId, trankLineId, areaId,
    } = this.state
    return (
      <div className={styles.areaOptWrapper} id="mapContainer">
        {/* <Header {...this.props} /> */}
        {/* <Nav {...this.props} /> */}
        {
          showConfig &&
          <AreaConfig closepage={this.closepage} ctrlregionId={areaCtlregionId} trankLineId={trankLineId} areaId={areaId} />
        }
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
              {
                this.state.interTree &&
                <CustomTree treeData={this.state.interTree} keys={this.state.expendskey} getCurrentId={this.getCurrentId} getchildArea={this.getchildArea} />
              }
            </div>
          </div>
          <ul className={styles.signaContainer_center}>
            {/* <li>
              <span>协调路线：</span>
              <Select style={{ width: '58%' }} defaultValue="1">
                <Option key="1">贵阳市</Option>
                <Option key="2">南阳市</Option>
              </Select>
            </li> */}
            <li>
              <span>协调方向切换：</span>
              <Switch onChange={this.getTrankLineDir} />
            </li>
            <li>
              <span>干线长度：</span>
              <span>567</span>
            </li>
            <li className={styles.lis}>
              <dl>
                <dt><span><img src={KeyIntersection} alt="" /></span></dt>
                <dd>关键路口</dd>
              </dl>
              <dl>
                <dt><span><img src={RegularCrossing} alt="" /></span></dt>
                <dd>常规路口</dd>
              </dl>
            </li>
          </ul>
          <div className={styles.signaContainer_right}>
            <div className={styles.title}><div>{trankLineName}</div><div><span onClick={this.handleShowConfig}>区域优化配置</span></div></div>
            <div className={styles.signaContainer_right_top}>
              {
                Listofintersections && Listofintersections.map(item => <Intersection isBtnShow={isBtnShow} itemList={item} key={item.id} />)
              }
            </div>
            <div className={styles.signaContainer_right_bom}>
              <div className={styles.signaRB_top}>
                {
                  this.btnList.map(item => <div onClick={() => this.btnRegion(item.id)} className={item.id === num ? styles.active : ''} key={item.id}>{item.name}</div>)
                }
              </div>
              {
                speedDelayDatas &&
                <div className={styles.signaRB_bom}>
                  <EchartsPage chartsDatas={speedDelayDatas} />
                </div>
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.data, ...state.managements },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getInterDataTree: bindActionCreators(getInterDataTree, dispatch),
    getAreaAvgDelayTime: bindActionCreators(getAreaAvgDelayTime, dispatch),
    getAreaAvgSpeed: bindActionCreators(getAreaAvgSpeed, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(AreaOptimize) 
