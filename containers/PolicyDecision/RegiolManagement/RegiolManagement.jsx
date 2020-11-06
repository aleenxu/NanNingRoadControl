import React, { Component } from 'react'
import { Icon, message, Modal, } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomInterTree from '_C/CustomInterTree/CustomInterTree'
import styles from './RegiolManagement.scss'

// import Nav from '../Header/Nav/Nav'
import ModalPage from '../InterManagement/ModalPage/ModalPage'
import ModalPages from './ModalPage/ModalPage'
import mineMapConf from '../../../utils/minemapConf'
import requestUrl from '../../../utils/getRequestBaseUrl'

import { getBasicInterInfo, getInterList, getLoadPlanTree, getLoadChildTree, geteditDistrictInfoThings, getAreaList } from '../../../actions/data'
import { getUnitInterInfo } from '../../../actions/InterManage'
import { getloadUnitNames, getdeleteDistrict, getnewchildree } from '../../../actions/management'

class RegiolManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchInterList: null,
      interListHeight: 0,
      interMonitorLeft: 15,
      visibleTop: 0,
      isModalPage: false,
      visible: false,
      showAreaMsg: false,
    }
    this.markers = []
    this.searchInterList = []
  }
  componentDidMount() {
    this.renderMineMap()
    this.props.getInterList()
    this.props.getAreaList()
    this.props.getLoadPlanTree()
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        this.setState({ interListHeight: 0 })
      }
    })
  }
  componentDidUpdate = (prevState) => {
    const { areaList, editDistrictInfoThings, loadUnitNames, interList } = this.props.data
    if (prevState.data.interList !== interList) {
      this.getInterLists(interList)
    }
    if (prevState.data.areaList !== areaList) {
      this.getAreaList(areaList)
    }
    if (prevState.data.editDistrictInfoThings !== editDistrictInfoThings) {
      this.geteditDistrictInfoThings(editDistrictInfoThings)
    }
    if (prevState.data.loadUnitNames !== loadUnitNames) {
      this.getloadUnitNames(loadUnitNames)
    }
  }
  getloadUnitNames = (loadUnitNames) => {
    this.roadDetail.districtHas = loadUnitNames.districtHas
    console.log(this.roadDetail.districtHas)
    this.setState({
      showAreaMsg: true,
    })
  }
  geteditDistrictInfoThings = (editDistrictInfoThing) => {
    this.props.getloadUnitNames(editDistrictInfoThing.ID)
    this.roadDetail = editDistrictInfoThing
  }
  // 道路列表
  getInterLists = (interList) => {
    this.addMarker(interList)
  }
  // 路口列表
  getAreaList = (areaList) => {
    this.searchInterList = areaList
    this.setState({
      searchInterList: areaList,
    })
  }
  // 从子集获取区域id和index 请求路口
  getSelectTreeId = (id) => {
    this.props.getLoadChildTree(id)
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
  addIntersection = () => { // 添加路口
    this.roadDetail = ''
    this.setState({
      showAreaMsg: true,
    })
  }
  delectRoad = () => { // 删除路段
    this.setState({
      visible: false,
    })
    this.handleDeleteRoad(this.roadId)
  }
  handleDeleteRoad = (id) => {
    const { confirm } = Modal
    const that = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        that.props.getdeleteDistrict(id).then((res) => {
          const { code } = res.data
          if (code === 200) {
            that.props.getLoadPlanTree()
            message.success('删除成功')
          }
        })
      },
    })
  }
  seeGo = () => {
    this.props.geteditDistrictInfoThings(this.roadId)
    this.setState({
      visible: false,
    })
  }
  visibleShowLeft = (top, id, show) => { // 框的跳转与位置
    this.roadId = id
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
  handleSearchInterFocus = () => {
    this.setState({ interListHeight: 300 })
  }
  hanleSelectInterSelect = (e) => { // 下拉框选择切换
    const values = e.currentTarget.innerText
    this.searchInputBox.value = values
    const arrs = this.searchInterList.filter(item => item.NAME === values)
    this.props.getnewchildree(arrs)
  }
  hanleSelectInter = (e) => {
    const interId = e.currentTarget.getAttribute('interid')
    const marker = document.getElementById('marker' + interId)
    const lng = Number(e.currentTarget.getAttribute('lng'))
    const lat = Number(e.currentTarget.getAttribute('lat'))
    // const interName = e.currentTarget.innerText
    if (marker && this.map) {
      this.map.setCenter([lng, lat])
      // marker.click()
      // this.searchInputBox.value = interName
      // this.setState({ interListHeight: 0 })
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
        if (item.NAME.includes(value)) {
          searchInters.push(item)
        }
      })
      this.setState({ searchInterList: searchInters })
    }, 200)
    if (value === '') {
      this.props.getnewchildree(this.searchInterList)
    }
  }
  handleShowInterMonitor = () => {
    if (this.state.interMonitorLeft > 0) {
      this.setState({ interMonitorLeft: -345 })
    } else {
      this.setState({ interMonitorLeft: 15 })
    }
  }
  noShow = (e) => { // 禁止默认右键菜单
    e.stopPropagation()
    e.preventDefault()
  }
  isShowModalPage = () => { // 取消弹窗页面
    this.setState({ showAreaMsg: false, isModalPage: false })
  }
  // 添加坐标点
  addMarker = (interList) => {
    if (this.map) {
      this.infowindow += 1
      interList.forEach((item) => {
        const el = document.createElement('div')
        el.id = `marker${item.ID}`
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = '#00E500'
        el.style.boxShadow = `0 0 20px #00E500`
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
      })
    }
  }
  // 删除坐标点
  delMarker = () => {
    if (this.map && this.marker) {
      this.marker.remove()
      this.marker = null
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
          <div id="${id}" style="width:80px;color:#fff;height:30px;margin:20px auto 0;background-color:#0673B6;text-align:center;line-height:30px;border-radius:4px;cursor:pointer;">路口信息</div>
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
        this.setState({ isModalPage: true })
        this.props.getUnitInterInfo(interInfo.UNIT_ID) // 获取路口信息
      })
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
      interMonitorLeft, isModalPage, searchInterList, interListHeight, visible, visibleTop, showAreaMsg,
    } = this.state
    const { getLoadPlanTree } = this.props
    return (
      <div id="mapContainer" className={styles.InterManagementWrapper}>
        {/* <Nav {...this.props} /> */}
        <div className={styles.interMonitorBox} style={{ left: `${interMonitorLeft}px` }}>
          <span className={styles.hideIcon} onClick={this.handleShowInterMonitor}>
            {interMonitorLeft > 0 ? <Icon type="backward" /> : <Icon type="forward" />}
          </span>
          <div className={styles.title}>区域查询</div>
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
                      onClick={this.hanleSelectInterSelect}
                    >{item.NAME}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className={styles.OptimizingBtns}><span>区域管理</span></div>
          <div className={styles.addtask}>
            <span onClick={this.addIntersection}>添加区域</span>
          </div>
          <div className={styles.treeBox}>
            <CustomInterTree
              {...this.props}
              visibleShowLeft={this.visibleShowLeft}
              getSelectTreeId={this.getSelectTreeId}
              getSelectChildId={this.getSelectChildId}
            />
          </div>
          {
            visible ?
              <ul style={{ top: `${visibleTop - 100}px` }} onContextMenu={this.noShow} className={styles.contextMenu}>
                <li onClick={this.seeGo}>查看</li>
                <li onClick={this.delectRoad}>删除</li>
              </ul> : null
          }
        </div>
        {
          isModalPage && <ModalPage {...this.props} isShowModalPage={this.isShowModalPage} />
        }
        {
          showAreaMsg && <ModalPages getLoadPlanTree={getLoadPlanTree} roadDetail={this.roadDetail} isShowModalPage={this.isShowModalPage} />
        }
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.data, ...state.interManage, ...state.managements },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    geteditDistrictInfoThings: bindActionCreators(geteditDistrictInfoThings, dispatch),
    getInterList: bindActionCreators(getInterList, dispatch),
    getBasicInterInfo: bindActionCreators(getBasicInterInfo, dispatch),
    getLoadPlanTree: bindActionCreators(getLoadPlanTree, dispatch),
    getLoadChildTree: bindActionCreators(getLoadChildTree, dispatch),
    getnewchildree: bindActionCreators(getnewchildree, dispatch),
    getUnitInterInfo: bindActionCreators(getUnitInterInfo, dispatch),
    getloadUnitNames: bindActionCreators(getloadUnitNames, dispatch),
    getdeleteDistrict: bindActionCreators(getdeleteDistrict, dispatch),
    getAreaList: bindActionCreators(getAreaList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(RegiolManagement)
