import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import mineMapConf from '../../../utils/minemapConf'
import classNames from 'classnames'
import publicStyles from './../Monitoring/Monitoring.scss'
import styles from '../TrunkLineCoordinate/TrunkLineCoordinate.scss'
import { Icon, Input, message, DatePicker, Select, Modal, Checkbox } from 'antd'
import CustomInterTree from '_C/CustomInterTree/CustomInterTree'
import { getInterList, getBasicInterInfo, getVipRoute, getVipRouteChild, getLoadPlanTree, getLoadChildTree } from '../../../actions/data'
import requestUrl from '../../../utils/getRequestBaseUrl'
class AreaCoordinate extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      interListHeight: 0,
      searchInterList: null,
      visible: false,
      visibleTop: 0,
      roadCrossingFlag: null,
      secretTaskTop: null,
      secretTaskName:'',
      secretTaskLeft: null,
      secretTaskRight: null,
      interList: null,
    }
    this.searchInterList = []
    this.markers = []
    this.zhongkong = true
    this.haixin = true
  }
  componentDidMount = () => {
    this.renderMineMap()
    this.props.getInterList()
    this.props.getLoadPlanTree()
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        this.setState({ interListHeight: 0, interListHeights: 0 })
      }
      this.visibleShowLeft('', '', false)
    })
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
  // 新建协调路线
  quicklySecretTask = () => {
    this.setState({
      secretTaskTop: true
    })
  }
  // 添加路口
  getAddUnitsIfram = () => {
    this.setState({
      roadCrossingFlag: true,
    })
  }
  handleClose = () => {
    this.setState({
      secretTaskTop: null,
    })

  }
  hanleSelectInter = (e) => {
    const interId = e.currentTarget.getAttribute('interid')
    const marker = document.getElementById('marker' + interId)
    const lng = e.currentTarget.getAttribute('lng')
    const lat = e.currentTarget.getAttribute('lat')
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
  handleSearchInterFocus = () => {
    this.setState({ interListHeight: 300 })
  }
  handleSearchInputChange = (e) => {
    const { value } = e.target
    this.setState({
      searchVal: value,
    })
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
  handleShowInterMonitor = () => {
    if (this.state.interMonitorLeft > 0) {
      this.setState({
        interMonitorLeft: -355,
      })
    } else {
      this.setState({
        interMonitorLeft: 15,
      })
    }
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
  noShow = (e) => { // 禁止默认右键菜单
    e.stopPropagation()
    e.preventDefault()
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
  // 添加坐标点
  // addMarker = (interList) => {
  //   if (this.map) {
  //     this.infowindow += 1
  //     interList.forEach((item) => {
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
    const { interMonitorLeft, interListHeight, searchInterList, visible, visibleTop, secretTaskTop, roadCrossingFlag, secretTaskLeft, secretTaskRight } = this.state
    const { Search } = Input
    return (
      <div className={publicStyles.monitorWrapper} id="mapContainer" style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <div className={styles.interSysBox}>
          <div style={{ color: '#08FBED' }}>系统点位分布类型：</div>
          <div className={styles.systemPoint}>
            <div><Checkbox defaultChecked onChange={this.showHisense} />海信系统</div>
            <div><Checkbox defaultChecked onChange={this.CentralControl} />中控</div>
            {/* <div><span className={styles.circleBox} />泰尔文特</div> */}
          </div>
        </div>
        {!!secretTaskTop ?
          <div className={styles.MaskBox}>
            <div className={styles.secretTaskBox}>
              <div className={styles.title}>干线协调 <Icon className={styles.Close} type='close' onClick={() => {this.handleClose(false)}}  /></div>
              <div className={styles.secretTaskCon}>
                <div className={styles.conTop}>
                  <div className={styles.formBox}><span>干线名称：</span><Input value="" placeholder="请输入干线名称" /></div>
                  <div className={styles.formBox} style={{flex: .3}}><span>干线总里程(米)：</span><Input type='number' value="" placeholder="请输入" /></div>
                  <div className={styles.formBox} style={{marginRight: '0'}}><span>备注描述：</span><Input value="" onChange={(e) => {this.handleChange(e, 'secretTaskDetail')}} placeholder="请输入备注描述" /></div>
                </div>
                <div className={styles.conLeft}>
                  <div className={styles.titleSmall}>干线路口<em onClick={this.getAddUnitsIfram}>添加路口</em></div>
                  <div id="conLeftBox" className={styles.conLeftBox}>
                    {
                      secretTaskLeft && secretTaskLeft.map((item, ind) =>{
                        return (
                          <div key={'sLeft'+ind} className={styles.leftItem}>
                            <div className={styles.itemTit}>{item.name + " " + " ( IP: " + item.IPString + " )"}<Icon title="删除" onClick={()=>{this.getDeleteUnitFram(vipId, item.id)}} className={styles.Close} type='close' /></div>
                            <div className={styles.itemCon}>
                              <div className={styles.imgBox} style={{width:'200px',height:'200px'}}>
                                <img className={styles.imgBgPic} src={this.imgBgUrl+item.imgName} title={!item.imgName ? '暂无图片' : ''} />
                                <div className={styles.typeStatus}>{item.type ? item.type : '未知'}</div>
                                {
                                  item.imgs.length > 0 && item.imgs.map((imgsItem) => {
                                    return <img key={'img' + imgsItem.ID} title={imgsItem.CANALIZATION_NAME} 
                                    style={{position:'absolute', width:imgsItem.WIDTH/2 + 'px', height: imgsItem.HEIGHT/2+'px', 
                                    top: imgsItem.P_TOP/2 + 'px', left: imgsItem.P_LEFT/2 + 'px'}} src={this.imgDirUrl + imgsItem.IMAGE_NAME} />
                                  })
                                }
                              </div>
                              <div className={styles.imgBox} style={{maxHeight:'200px',overflowY:'auto' }}>
                              {
                                item.unitStageList.length > 0 && item.unitStageList.map((infoItem) => {
                                  const marginVal = item.unitStageList.length > 6 ? '2px' : ''
                                  const imgName = item.unitRunStageNo === infoItem.STAGENO ? infoItem.STAGE_IMAGE : infoItem.STAGE_IMAGE.replace('_ch','')
                                  return <div key={'info'+infoItem.STAGENO} style={{ marginRight: marginVal }} className={styles.dirItem}><img src={this.imgInfoUrl + imgName} /><b title={infoItem.STAGENAME}>{infoItem.STAGENAME}</b></div>
                                })
                              }
                              </div>
                            </div>
                            <div className={styles.formBox}><span>预设勤务阶段：</span>
                              <Select defaultValue={item.unitRunStageNo || item.unitRunStageNo === 0 ? item.unitRunStageNo : '0'} onChange={(e) => {this.handleChange(e, 'selectStateArr', ind)}}>
                                <Option value='0'>请选择</Option>
                                {
                                  item.unitStageList.length > 0 && item.unitStageList.map((infoItem) => {
                                    return <Option key={'infos'+infoItem.STAGENO} value={infoItem.STAGENO}>{infoItem.STAGENAME}</Option>
                                  })
                                }
                              </Select>
                              <em onClick={()=>{
                                this.getSaveUnitRunStage(vipId, item.id, this.state['selectStateArr'][ind])
                                }}>保&nbsp;&nbsp;存</em>
                            </div>
                          </div>
                        )
                      })
                    }
                    {!secretTaskLeft && <div className={styles.PanelItemNone} style={{height:'127px', lineHeight:'127px'}}>暂无数据</div>}
                  </div>
                    
                  </div>
              </div>
            </div>
          </div> : null
        }
        <div className={styles.interMonitorBox} style={{ left: `${interMonitorLeft}px` }}>
          <span className={styles.hideIcon} onClick={this.handleShowInterMonitor}>
            {interMonitorLeft > 0 ? <Icon type="backward" /> : <Icon type="forward" />}
          </span>
          <div className={styles.title}>区域协调方案查询</div>
          <div className={styles.searchBox}>
          <input
                className={styles.searchInput}
                onClick={this.handleSearchInterFocus}
                onChange={this.handleSearchInputChange}
                type="text"
                placeholder="请输入你要搜索的路口 / 路线"
                ref={(input) => { this.searchInputBox = input }}
                style={{ width: '100%' }}
              />
              <Icon className={styles.searchIcon} type="search" onClick={() => {this.props.getVipRoute('', searchVal)}} />
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
                <li onClick={() => { this.lookRoadLine(vipId) }}>查看</li>
                <li onClick={() => { this.delRoadLine(vipId) }}>删除</li>
              </ul> : null
          }
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
    getLoadPlanTree: bindActionCreators(getLoadPlanTree, dispatch),
    getLoadChildTree: bindActionCreators(getLoadChildTree, dispatch),
    getBasicInterInfo: bindActionCreators(getBasicInterInfo, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(AreaCoordinate)