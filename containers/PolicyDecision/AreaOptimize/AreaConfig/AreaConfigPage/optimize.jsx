import React from 'react'
import $ from 'jquery'
import { Icon, Select, DatePicker } from 'antd'
import './optimize.css'

import requestBaseUrl from '../../../../../utils/getRequestBaseUrl'
import GreenWaveCharts from '../../../../../components/GreenWaveCharts/GreenWaveCharts'
import RoadCharts from './trankLineCharts'


const { Option } = Select

class OptimizeArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rdchlList: null,
      firstRdchl: null,
      doeDateList: null,
      greenWaveDateList: null,
      timeList: null,
      planSetList: null,
      firstGreenWave: null,
      firstDoeData: null,
      firstTime: null,
      firstPlan: null,
      showGreenWave: true,
      showForwordWave: true,
      showReverseWave: false,
      showControlRecord: false,
    }
    this.colorAry = ['#55adff ', '#c9c9c9', '#c88c75', '#ffb4b4 ', ' #00c3c1 ', '#fbffb4 ', ' #63eeff', '#ffa5fe ', '#c8cc52', ' #ff719c']
    this.optSelectUrl = `${requestBaseUrl}/dws/evlregionOpt/getEvlregionOptSetSelect`
    this.optDataUrl = `${requestBaseUrl}/dws/evlregionOpt/getRdchlOptData`
    this.timeoffset = `${requestBaseUrl}/dws/evlregionOpt/getTimeoffset_d`
    this.typeoffset = `${requestBaseUrl}/dws/evlregionOpt/getTypeoffset_d`
    this.addOptPlanUrl = `${requestBaseUrl}/dws/evlregionOpt/addEvlregionOptPlan`
    this.delayDurUrl = `${requestBaseUrl}/dws/AreaOptimization/getSpeed_Delaydur`
    this.stopTimeUrl = `${requestBaseUrl}/dws/AreaOptimization/getStop_Time`
    this.planSelParams = {
      evlregion_id: 'LongQuanYuanJie',
      rdchl_id: 'LongQuanYuanJie_1',
      dir: '2',
    }
    this.interSignalParams = { inter_ids: '' }
    this.submitParams = {
      ctlregion_id: '',
      ctlregion_name: '',
      rdchl_id: '',
      offset_dt: '',
      plan_index: '',
      plan_name: '',
      doe_date_type: '',
      time: '',
      data: '',
    }
    this.optDataParams = {
      doeDate: '99',
      evlregion_id: 'LongQuanYuanJie',
      greenWaveDate: '2018-06-30',
      plan_index: '1',
      rdchl_id: 'LongQuanYuanJie_1',
      time: '16:30:00-19:30:00',
    }
    this.planSentParams = {
      'data.ctlregion_id': 'LongQuanYuanJie',
      'data.plan_index': 1,
      'data.rdchl_id': 'LongQuanYuanJie_1',
    }
    this.typeoffsetP = {
      dt: '',
    }
    this.timeoffsetP = {
      ctlregion_id: 'LongQuanYuanJie',
      doe_date_type: '',
      dt: '',
    }
  }
  componentDidMount = () => {
    this.getEvlregionOptSetSelect()
    this.getStopTime()
    this.getSpeedDelaydur()
  }
  getDoeDataLists = (firstDoe = '', fitstDoeType = '', timeFirst = '') => {
    $.ajax({
      url: this.typeoffset,
      type: 'post',
      data: this.typeoffsetP,
      success: (res) => {
        res = JSON.parse(res)
        if (res.code === '1') {
          this.setState({
            firstDoeData: firstDoe || res.data[0].doe_date_name,
            doeDateList: res.data,
          })
          this.submitParams.doe_date_type = fitstDoeType || res.data[0].doe_date_type
          this.optDataParams.doeDate = fitstDoeType || res.data[0].doe_date_type
          this.timeoffsetP.doe_date_type = fitstDoeType || res.data[0].doe_date_type
          $.ajax({
            url: this.timeoffset,
            type: 'post',
            data: this.timeoffsetP,
            success: (result) => {
              result = JSON.parse(result)
              if (result.code === '1') {
                this.setState({
                  timeList: result.data,
                  firstTime: timeFirst || result.data[0].time
                }, () => {
                  this.submitParams.time = this.state.firstTime
                  this.optDataParams.time = this.state.firstTime
                })
              }
            },
          })
        }
      },
    })
  }
  // 获取优化配置路口数据
  getRdchlOptData = () => {
    this.setState({ greenWaveData: null })
    $.ajax({
      url: this.optDataUrl,
      type: 'post',
      data: this.optDataParams,
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          const inters = result.data
          this.rdchlOptData = inters
          this.submitParams.data = JSON.stringify(this.rdchlOptData)
          const forwardOffset = inters[0].forward_offset
          const reverseOffset = inters[0].reverse_offset
          const forwardPhasePlanName = inters[0].forward_phase_plan_name
          const reversePhasePlanName = inters[0].reverse_phase_plan_name
          const phaseList = inters[0].phaseList
          const interIds = []
          let totleDistance = 0
          inters.forEach((item) => {
            totleDistance += item.len
            interIds.push(item.inter_id)
          })
          this.interSignalParams.inter_ids = interIds.join(',')
          this.setState({
            greenWaveData: inters,
            totleDistance,
            interDatas: inters[0],
            forwardOffset,
            reverseOffset,
            forwardPhasePlanName,
            reversePhasePlanName,
            forwordValue: forwardOffset !== '' ? forwardOffset : phaseList.length > 0 ? phaseList[0].offset : '',
            reverseValue: reverseOffset !== '' ? reverseOffset : phaseList.length > 0 ? phaseList[0].offset : '',
            forwordDiffer: forwardPhasePlanName !== '' ? forwardPhasePlanName : phaseList.length > 0 ? phaseList[0].phase_name : '',
            reverseDiffer: reversePhasePlanName !== '' ? reversePhasePlanName : phaseList.length > 0 ? phaseList[0].phase_name : '',
            areaInters: inters,
          })
        }
      }
    })
  }
  // 获取优化数据下拉列表
  getEvlregionOptSetSelect = () => {
    $.ajax({
      url: this.optSelectUrl,
      type: 'post',
      data: this.planSelParams,
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          const data = result.data
          const isPlan = data.planSetList.length > 0
          this.planSentParams['data.plan_index'] = isPlan ? data.planSetList[0].plan_index : ''
          this.optSelectData = data
          this.typeoffsetP.dt = isPlan ? data.planSetList[0].offset_dt : data.greenWaveDateList[0].dt
          this.timeoffsetP.dt = isPlan ? data.planSetList[0].offset_dt : data.greenWaveDateList[0].dt
          this.getDoeDataLists(isPlan ? data.planSetList[0].doe_date_name : '', isPlan ? data.planSetList[0].doe_date_type : '', isPlan ? data.planSetList[0].time : '')
          this.setState({
            // doeDateList: data.doeDateList,
            greenWaveDateList: data.greenWaveDateList,
            rdchlList: data.rdchlList,
            // timeList: data.timeList,
            planSetList: data.planSetList,
            firstRdchl: data.rdchlList[0].name,
            firstGreenWave: isPlan ? data.planSetList[0].offset_dt : data.greenWaveDateList[0].dt,
            // firstDoeData: isPlan ? data.planSetList[0].doe_date_name : data.doeDateList[0].doe_date_name,
            // firstTime: isPlan ? data.planSetList[0].time : data.timeList[0].time,
            firstPlan: isPlan ? data.planSetList[0].plan_name : '',
          }, () => {
            this.submitParams.plan_name = isPlan ? data.planSetList[0].plan_name : ''
            this.submitParams.plan_index = isPlan ? data.planSetList[0].plan_index : ''
            this.submitParams.offset_dt = this.state.firstGreenWave
            // this.submitParams.doe_date_type = isPlan ? data.planSetList[0].doe_date_type : data.doeDateList[0].doe_date_type
            // this.submitParams.time = this.state.firstTime
            // this.optDataParams.doeDate = isPlan ? data.planSetList[0].doe_date_type : data.doeDateList[0].doe_date_type
            this.optDataParams.greenWaveDate = this.state.firstGreenWave
            this.optDataParams.plan_index = isPlan ? data.planSetList[0].plan_index : ''
            // this.optDataParams.time = this.state.firstTime
            this.optDataParams.rdchl_id = data.rdchlList.length > 0 && data.rdchlList[0].rdchl_id
            console.log(this.submitParams)
            setTimeout(() => {
              this.getRdchlOptData()
            }, 500)
          })
        }
      },
    })
  }
  // 获取延误和速度
  getSpeedDelaydur = () => {
    $.ajax({
      url: this.delayDurUrl,
      type: 'post',
      data: this.planSelParams,
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          const forwordData = []
          const rewordData = []
          const Timeforword = new Array(result.xs.length).fill(0)
          const Timereword = new Array(result.xs.length).fill(0)
          const Stopforword = new Array(result.xs.length).fill(0)
          const Stopreword = new Array(result.xs.length).fill(0)
          if (result.data.length > 0) {
            result.data.forEach((item, index) => {
              if (item.dir === '0') {
                forwordData.push(item)
              } else {
                rewordData.push(item)
              }
            })
            forwordData.forEach((item, index) => {
              const _index = result.xs.indexOf(item.time)
              if (_index !== -1) {
                Timeforword.splice(_index, 1, item.Speed)
                Stopforword.splice(_index, 1, item.delay)
              }
            })
            rewordData.forEach((item, index) => {
              const _index = result.xs.indexOf(item.time)
              if (_index !== -1) {
                Timereword.splice(_index, 1, item.Speed)
                Stopreword.splice(_index, 1, item.delay)
              }
            })
            const timeDataObj = { '正向': Timeforword, '反向': Timereword }
            const stopDataObj = { '正向': Stopforword, '反向': Stopreword }
            const legend = []
            const Timeseries = []
            const Stopseries = []
            Object.keys(timeDataObj).forEach((item, index) => {
              legend.push(item)
              const obj = {}
              obj.name = item
              obj.type = 'line'
              obj.data = timeDataObj[item]
              obj.itemStyle = {
                normal: {
                  color: this.colorAry[index],
                }
              }
              Timeseries.push(obj)
            })
            Object.keys(stopDataObj).forEach((item, index) => {
              legend.push(item)
              const obj = {}
              obj.name = item
              obj.type = 'line'
              obj.data = stopDataObj[item]
              obj.itemStyle = {
                normal: {
                  color: this.colorAry[index],
                }
              }
              Stopseries.push(obj)
            })
            const SpeedChartsData = { legend, time: result.xs, series: Timeseries }
            const delayChartsData = { legend, time: result.xs, series: Stopseries }
            this.setState({
              SpeedChartsData,
              delayChartsData,
            })
          } else {
            const SpeedChartsData = { legend: [], time: [], series: [] }
            const delayChartsData = { legend: [], time: [], series: [] }
            this.setState({
              SpeedChartsData,
              delayChartsData,
            })
          }
        } else {
          const SpeedChartsData = { legend: [], time: [], series: [] }
          const delayChartsData = { legend: [], time: [], series: [] }
          this.setState({
            SpeedChartsData,
            delayChartsData,
          })
        }
      }
    })
  }
  // 获取停车和行程时间
  getStopTime = () => {
    $.ajax({
      url: this.stopTimeUrl,
      type: 'post',
      data: this.planSelParams,
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          const forwordData = []
          const rewordData = []
          const Timeforword = new Array(result.xs.length).fill(0)
          const Timereword = new Array(result.xs.length).fill(0)
          const Stopforword = new Array(result.xs.length).fill(0)
          const Stopreword = new Array(result.xs.length).fill(0)
          if (result.data.length > 0) {
            result.data.forEach((item, index) => {
              if (item.dir === '0') {
                forwordData.push(item)
              } else {
                rewordData.push(item)
              }
            })
            forwordData.forEach((item, index) => {
              const _index = result.xs.indexOf(item.time)
              if (_index !== -1) {
                Timeforword.splice(_index, 1, item.travelTime)
                Stopforword.splice(_index, 1, item.stopCar)
              }
            })
            rewordData.forEach((item, index) => {
              const _index = result.xs.indexOf(item.time)
              if (_index !== -1) {
                Timereword.splice(_index, 1, item.travelTime)
                Stopreword.splice(_index, 1, item.stopCar)
              }
            })
            const timeDataObj = { '正向': Timeforword, '反向': Timereword }
            const stopDataObj = { '正向': Stopforword, '反向': Stopreword }
            const legend = []
            const Timeseries = []
            const Stopseries = []
            Object.keys(timeDataObj).forEach((item, index) => {
              legend.push(item)
              const obj = {}
              obj.name = item
              obj.type = 'line'
              obj.data = timeDataObj[item]
              obj.itemStyle = {
                normal: {
                  color: this.colorAry[index],
                }
              }
              Timeseries.push(obj)
            })
            Object.keys(stopDataObj).forEach((item, index) => {
              legend.push(item)
              const obj = {}
              obj.name = item
              obj.type = 'line'
              obj.data = stopDataObj[item]
              obj.itemStyle = {
                normal: {
                  color: this.colorAry[index],
                }
              }
              Stopseries.push(obj)
            })
            const TimeChartsData = { legend, time: result.xs, series: Timeseries }
            const StopChartsData = { legend, time: result.xs, series: Stopseries }
            this.setState({
              TimeChartsData,
              StopChartsData,
            })
          } else {
            const TimeChartsData = { legend: [], time: [], series: [] }
            const StopChartsData = { legend: [], time: [], series: [] }
            this.setState({
              TimeChartsData,
              StopChartsData,
            })
          }
        } else {
          const TimeChartsData = { legend: [], time: [], series: [] }
          const StopChartsData = { legend: [], time: [], series: [] }
          this.setState({
            TimeChartsData,
            StopChartsData,
          })
        }
      }
    })
  }
  // 保存
  addOptPlan = () => {
    $.ajax({
      url: this.addOptPlanUrl,
      type: 'post',
      data: this.submitParams,
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          this.openNotification('保存成功！')
        } else {
          this.openNotification('保存失败！')
        }
      }
    })
  }
  // 优化数据下拉选择事件
  handleSearchItems = (value, options) => {
    const dataName = options.props.dataname
    const dataId = options.key
    this.optDataParams[dataName] = dataId
    if (dataName === 'doeDate') {
      this.setState({ firstDoeData: value })
      this.submitParams.doe_date_type = dataId
      this.timeoffsetP.doe_date_type = dataId
      $.ajax({
        url: this.timeoffset,
        type: 'post',
        data: this.timeoffsetP,
        success: (result) => {
          result = JSON.parse(result)
          if (result.code === '1') {
            this.setState({
              timeList: result.data,
              firstTime: result.data[0].time
            }, () => {
              this.submitParams.time = this.state.firstTime
              this.optDataParams.time = this.state.firstTime
            })
          }
        }
      })
    } else if (dataName === 'greenWaveDate') {
      this.setState({ firstGreenWave: value })
      this.submitParams.offset_dt = dataId
      this.optDataParams.greenWaveDate = dataId
      this.getDoeDataLists()
    } else if (dataName === 'rdchl_id') {
      this.isChangeRdchil = true
      this.setState({ firstRdchl: value })
      this.planSelParams.rdchl_id = dataId
      this.submitParams.rdchl_id = dataId
      this.optDataParams.rdchl_id = dataId
      this.getPlanSelect()
    } else if (dataName === 'time') {
      this.setState({ firstTime: value })
      this.submitParams.time = dataId
      this.optDataParams.time = dataId
    } else if (dataName === 'plan') {
      this.planSentParams['data.plan_index'] = this.state.firstPlan = dataId
      const planSet = this.state.planSetList.filter(item => item.plan_index === Number(dataId))
      const { doe_date_name, offset_dt, time, doe_date_type } = planSet[0]
      this.setState({
        firstPlan: value,
        firstDoeData: doe_date_name,
        firstGreenWave: offset_dt,
        firstTime: time,
      })
      this.submitParams.doe_date_type = doe_date_type
      this.submitParams.offset_dt = offset_dt
      this.submitParams.time = time
      this.submitParams.plan_index = dataId
      this.submitParams.plan_name = value
      this.optDataParams.doeDate = doe_date_type
      this.optDataParams.greenWaveDate = offset_dt
      this.optDataParams.time = time
      this.optDataParams.plan_index = dataId
      console.log(this.submitParams)
    }
  }
  // 优化配置选择路口
  handleAreaInterChange = (value, options) => {
    const interId = options.key
    const thisInter = this.state.areaInters.filter(item => item.inter_id === interId)
    const forwordValue = thisInter[0].forward_offset
    const reverseValue = thisInter[0].reverse_offset
    const forwardPhasePlanName = thisInter[0].forward_phase_plan_name
    const reversePhasePlanName = thisInter[0].reverse_phase_plan_name
    const phaseList = thisInter[0].phaseList
    this.setState({
      interDatas: thisInter[0],
      forwordValue: forwordValue !== '' ? forwordValue : phaseList.length > 0 ? phaseList[0].offset : '',
      reverseValue: reverseValue !== '' ? reverseValue : phaseList.length > 0 ? phaseList[0].offset : '',
      forwordDiffer: forwardPhasePlanName !== '' ? forwardPhasePlanName : phaseList.length > 0 ? phaseList[0].phase_name : '',
      reverseDiffer: reversePhasePlanName !== '' ? reversePhasePlanName : phaseList.length > 0 ? phaseList[0].phase_name : '',
    })
  }
  // 正反向速度修改
  handleSpeedChange = (e) => {
    if (this.speedTimer) {
      clearTimeout(this.speedTimer)
      this.speedTimer = null
    }
    const inputEle = e.target
    const interId = inputEle.getAttribute('interid')
    const direction = inputEle.getAttribute('direction')
    const value = inputEle.value
    const interData = this.rdchlOptData.filter(item => item.inter_id === interId)
    const _interData = this.state.greenWaveData.filter(item => item.inter_id === interId)
    interData[0][direction] = value
    _interData[0][direction] = value
    this.submitParams.data = JSON.stringify(this.rdchlOptData)
    this.speedTimer = setTimeout(() => {
      this.setState({ greenWaveData: this.state.greenWaveData })
    }, 2000)
  }
  // 查询绿波数据
  handleSearchGreenWave = () => {
    if (this.realTimer) {
      clearInterval(this.realTimer)
      this.realTimer = null
    }
    this.setState({
      showGreenWave: true,
      isBlock: 'none',
    }, () => {
      this.getRdchlOptData()
    })
  }
  // 修改执行时间
  handleActionTime = (moment, value, type, id) => {
    const interData = this.rdchlOptData.filter(item => item.inter_id === id)
    interData[type] = value
    this.submitParams.data = JSON.stringify(this.rdchlOptData)
  }
  // 修改相位差
  handlePhaseDifferChange = (e, direction) => {
    if (this.phaseDifferTimer) {
      clearTimeout(this.phaseDifferTimer)
      this.phaseDifferTimer = null
    }
    const inputEle = e.target
    const interId = inputEle.getAttribute('interid')
    const phaseName = inputEle.getAttribute('phasename')
    const interData = this.rdchlOptData.filter(item => item.inter_id === interId)
    if (direction === 'forword') {
      this.setState({ forwordValue: inputEle.value })
      interData[0].forward_offset = inputEle.value
      interData[0].reverse_offset = inputEle.value
    } else {
      interData[0].reverse_offset = inputEle.value
    }
    this.phaseDifferTimer = setTimeout(() => {
      this.submitParams.data = JSON.stringify(this.rdchlOptData)
      this.setState({ greenWaveData: this.state.greenWaveData })
    }, 1800)
  }
  // 修改相位
  handlePhaseNameChange = (value, options, direction) => {
    const interId = options.props.interid
    const phaseId = options.props.phaseid
    const interData = this.rdchlOptData.filter(item => item.inter_id === interId)
    if (direction === 'forword') {
      this.setState({ forwordDiffer: value, reverseDiffer: value })
      interData[0].forward_phase_plan_name = value
      interData[0].forward_phase_plan_id = phaseId
      interData[0].reverse_phase_plan_name = value
      interData[0].reverse_phase_plan_id = phaseId
    } else {
      this.setState({ reverseDiffer: value })
      interData[0].reverse_phase_plan_name = value
      interData[0].reverse_phase_plan_id = phaseId
    }
    this.submitParams.data = JSON.stringify(this.rdchlOptData)
    this.setState({ greenWaveData: this.state.greenWaveData })
  }
  handleShowControlRecord = () => {
    this.props.showControlRecord()
  }
  handleForwordWave = () => {
    this.setState({ showForwordWave: !this.state.showForwordWave })
  }
  handleReverseWave = () => {
    this.setState({ showReverseWave: !this.state.showReverseWave })
  }
  render() {
    console.log(this.state.greenWaveData, this.state.totleDistance, this.state.showForwordWave, this.state.showReverseWave, '123456789')
    return (
      <div className="optimization_box">
        <div className="optimizationFlex">
          <div className="configure_left">
            <div className="searchItems">
              <span>干线 </span>
              {
                this.state.rdchlList &&
                <Select value={this.state.firstRdchl} onChange={this.handleSearchItems}>
                  {
                    this.state.rdchlList.map((item, index) => {
                      return (
                        <Option value={item.name} dataname="rdchl_id" key={item.rdchl_id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              }
              <span>优化方案 </span>
              {
                this.state.planSetList &&
                <Select value={this.state.firstPlan} onChange={this.handleSearchItems}>
                  {
                    this.state.planSetList.map((item, index) => {
                      return (
                        <Option value={item.plan_name} dataname="plan" key={item.plan_index}>{item.plan_name}</Option>
                      )
                    })
                  }
                </Select>
              }
              <span>时间段 </span>
              {
                this.state.firstTime &&
                <Select value={this.state.firstTime} onChange={this.handleSearchItems}>
                  {
                    this.state.timeList.map((item, index) => {
                      return (
                        <Option value={item.time} dataname="time" key={item.time}>{item.time}</Option>
                      )
                    })
                  }
                </Select>
              }
              <span>绿波时间 </span>
              {
                this.state.greenWaveDateList &&
                <Select value={this.state.firstGreenWave} onChange={this.handleSearchItems}>
                  {
                    this.state.greenWaveDateList.map((item, index) => {
                      return (
                        <Option value={item.dt} dataname="greenWaveDate" key={item.dt}>{item.dt}</Option>
                      )
                    })
                  }
                </Select>
              }
              <span>工作类型 </span>
              {
                this.state.doeDateList &&
                <Select value={this.state.firstDoeData} onChange={this.handleSearchItems}>
                  {
                    this.state.doeDateList.map((item, index) => {
                      return (
                        <Option value={item.doe_date_name} dataname="doeDate" key={item.doe_date_type}>{item.doe_date_name}</Option>
                      )
                    })
                  }
                </Select>
              }
              <span>优化目标 </span>
              <Select value="全向带宽最大">
                <Option value="全向带宽最大" key="全向带宽最大">全向带宽最大</Option>
              </Select>
              <span className="searchBtn" onClick={this.handleSearchGreenWave}>查询</span>
              {/* <span className="openDetectionBtn" onClick={this.handleRealTimeDetection}>开启实时干线检测</span> */}
            </div>
            <div className="greenWaveItems">
              <div className="itemsBox"><span className="itemsIcon white"></span>主协调时长</div>
              <div className="itemsBox"><span className="itemsIcon red"></span>红灯时长</div>
              <div className="itemsBox" style={{ cursor: 'pointer', opacity: this.state.showForwordWave ? 1 : .4 }} onClick={this.handleForwordWave}>
                <span className="itemsIcon greenF"></span>正向绿波
              </div>
              <div className="itemsBox" style={{ cursor: 'pointer', opacity: this.state.showReverseWave ? 1 : .4 }} onClick={this.handleReverseWave}>
                <span className="itemsIcon greenR"></span>反向绿波
              </div>
            </div>
            <div style={{ width: '100%', height: '403px', backgroundColor: '#1f2c3d' }}>
              <div style={{ width: '1000px', height: '400px', padding: '15px 0 40px 0', margin: '0 auto' }}>
                {
                  this.state.greenWaveData && this.state.showGreenWave ?
                    <GreenWaveCharts
                      chartsData={this.state.greenWaveData}
                      totleDistance={this.state.totleDistance}
                      showForwordWave={this.state.showForwordWave}
                      showReverseWave={this.state.showReverseWave}
                      key={this.state.totleDistance + this.state.showForwordWave}
                    /> : null
                }
              </div>
            </div>
          </div>
          <div className="configure_right" style={{ position: 'relative', padding: '10px' }}>
            <div style={{ zIndex: 2, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: this.state.isBlock, backgroundColor: 'rgba(0,0,0, .3)' }} />
            {
              this.state.interDatas &&
              <div>
                <div className="interSpeed">
                  <div className="areaInter">
                    <span>区域路口</span>
                    {
                      this.state.areaInters &&
                      <Select defaultValue={this.state.interDatas.inter_name} onChange={this.handleAreaInterChange} key={this.state.interDatas.inter_name}>
                        {
                          this.state.areaInters.map((item, index) => {
                            return (
                              <Option value={item.inter_name} key={item.inter_id}>{item.inter_name}</Option>
                            )
                          })
                        }
                      </Select>
                    }
                  </div>
                  <div className="speedBox">
                    <div>正向通行速度</div>
                    <div className="speed">
                      <input
                        key={this.state.interDatas.inter_id + this.state.interDatas.forwordSpeed}
                        type="text"
                        interid={this.state.interDatas.inter_id}
                        direction="forwordSpeed"
                        defaultValue={this.state.interDatas.forwordSpeed}
                        onChange={(e) => { this.handleSpeedChange(e) }}
                      />
                      <span className="unit">千米/小时</span>
                    </div>
                  </div>
                  <div className="speedBox">
                    <div>反向通行速度</div>
                    <div className="speed">
                      <input
                        key={this.state.interDatas.inter_id + this.state.interDatas.reverseSpeed}
                        type="text"
                        interid={this.state.interDatas.inter_id}
                        direction="reverseSpeed"
                        defaultValue={this.state.interDatas.reverseSpeed}
                        onChange={(e) => { this.handleSpeedChange(e) }}
                      />
                      <span className="unit">千米/小时</span>
                    </div>
                  </div>
                </div>
                <div style={{ paddingBottom: '15px', borderBottom: '1px solid #4c5366' }}>
                  <div className="optBox">
                    <div className="left">
                      <div className="top">相位</div>
                      <div className="bottom">相位时间(秒)</div>
                    </div>
                    <div className="center">
                      {
                        this.state.interDatas.phaseList.map((item, index) => {
                          return (
                            <div className="centerBox" key={item.phase_name}>
                              <div className="top">{item.phase_name}</div>
                              <div className="bottom">
                                {/*<div className="editDiv" contentEditable={this.state.contentEdit} suppressContentEditableWarning={true} dataname={item.name} datavalue={item.value} onKeyUp={(e) => {this.handleKeyDown(e)}}>{item.value}</div>*/}
                                <input type="text" dataname={item.phase_name} key={item.phase_name + item.split_time} defaultValue={item.split_time} readOnly />
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="left">
                      <div className="top">周期</div>
                      <div className="bottom">{this.state.interDatas.phaseList.length > 0 ? this.state.interDatas.phaseList[0].cycle_time : ''}</div>
                    </div>
                  </div>
                </div>
                <div className="phaseDif">
                  {/* <div className="phasebox"> */}
                  <div className="phaseDirective" style={{ flex: 1 }}>
                    <span className="textBox">正向主协调相位</span>
                    <Select
                      key={this.state.interDatas.inter_id + this.state.forwordDiffer}
                      defaultValue={this.state.forwordDiffer}
                      onChange={(value, options) => { this.handlePhaseNameChange(value, options, 'forword') }}
                    >
                      {
                        this.state.interDatas.phaseList.map((item, index) => {
                          return (
                            <Option value={item.phase_name} key={item.phase_name + this.state.interDatas.inter_id} phaseid={item.phase_plan_id} interid={this.state.interDatas.inter_id}>{item.phase_name}</Option>
                          )
                        })
                      }
                    </Select>
                  </div>
                  <div className="phasegap" style={{ flex: 1 }}>
                    <span className="textBox">相位差</span>&nbsp;
                    <input
                      key={this.state.forwordValue + this.state.interDatas.inter_id}
                      type="text"
                      interid={this.state.interDatas.inter_id}
                      phasename={this.state.forwordDiffer}
                      defaultValue={this.state.forwordValue}
                      onChange={(e) => { this.handlePhaseDifferChange(e, 'forword') }}
                    />
                  </div>
                </div>
                <div className="timeSelectBox">
                  <div className="timeFrame">
                    <div className="timeBox">
                      <div className="textname">子区ID</div>
                      <div className="textTimeBox"><span className="textTime" title={this.props.ctrlregionId}>{this.props.ctrlregionId}</span></div>
                    </div>
                    <div className="timeBox">
                      <div className="textname">方案时间段</div>
                      <div className="textTimeBox"><span className="textTime" title={this.state.firstTime}>{this.state.firstTime}</span></div>
                    </div>
                    <div className="timeBox">
                      <div className="textname">执行日期</div>
                      <div className="textTimeBox"><span className="textTime" title={this.state.firstDoeData}>{this.state.firstDoeData}</span></div>
                    </div>
                  </div>
                  <div className="timeSelect"></div>
                </div>
                <div className="executionTime">
                  <span>执行开始时间</span><DatePicker onChange={(moment, value) => { this.handleActionTime(moment, value, 'execute_start_date', this.state.interDatas.inter_id) }} />
                  <span>执行结束时间</span><DatePicker onChange={(moment, value) => { this.handleActionTime(moment, value, 'execute_end_date', this.state.interDatas.inter_id) }} />
                </div>
                <div className="activeBtns">
                  <div className="btnBox" onClick={this.handleShowControlRecord}>下发方案管理</div>
                  <div className="btnBox" onClick={this.handleSubIntervalPlanSent}>子区方案下发</div>
                  <div className="btnBox" onClick={this.addOptPlan}>保存</div>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="rdchlChartsBox scrollBox">
          <div className="chartsBoxItems">
            <div className="chartsWrapper">
              {
                !!this.state.SpeedChartsData &&
                <RoadCharts chartsData={this.state.SpeedChartsData} title="干线平均速度曲线图" key="干线平均速度曲线图" />
              }
            </div>
            <div className="chartsWrapper">
              {
                !!this.state.delayChartsData &&
                <RoadCharts chartsData={this.state.delayChartsData} title="干线平均延误曲线图" key="干线平均延误曲线图" />
              }
            </div>
          </div>
          <div className="chartsBoxItems">
            <div className="chartsWrapper">
              {
                !!this.state.StopChartsData &&
                <RoadCharts chartsData={this.state.StopChartsData} title="干线平均停车次数曲线图" key="干线平均停车次数曲线图" />
              }
            </div>
            <div className="chartsWrapper">
              {
                !!this.state.TimeChartsData &&
                <RoadCharts chartsData={this.state.TimeChartsData} title="干线行程时间曲线图" key="干线行程时间曲线图" />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OptimizeArea
