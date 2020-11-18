import React, { PureComponent } from 'react'
import { Icon, Input, message, DatePicker, Select, Modal, Checkbox } from 'antd'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import styles from './SecretTask.scss'
// import Header from '../Header/Header'
import requestUrl from '../../../utils/getRequestBaseUrl'
// import CustomTree from './CustomTree/CustomTree'
import CustomInterTree from '_C/CustomInterTree/CustomInterTree'
import InfoBg from './img/Infobg.png'


import mineMapConf from '../../../utils/minemapConf'

import { getInterList, getBasicInterInfo, getVipRoute, getVipRouteChild, getLoadPlanTree, getLoadChildTree } from '../../../actions/data'
import { getAddUnitsIfram, getDeleteUnitFram, getDeleteVipRoad, getFindRoadByVipId, getFindList, getInitRoad, getLoadUnitStage, getSaveVipRoad, getSaveUnitRunStage  } from '../../../actions/SecretTask'
import OnlineH from '../SignalHome/img/online_h.png'
import OutlineH from '../SignalHome/img/outline_h.png'
import OnlineS from '../SignalHome/img/online_s.png'
import OutlineS from '../SignalHome/img/ouline_s.png'

const { Option } = Select
class SecretTask extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      interList: null,
      searchInterList: null,
      interListHeight: 0,
      interListHeights: 0,
      interMonitorLeft: 15,
      visible: false,
      visibleTop: 0,
      vipId: '',
      unitId: '',
      secretTaskName:'',
      secretTaskDetail:'',
      selectStateArr: [],
      searchVal: '',
      roadCrossingFlag: null,
      searchVals: '',
      secretTaskTop: null,
      secretTaskLeftOld: null,
      secretTaskLeft: null,
      secretTaskRight: null,
      startValue: null,
      endValue: null,
      endOpen: false,
    }
    this.searchInterList = []
    this.markers = []
    this.infowindow = 0
    this.imgBgUrl = `${requestUrl}/atms/comm/dzimg/10/`
    this.imgDirUrl = `${requestUrl}/atms/comm/dzimg/2/`
    this.imgInfoUrl = `${requestUrl}/atms/comm/images/anniu/`
    this.zhongkong = true
    this.haixin = true
  }
  componentDidMount() {
    this.renderMineMap()
    this.props.getInterList()
    this.props.getLoadPlanTree()
    // this.props.getVipRoute()
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        this.setState({ interListHeight: 0, interListHeights: 0 })
      }
      this.visibleShowLeft('', '', false)
    })
  }
  componentDidUpdate = (prevState) => {
    const { interList, basicInterInfo, loadPlanTree, vip_delRoadSucess, vip_initRoad, vip_findRoadByVipId, vip_findList, vip_saveSucess, vip_addSucess, vip_delSucess, vip_unitRunStage, loadPlanloadchildsr } = this.props.data
    if (prevState.data !== this.props.data) {
      console.log(this.props.data)
    }
    if (prevState.data.loadPlanloadchildsr !== loadPlanloadchildsr) {
      this.getloadPlanLoads(loadPlanloadchildsr)
    }
    if (prevState.data.interList !== interList) {
      this.getInterList(interList)
    }
    // if (prevState.data.loadPlanTree !== loadPlanTree) {
    //   this.getVipRoute()
    // }
    if (prevState.data.basicInterInfo !== basicInterInfo) {
      this.getInterBasicInfo(basicInterInfo)
    }
    if (prevState.data.vip_findRoadByVipId !== vip_findRoadByVipId) {
      console.log(vip_findRoadByVipId, this.state.vipId, '当前有啥？')
      const roadIdArr = vip_findRoadByVipId.vipRoadUnitsData // 路口id集合
      this.setState({
        secretTaskTop: vip_findRoadByVipId.vipRoadData[0], //浮层中上面勤务回显数据
        secretTaskName: vip_findRoadByVipId.vipRoadData[0].START_UNIT,
        secretTaskDetail: vip_findRoadByVipId.vipRoadData[0].DETAIL,
      }, () => {
        roadIdArr.map((item, index) => {
          this.props.getInitRoad({
            "afterStr": "",
            "beforStr": "",
            "id": item.UNIT_ID,
            "orders": index+1,
            "vipId": this.state.vipId,
          })
        })
        if (roadIdArr.length == 0) {
          this.setState({
            secretTaskLeft: null,
          })
        }
      })
    }
    if (prevState.data.vip_initRoad !== vip_initRoad) {
      const secretTaskLeft = this.state.secretTaskLeft ? JSON.parse(JSON.stringify(this.state.secretTaskLeft)) : [];
      let selectStateArr = [];
      vip_initRoad ? secretTaskLeft.push(vip_initRoad) : null
      if (this.state.roadCrossingFlag) {
        this.setState({
          selectStateArr: [],
        }, () => {
          vip_initRoad.unitRunStageNo ? selectStateArr.push(vip_initRoad.unitRunStageNo) : selectStateArr.push(null)
          selectStateArr = this.state.selectStateArr ? JSON.parse(JSON.stringify(this.state.selectStateArr)) : [];
        })
      } else {
        selectStateArr = this.state.selectStateArr ? JSON.parse(JSON.stringify(this.state.selectStateArr)) : [];
        vip_initRoad.unitRunStageNo ? selectStateArr.push(vip_initRoad.unitRunStageNo) : selectStateArr.push(null)
        // secretTaskLeft.map((item, i) =>{
        //   item.id === unitId ? secretTaskLeft.splice(i, 1) : null
        // })
      }
      this.setState({ secretTaskLeft, selectStateArr })
    }
    if (prevState.data.vip_findList !== vip_findList) {
      this.setState({ secretTaskRight: vip_findList.vipRoadList.length > 0 ? vip_findList.vipRoadList : null })
    }
    if (prevState.data.vip_saveSucess !== vip_saveSucess) {
      if ( vip_saveSucess === 1 ){
        message.info('操作成功！')
        this.props.getVipRoute().then(()=>{
          const { loadPlanTree } = this.props.data
          this.state.vipId == '' ? this.setState({vipId: loadPlanTree[loadPlanTree.length-1].ID}, () => {
            console.log(this.state.vipId,'看下当前的vipId')
          }) : null
        })
      }
    }
    if (prevState.data.vip_addSucess !== vip_addSucess) {
      if ( vip_addSucess === 1 ){
        message.info('操作成功！')
        this.props.getFindRoadByVipId(this.state.vipId)
      } else if ( vip_addSucess === 0 ) {
        message.info('数据已存在！')
        this.setState({
          secretTaskLeft: this.state.secretTaskLeftOld,
        })
      }
    }
    if (prevState.data.vip_delSucess !== vip_delSucess) {
      if ( vip_delSucess === 1 ){
        message.info('操作成功！')
        this.props.getFindRoadByVipId(this.state.vipId)
      }
    }
    if (prevState.data.vip_unitRunStage !== vip_unitRunStage) {
      if ( vip_unitRunStage === 1 ){
        message.info('操作成功！')
        this.props.getFindRoadByVipId(this.state.vipId)
      }
    }
    if (prevState.data.vip_delRoadSucess !== vip_delRoadSucess) {
      if ( vip_delRoadSucess === 1 ){
        message.info('操作成功！')
        this.props.getVipRoute()
      }
    }

  }
  getloadPlanLoads = (loadPlanLoadChild) => {
    this.searchInterList = loadPlanLoadChild
    this.setState({
      searchInterList: loadPlanLoadChild,
    })
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
  // addMarker = (interList) => {
  //   if (this.map) {
  //     this.infowindow += 1
  //     interList.forEach((item) => {
  //       const el = document.createElement('div')
  //       el.id = `marker${item.ID}`
  //       if (item.SIGNAL_SYSTEM_CODE === 4 || item.SIGNAL_SYSTEM_CODE === 3) {
  //         const sysIcon = item.CONTROL_STATE === 10 && item.SIGNAL_SYSTEM_CODE === 4 ? OutlineH :
  //           item.CONTROL_STATE !== 10 && item.SIGNAL_SYSTEM_CODE === 4 ? OnlineH :
  //             item.CONTROL_STATE === 10 && item.SIGNAL_SYSTEM_CODE === 3 ? OutlineS :
  //               item.CONTROL_STATE !== 10 && item.SIGNAL_SYSTEM_CODE === 3 ? OnlineS : null
  //         el.style.background = `url(${sysIcon}) center center no-repeat`
  //         el.style['background-size'] = '100% 100%'
  //         el.style.width = '22px'
  //         el.style.height = '22px'
  //         new Promise((resolve) => {
  //           resolve(this.props.getBasicInterInfo(item.ID))
  //         }).then(() => {
  //           const marker = new window.minemap.Marker(el, { offset: [-25, -25] }).setLngLat({ lng: item.LONGITUDE, lat: item.LATITUDE })
  //             .setPopup(this.showInterInfo(item.LONGITUDE, item.LATITUDE, item.UNIT_NAME, item.SIGNAL_SYSTEM_CODE === 4 ? '海信' : '西门子', item.ID))
  //             .addTo(this.map)
  //           this.markers.push(marker)
  //         })
  //       }
  //     })
  //   }
  // }
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
  // 获取路口基本信息
  getInterBasicInfo = (basicInterInfo) => {
    this.belongArea = basicInterInfo.DISTRICT_NAME
    this.controlState = basicInterInfo.CONTROLSTATE
    this.alarmState = basicInterInfo.ALARMSTATE
    this.singalIp = basicInterInfo.SIGNAL_IP
    // this.runStatePic = `http://192.168.1.230:8080/atms/imgs/stage/${basicInterInfo.STAGE_IMAGE}`
    this.runStatePic = `http://10.11.57.101:20206/atms/imgs/stage/${basicInterInfo.STAGE_IMAGE}`
    this.runText = basicInterInfo.STAGE_CODE
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
  // showInterInfo = (lng, lat, interName, singalSys, interId) => {
  //   this.removeInterInfo()
  //   const id = `monitor${interId}`
  //   // <span id=${id} style="position:absolute;top:25px;right:25px;width:20px;height:20px;text-align:center;line-height:20px;font-size:16px;cursor:pointer;color:#49C2D5;">X</span>
  //   const infoHtml = `
  //     <div style="width:480px;height:260px;background:url(${InfoBg}) center center no-repeat;background-size:100% 100%;">
  //       <div style="position:relative;height:50px;padding-top:13px;padding-left:20px;line-height:50px;font-size:15px;">
  //         路口名称 ：${interName}
  //       </div>
  //       <div style="height:130px;display:flex;padding-top:20px;font-size:14px;">
  //         <div style="flex:1;">
  //           <p style="height:32px;line-height:32px;padding-left:40px">所属城区 ：${this.belongArea}</p>
  //           <p style="height:32px;line-height:32px;padding-left:40px">信号系统 ：${singalSys}</p>
  //           <p style="height:32px;line-height:32px;padding-left:40px">运行阶段 ：<img width="36px" height="36px" src="${this.runStatePic}" />${this.runText || ''}</p>
  //         </div>
  //         <div style="flex:1;">
  //           <p style="height:32px;line-height:32px;padding-left:20px">控制状态 ：${this.controlState}</p>
  //           <p style="height:32px;line-height:32px;padding-left:20px">信号机IP ：${this.singalIp}</p>
  //           <p style="height:32px;line-height:32px;padding-left:20px">设备状态 ：${this.alarmState}</p>
  //         </div>
  //       </div>
  //       <div style="height:40px;display:flex;justify-content:center;align-items:center;">
  //         <div id="${id}" style="width:80px;height:30px;margin:20px auto 0;background-color:#0F85FF;text-align:center;line-height:30px;border-radius:4px;cursor:pointer;">路口监控</div>
  //       </div>
  //     </div>
  //   `
  //   this.popup = new window.minemap.Popup({ closeOnClick: true, closeButton: false, offset: [-15, -25] })
  //     .setLngLat([lng, lat])
  //     .setHTML(infoHtml)
  //     .addTo(this.map)
  //   if (document.getElementById(id)) {
  //     document.getElementById(id).addEventListener('click', () => {
  //       window.open(`/interdetails?interid=${interId}`)
  //     })
  //   }
  //   return this.popup
  // }
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
  hanleSelectInters = (e) => {
    const interId = e.currentTarget.getAttribute('interid')
    this.setState({
      unitId: interId,
    })
    this.searchInputBox.value = e.target.innerText
  }
  handleSearchInterFocuss = () => {
    this.setState({ interListHeights: 200 })
  }
  handleSearchInputChanges = (e) => {
    const { value } = e.target
    this.setState({
      searchVals: value,
    }, () => {
      this.searchInterList.forEach((item) => {
        if (item.UNIT_NAME === value) {
          this.setState({
            unitId: item.UNIT_ID,
          })
        }
      })
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
  /* 
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  }; */
  // 保存路线
  getSaveVipRoad = (vipId, name, detail) => {
    this.props.data.vip_saveSucess = ''
    this.props.getSaveVipRoad(vipId, name, detail)
  }
  // 改变文本及下拉
  handleChange = (e, name, index) => {
    console.log(this.state[name])
    if (index === undefined) {
      this.setState({
        [name]: e.target.value,
      })
    } else {
      debugger
      this.state[name][index] = e
    }
  }
  // 快速特勤任务
  quicklySecretTask = () => {
    this.setState({
      secretTaskTop: true,
      vipId: '',
      secretTaskDetail: '',
      secretTaskName: '',
    })
  }
  // 添加路口
  getAddUnitsIfram = () => {
    this.setState({
      roadCrossingFlag: true,
    })
  }
  AddUnitsIframBtn = (vipId, unitId) => {
    this.props.data.vip_addSucess = ''
    this.setState({
      secretTaskLeftOld: this.state.secretTaskLeft,
      secretTaskLeft: null,
    }, () => {
      this.props.getAddUnitsIfram(vipId, unitId)
    })
  }
  getSaveUnitRunStage = (vipId, unitId, stageNo) => {
    console.log(vipId, unitId, stageNo, 'adfasdf')
    this.props.data.vip_unitRunStage = ''
    this.setState({
      secretTaskLeft: null,
    }, () => {
      this.props.getSaveUnitRunStage(vipId, unitId, stageNo)
    })
  }
  // 关闭
  handleClose = ( flag, moudleName ) => {
    if (!flag){
      if ( moudleName === 'roadCrossingFlag') {
        this.setState({
          roadCrossingFlag: null,
        })
      } else {
        this.setState({
          secretTaskTop: null,
          secretTaskLeft: null,
          secretTaskRight: null,
        })
      }
    }
  } 
  // 初始化地图
  renderMineMap = () => {
    const map = new window.minemap.Map(mineMapConf)
    this.map = map
  }
  // 查看路线
  lookRoadLine = (vipId) => {
    this.props.getFindRoadByVipId(vipId)
    this.props.getFindList(vipId)
  }
  // 删除路口
  getDeleteUnitFram = (vipId, unitId) => {
    const _this = this
    Modal.confirm({
      title: '确认要删除当前路口？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        _this.props.data.vip_delSucess = ''
        _this.setState({
          secretTaskLeft: null,
        }, () => {
          _this.props.getDeleteUnitFram(vipId, unitId)
        })
        
      },
      onCancel() { },
    })
  }
  // 删除路线
  delRoadLine = (vipId) => {
    let roadLineName = ''
    this.props.data.loadPlanTree.map((item) => {
      if (item.ID === vipId) {
        roadLineName = item.NAME
      }
    })
    const _this = this
    Modal.confirm({
      title: '确认要删除勤务路线：( '+ roadLineName +' ) ?',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        _this.props.data.vip_delRoadSucess = ''
        _this.props.getDeleteVipRoad(vipId)
      },
      onCancel() { },
    })
  }
  render() {
    const {
      interMonitorLeft,
      visible,
      visibleTop,
      interListHeight, interListHeights, searchInterList, searchVal, searchVals, secretTaskTop, secretTaskLeft, secretTaskRight, 
      vipId, unitId, secretTaskDetail, secretTaskName, roadCrossingFlag,
    } = this.state
    const { Search } = Input
    return (
      <div id="mapContainer" className={styles.secretTaskWrapper}>
        {/* <Header {...this.props} /> */}
        {/* <div className={styles.interSysBox}>
          <div style={{ color: '#08FBED' }}>系统点位分布类型：</div>
          <div className={styles.systemPoint}>
            <div><span className={styles.upIconBox}><i /><b /></span>海信系统</div>
            <div><span className={styles.squareBox} />西门子</div>
            <div><span className={styles.circleBox} />泰尔文特</div> 
          </div>
        </div> */}
        <div className={styles.interSysBox}>
          <div style={{ color: '#08FBED' }}>系统点位分布类型：</div>
          <div className={styles.systemPoint}>
            <div><Checkbox defaultChecked onChange={this.showHisense} />海信系统</div>
            <div><Checkbox defaultChecked onChange={this.CentralControl} />中控</div>
            {/* <div><span className={styles.circleBox} />泰尔文特</div> */}
          </div>
        </div>
        <div className={styles.interMonitorBox} style={{ left: `${interMonitorLeft}px` }}>
          <span className={styles.hideIcon} onClick={this.handleShowInterMonitor}>
            {interMonitorLeft > 0 ? <Icon type="backward" /> : <Icon type="forward" />}
          </span>
          <div className={styles.title}>勤务路线查询</div>
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
          <div className={styles.OptimizingBtns}><span>优化控制管理</span></div>
          <div className={styles.addtask}>
            <span onClick={this.quicklySecretTask}>快速特勤任务</span>
          </div>
          <div className={styles.treeBox}>
            {/* <CustomTree visibleShowLeft={this.visibleShowLeft} vipRouteList={vipRouteList} getChildInfo={this.getChildInfo} hanleSelectInter={this.hanleSelectInter} /> */}
            {/* <CustomInterTree
              {...this.props}
              getSelectTreeId={this.getSelectTreeId}
              getSelectChildId={this.getSelectChildId}
              visibleShowLeft={this.visibleShowLeft}
            /> */}
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
                <li onClick={() => { this.lookRoadLine(vipId) }}>编辑</li>
                <li onClick={() => { this.delRoadLine(vipId) }}>删除</li>
              </ul> : null
          }
        </div>
        {!!secretTaskTop ?
          <div className={styles.MaskBox}>
            <div className={styles.secretTaskBox}>
              <div className={styles.title}>特勤任务 <Icon className={styles.Close} type='close' onClick={() => {this.handleClose(false)}} /></div>
              <div className={styles.secretTaskCon}>
                <div className={styles.conTop}>
                  <div className={styles.formBox}><span>勤务名称：</span><Input style={{width: '100px'}} value={secretTaskName} onChange={(e) => {this.handleChange(e, 'secretTaskName')}} placeholder="请输入勤务名称" /></div>
                  <div className={styles.formBox}><span>备注描述：</span><Input onChange={this.changeRegion} value={secretTaskDetail} onChange={(e) => {this.handleChange(e, 'secretTaskDetail')}} placeholder="请输入备注描述" /></div>
                  <div className={styles.formBox} style={{flex:0.05}}></div>
                  {/* <div className={styles.formBox}><span>计划时间：</span>
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      value={startValue}
                      placeholder="开始时间"
                      onChange={this.onStartChange}
                      onOpenChange={this.handleStartOpenChange}
                    />
                    <span style={{margin:'0 5px'}}>-</span>
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      value={endValue}
                      placeholder="结束时间"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />
                  </div> */}
                </div>
                <div className={styles.conLeft}>
                  <div className={styles.titleSmall}>勤务路口<em onClick={this.getAddUnitsIfram}>添加路口</em></div>
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
                <div className={styles.conRight}>
                  <div className={styles.titleSmall}>勤务路线<em>一键勤务</em><em className={styles.saveLine} onClick={() => {this.getSaveVipRoad(vipId, secretTaskName, secretTaskDetail)}}>保存路线</em></div>
                  <div className={styles.itemTit}>勤务路线路口列表</div>
                  <div className={styles.itemCon}>
                    <div className={classNames(styles.listItem, styles.listTit)}>
                      <s>序号</s>
                      <s>路口名称</s>
                      <s>勤务阶段</s>
                      <s>勤务状态</s>
                      <s>操作</s>
                    </div>
                    <div className={styles.conRightBox}>
                      {
                        secretTaskRight && secretTaskRight.map((item, index) => {
                          return (
                            <div key={'sRight'+index} className={styles.listItem}>
                              <s>{index+1}</s>
                              <s><img src={this.imgInfoUrl + item.STAGE_IMAGE} />{item.UNIT_NAME}</s>
                              <s>{item.STAGENAME}</s>
                              <s>{item.CODE_NAME}</s>
                              <s>{item.STAGENO === 1 ? <span>锁定</span> : <span>取消</span>}</s>
                            </div>
                          )
                        })
                      }
                      {!secretTaskRight && <div className={styles.PanelItemNone}>暂无数据</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : null
        }
        {
          roadCrossingFlag ?
          <div className={styles.MaskBox}>
            <div className={styles.roadCrossing}>
              <div className={styles.titleSmall}>添加路口 <Icon className={styles.Close} type='close' onClick={() => {this.handleClose(false, 'roadCrossingFlag')}} /></div>
              <div className={styles.crossingCon}>
                <div className={styles.searchBox}>
                  <input
                        className={styles.searchInput}
                        onClick={this.handleSearchInterFocuss}
                        onChange={this.handleSearchInputChanges}
                        type="text"
                        placeholder="请输入你要搜索的路口"
                        ref={(input) => { this.searchInputBox = input }}
                        style={{ width: '100%' }}
                      />
                  </div>
                  <div className={styles.interList} style={{ maxHeight: `${interListHeights}px`, overflowY: 'auto' }}>
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
                            onClick={this.hanleSelectInters}
                          >{item.UNIT_NAME}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div className={styles.btnRoadCrossing} onClick={() => {this.AddUnitsIframBtn(vipId, unitId)}}>确认添加</div>
                </div>
            </div>
          </div> : null
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    data: { ...state.data, ...state.secretTask },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getInterList: bindActionCreators(getInterList, dispatch),
    getBasicInterInfo: bindActionCreators(getBasicInterInfo, dispatch),
    getVipRoute: bindActionCreators(getVipRoute, dispatch),
    getVipRouteChild: bindActionCreators(getVipRouteChild, dispatch),
    getLoadPlanTree: bindActionCreators(getLoadPlanTree, dispatch),
    getLoadChildTree: bindActionCreators(getLoadChildTree, dispatch),
    getAddUnitsIfram: bindActionCreators(getAddUnitsIfram, dispatch),
    getDeleteUnitFram: bindActionCreators(getDeleteUnitFram, dispatch),
    getDeleteVipRoad: bindActionCreators(getDeleteVipRoad, dispatch),
    getFindRoadByVipId: bindActionCreators(getFindRoadByVipId, dispatch),
    getFindList: bindActionCreators(getFindList, dispatch),
    getInitRoad: bindActionCreators(getInitRoad, dispatch),
    getLoadUnitStage: bindActionCreators(getLoadUnitStage, dispatch),
    getSaveVipRoad: bindActionCreators(getSaveVipRoad, dispatch),
    getSaveUnitRunStage: bindActionCreators(getSaveUnitRunStage, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SecretTask)
