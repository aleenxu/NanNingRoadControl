import React, { Component } from 'react'
import { Pagination, Button, Input, Icon, Select, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './AlarmMonitoring.scss'
// import Nav from '../Header/Nav/Nav'
import { getLoadPlanTree, getInterList } from '../../../actions/data'
import { gettimgetTimingInfo, gettimcode, gettimingInfoByExcel, getlcflgss, gettimvalidate, gettimsaveOrUpdateForm } from '../../../actions/management'

class AlarmMonitoring extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MaintenanceUnitList: [], // 所属区域
      roadList: [], // 所属路口
      TimingList: [], // 配时列表信息
      pageNumber: {}, // 展示应有的数据
      codeList: [], // 信号机品牌列表
      nums: '',
      showEditTiming: false, // 是否展示申请方案弹窗
      planStageList: [],
      editStageSelect: false,
      editPlanStageList: [],
      stageRadioIndex: 0,
      cycleLength: 0, // 周期长度
    }
    this.changeFontValue = '' // 改变关键字
    this.changeRegionValue = 0 // 改变所属区域
    this.changeIntctionValue = 0 // 改变路口口内容
    this.changeSignalValue = 0 // 改变信号控制系统
    this.planStageList = []
    this.stageTimes = []
    this.page = 1
    this.pageSizes = 15
    this.saveParams = {
      confirmId: 'add', // 修改还是增加
      coordphaseno: '', // 协调相位号
      cyclelen: 0, // 周期长
      endTime: '',
      extension_no: '',
      numImgThing: '', // 多个阶段图
      numThing: '', // 多个时间字符串
      offset: '', // 相位差
      planname: '', // 方案名称
      planno: '', // 方案编号
      primaryUnitId: '', // 路口ID
      runTime: '',
      stageStr: '', // 多个阶段字符串
      startTime: '',
      structure_no: '',
      transition_no: '',
    }
    this.coordinatedPhase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  }
  componentDidMount() {
    this.props.getLoadPlanTree()
    this.props.getInterList()
    this.props.gettimcode()
    this.props.gettimgetTimingInfo(`curPage=1&districtId=0&keyword=${this.changeFontValue}&pageSize=15&signalType=0&unitId=0`)
  }
  componentDidUpdate(prevState) {
    const { loadPlanTree, interList, getTimingInfo, code, getTimingInfoByExcel, cfgImgs } = this.props.data
    if (prevState.data.loadPlanTree !== loadPlanTree) {
      this.getPlanTree(loadPlanTree)
    }
    if (prevState.data.interList !== interList) {
      this.getinterList(interList)
    }
    if (prevState.data.getTimingInfo !== getTimingInfo) {
      this.getTimingInfo(getTimingInfo)
    }
    if (prevState.data.code !== code) {
      this.getcode(code)
    }
    if (prevState.data.getTimingInfoByExcel !== getTimingInfoByExcel) {
      this.getTimingInfoByExcels(getTimingInfoByExcel)
    }
    if (prevState.data.cfgImgs !== cfgImgs) {
      this.getcfgImgs(cfgImgs)
    }
  }
  getcfgImgs = (cfgImgs) => {
    this.setState({
      editPlanStageList: cfgImgs,
    }, () => {
      this.radioStageCheck = []
      const obj = cfgImgs[0]
      this.radioStageCheck.push(obj)
      this.setState({ stageRadioIndex: 0 })
    })
  }
  getPlanTree = (loadPlanTree) => {
    this.setState({
      MaintenanceUnitList: loadPlanTree,
    })
  }
  getinterList = (interList) => {
    this.setState({
      roadList: interList,
    })
  }
  getTimingInfo = (getTimingInfo) => {
    this.setState({
      TimingList: getTimingInfo.list,
      pageNumber: getTimingInfo.page,
    }, () => {
      this.setState({
        nums: 1,
      })
    })
  }
  getcode = (code) => {
    this.setState({
      codeList: code,
    })
  }
  getTimingInfoByExcels = (getTimingInfoByExcel) => {
    const blob = new Blob([getTimingInfoByExcel], { type: 'application/vnd.ms-excel,charset=utf-8' })
    const a = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    a.href = href
    document.body.appendChild(a)
    // a.click()
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    document.body.removeChild(a)
    window.URL.revokeObjectURL(href)
  }
  // 改变关键字内容
  changeFont = (e) => {
    const values = e.target.value
    this.changeFontValue = values
  }
  // 改变所属区域内容]
  changeRegion = (ID) => {
    this.changeRegionValue = ID
  }
  // 改变路口内容
  changeIntersection = (ID) => {
    this.changeIntctionValue = ID
  }
  // 改变信号机控制系统内容
  changeSignal = (ID) => {
    this.changeSignalValue = ID
  }
  // 点击查询
  btnSearth = () => {
    const { pageNumber } = this.state
    this.props.gettimgetTimingInfo(`curPage=${pageNumber.fromPage}&districtId=${this.changeRegionValue}&keyword=${this.changeFontValue}&pageSize=${pageNumber.pageSize}&signalType=${this.changeSignalValue}&unitId=${this.changeIntctionValue}`)
  }
  // 点击分页器
  pageChange = (page, pageSize) => {
    this.page = page
    this.pageSizes = pageSize
    this.props.gettimgetTimingInfo(`curPage=${page}&districtId=${this.changeRegionValue}&keyword=${this.changeFontValue}&pageSize=${pageSize}&signalType=${this.changeSignalValue}&unitId=${this.changeIntctionValue}`)
  }
  pageSize = (page, pageSize) => {
    this.page = page
    this.pageSizes = pageSize
    this.props.gettimgetTimingInfo(`curPage=${page}&districtId=${this.changeRegionValue}&keyword=${this.changeFontValue}&pageSize=${pageSize}&signalType=${this.changeSignalValue}&unitId=${this.changeIntctionValue}`)
  }
  selectListroad = (id) => { // 申请方案弹窗
    // this.ids = id
    // this.setState({
    //   showEditTiming: true,
    // })
  }
  crossingSee = (id) => { // 页面跳转到页面监视页面
    // window.open(`/interdetails?interid=${id}`)
  }
  // 协调相位号
  changecoordinated = (id) => {
    this.saveParams.coordphaseno = id
  }
  exportTable = () => {
    const str = `districtId=${this.changeRegionValue}&keyword=${this.changeFontValue}&signalType=${this.changeSignalValue}&unitId=${this.changeIntctionValue}`
    this.props.gettimingInfoByExcel(str)
  }
  handleCloseEdit = () => {
    this.saveParams = {
      confirmId: 'add', // 修改还是增加
      coordphaseno: '', // 协调相位号
      cyclelen: '', // 周期长
      endTime: '',
      extension_no: '',
      numImgThing: '', // 多个阶段图
      numThing: '', // 多个时间字符串
      offset: '', // 相位差
      planname: '', // 方案名称
      planno: '', // 方案编号
      primaryUnitId: '', // 路口ID
      runTime: '',
      stageStr: '', // 多个阶段字符串
      startTime: '',
      structure_no: '',
      transition_no: '',
    }
    this.radioStageCheck = []
    this.planStageList = []
    this.setState({
      showEditTiming: false,
      editStageSelect: false,
      planStageList: [],
      cycleLength: 0,
    })
  }
  handleEditChange = (e) => {
    const paramsName = e.target.getAttribute('pname')
    this.saveParams[paramsName] = e.target.value
  }
  handleStageTimeChange = (e, indexs) => {
    this.stageTimes[indexs] = e.target.value
  }
  handleStageTimeBlur = () => {
    let nums = 0
    this.stageTimes.forEach((item) => { nums += Number(item) })
    this.saveParams.cyclelen = nums
    this.setState({
      cycleLength: nums,
    })
  }
  handleAddStage = () => {
    this.saveParams.primaryUnitId = this.ids
    this.setState({
      editStageSelect: true,
    }, () => {
      this.props.getlcflgss(this.ids)
    })
  }
  SaveValidation = () => {
    if (!this.saveParams.planno) {
      return message.info('请输入方案编号')
    }
    if (!this.saveParams.planname) {
      return message.info('请输入方案名称')
    }
    if (!this.saveParams.coordphaseno) {
      return message.info('请输入协调相位号')
    }
    if (!this.saveParams.offset) {
      return message.info('请输入协调相位差')
    }
    if (!this.state.planStageList.length) {
      return message.info('请选择关联阶段')
    }
  }
  handleSaveTimingPlan = async () => {
    const isSuccess = await this.SaveValidation()
    if (!isSuccess) {
      this.saveParams.numThing = this.stageTimes.join(',')
      this.saveParams.numImgThing = this.numImgThings.join(',')
      this.saveParams.stageStr = this.stageNos.join(',')
      this.saveParams.cyclelen = this.saveParams.cyclelen.toString()
      this.saveParams.coordphaseno = this.saveParams.coordphaseno.toString()
      if (this.messageSave) {
        this.props.gettimsaveOrUpdateForm(this.saveParams).then((res) => {
          if (res.data.code === 200) {
            this.radioStageCheck = []
            this.planStageList = []
            this.props.gettimgetTimingInfo(`curPage=${this.page}&districtId=${this.changeRegionValue}&keyword=${this.changeFontValue}&pageSize=${this.pageSizes}&signalType=${this.changeSignalValue}&unitId=${this.changeIntctionValue}`)
            this.saveParams = {
              confirmId: 'add', // 修改还是增加
              coordphaseno: '', // 协调相位号
              cyclelen: '', // 周期长
              endTime: '',
              extension_no: '',
              numImgThing: '', // 多个阶段图
              numThing: '', // 多个时间字符串
              offset: '', // 相位差
              planname: '', // 方案名称
              planno: '', // 方案编号
              primaryUnitId: '', // 路口ID
              runTime: '',
              stageStr: '', // 多个阶段字符串
              startTime: '',
              structure_no: '',
              transition_no: '',
            }
            this.setState({
              showEditTiming: false,
              editStageSelect: false,
              planStageList: [],
              cycleLength: 0,
            }, () => {
              message.info(res.data.message)
            })
          }
        })
      } else {
        message.info('该ID已经存在')
      }
    }
  }
  handleDeleteStage = () => {
    if (this.planStageList && this.planStageList.length > 0) {
      this.planStageList.pop()
      this.setState({ planStageList: this.planStageList }, () => {
        this.stageNos = this.state.planStageList.map(item => item.STAGENO)
        this.stageTimes = this.state.planStageList.map(item => item.GREEN)
        this.numImgThings = this.state.planStageList.map(item => item.STAGE_IMAGE)
      })
    } else {
      message.info('请至少保留一个关联阶段')
    }
  }
  handleAddStageCheck = () => {
    this.planStageList = [...this.planStageList, ...this.radioStageCheck]
    this.setState({
      planStageList: this.planStageList,
      editStageSelect: false,
    }, () => {
      this.stageNos = this.state.planStageList.map(item => item.STAGENO)
      this.stageTimes = this.state.planStageList.map(item => item.GREEN)
      this.numImgThings = this.state.planStageList.map(item => item.STAGE_IMAGE)
    })
  }
  handleCancelStage = () => {
    this.setState({ editStageSelect: false })
  }
  handleRadioStageCheck = (index, stage) => {
    this.radioStageCheck = []
    this.radioStageCheck.push(stage)
    this.setState({ stageRadioIndex: index })
  }
  numberBlur = () => {
    this.props.gettimvalidate(`${this.ids}/${this.saveParams.planno}`).then((res) => {
      if (res.data.data) {
        message.info('该ID已经存在')
        this.messageSave = false // 有相同id不让提交
      } else {
        this.messageSave = true
      }
    })
  }
  render() {
    const { Option } = Select
    const { MaintenanceUnitList, roadList, TimingList, pageNumber, codeList,
      showEditTiming, planStageList, editStageSelect, editPlanStageList, stageRadioIndex, cycleLength,
    } = this.state
    return (
      <div className={styles.timingWrapper}>
        {/* <Nav {...this.props} /> */}
        <div className={styles.timingcontainer}>
          <h3>配时管理</h3>
          <div className={styles.searchBox}>
            <div><span>关键字</span><Input onChange={this.changeFont} placeholder="" /></div>
            <div><span>所属区域</span>
              <Select
                onChange={this.changeRegion}
              >
                <Option value={0} key="124ssswwwa">全部</Option>
                {
                  MaintenanceUnitList && MaintenanceUnitList.map(item =>
                    <Option value={item.ID} key={item.ID}>{item.NAME}</Option>)}
              </Select>
              {/* <Input onChange={this.changeRegion} placeholder="" /> */}
            </div>
            <div>
              <span>所属路口</span>
              <Select
                onChange={this.changeIntersection}
              >
                <Option value={0} key="124ssswwwas">全部</Option>
                {
                  roadList && roadList.map(item =>
                    <Option value={item.ID} key={item.ID}>{item.UNIT_NAME}</Option>)}
              </Select>
            </div>
            <div>
              <span>信号机控制系统</span>
              <Select
                onChange={this.changeSignal}
              >
                <Option value={0} key="124ssswwwad">全部</Option>
                {
                  codeList && codeList.map(item =>
                    <Option value={item.C_CODE} key={item.C_CODE}>{item.CODE_NAME}</Option>)}
              </Select>
            </div>
            <div>
              <span>设备类型</span>
              <Select
                onChange={this.changeIntersection}
              >
                <Option value={0} key="124ssswwwas">全部</Option>
                {
                  roadList && roadList.map(item =>
                    <Option value={item.ID} key={item.ID}>{item.UNIT_NAME}</Option>)}
              </Select>
            </div>
            <div />
          </div>
          <div className={styles.goExcal}>
            <span>统计结果</span>
            
            <div className={styles.spansBo}>
              <span className={styles.spans} onClick={this.btnSearth}>查询</span>
              <span className={styles.spans} onClick={this.exportTable}>导出表格</span>
            </div>
          </div>
          <div className={styles.mountingManage}>
            <div className={styles.mountingTable}>
              <div className={styles.mountingThead}>
                <div className={styles.mountingTh} />
                <div className={styles.mountingTh}>路口名称</div>
                <div className={styles.mountingTh}>所属区域</div>
                <div className={styles.mountingTh}>信号控制系统</div>
                <div className={styles.mountingTh}>方案数</div>
                <div className={styles.mountingTh}>当前方案</div>
                <div className={styles.mountingTh}>路口类型</div>
                <div className={styles.mountingTh}>管理单位</div>
                <div className={styles.mountingTh}>操作</div>
              </div>
              <div className={styles.mountingTbody}>
                {
                  TimingList && TimingList.map(item => (
                    <div key={item.ID} className={styles.mountingTr}>
                      <div className={styles.mountingTd}><span><Icon type="plus" /></span></div>
                      <div className={styles.mountingTd}>{item.UNIT_NAME}</div>
                      <div className={styles.mountingTd}>{item.DISTRICT_NAME}</div>
                      <div className={styles.mountingTd}>{item.SIGNALSYSTEMCODE}</div>
                      <div className={styles.mountingTd}>{item.CFGPLANSIZE}</div>
                      <div className={styles.mountingTd}>{item.PLAN_ID}</div>
                      <div className={styles.mountingTd}>{item.UNITTYPE}</div>
                      <div className={styles.mountingTd}>{item.USER_GROUP_NAME}</div>
                      <div className={styles.mountingTd}>
                        <span className={styles.deviceMsg} onClick={() => this.selectListroad(item.ID)}>修改</span>
                        <span className={styles.deviceMsg} onClick={() => this.crossingSee(item.ID)}>删除</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className={styles.paginationBox}>
            {
              pageNumber && <Pagination
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['1', '10', '15']}
                onChange={this.pageChange}
                onShowSizeChange={this.pageSize}
                defaultCurrent={pageNumber && pageNumber.fromPage}
                defaultPageSize={15}
                size="small"
                total={(pageNumber && pageNumber.totalSize) || 1}
              />
            }
            <span>共{pageNumber && pageNumber.totalSize}条</span>
          </div>
        </div>
        <div className={styles.phaseConfigBox}>
          {
            showEditTiming &&
            <div className={styles.editBox}>
              <div className={styles.editDetails}>
                <div className={styles.editTitle}>
                  编辑方案
                  <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
                </div>
                <div className={styles.editContent}>
                  <div className={styles.editItemsName}>方案编号</div>
                  <div className={styles.editItems}>
                    <Input pname="planno" onBlur={this.numberBlur} onChange={this.handleEditChange} />
                  </div>
                  <div className={styles.editItemsName}>方案名称</div>
                  <div className={styles.editItems}>
                    <Input pname="planname" onChange={this.handleEditChange} />
                  </div>
                </div>
                <div className={styles.editContent}>
                  <div className={styles.editItemsName}>协调相位号</div>
                  <div className={styles.editItems}>
                    <Select
                      onChange={this.changecoordinated}
                    >
                      {
                        this.coordinatedPhase.map(item =>
                          <Option value={item} key={item}>{item}</Option>)}
                    </Select>
                  </div>
                  <div className={styles.editItemsName}>协调相位差</div>
                  <div className={styles.editItems}>
                    <Input pname="offset" onChange={this.handleEditChange} />
                  </div>
                </div>
                <div className={styles.editContent}>
                  <div className={styles.editItemsName}>周期长</div>
                  <div className={styles.editItems}>
                    <Input pname="offsets" value={cycleLength} />
                  </div>
                </div>
                <div className={styles.editContent}>
                  <div className={styles.editItemsName}>关联阶段 <br />(含过渡时间)</div>
                  <div className={styles.editItems} style={{ maxHeight: '85px', overflowY: 'auto' }}>
                    {
                      planStageList &&
                      planStageList.map((stage, index) => {
                        return (
                          <div className={styles.stageBox} key={'关联' + stage.ID + stage.STAGE_IMAGE + index + stage.GREEN}>
                            <p className={styles.phaseNo}>{stage.STAGENO}</p>
                            <img width="35px" height="35px" src={`http://192.168.1.123:26001/atms/comm/images/anniu/${stage.STAGE_IMAGE}`} alt="" />
                            <input type="text" defaultValue={stage.GREEN} onBlur={this.handleStageTimeBlur} onChange={(e) => { this.handleStageTimeChange(e, index) }} />
                          </div >
                        )
                      })
                    }
                    <div className={styles.stageBox}>
                      <span className={styles.editStageBtn} onClick={this.handleAddStage}><Icon type="plus" /></span>
                      <span className={styles.editStageBtn} onClick={this.handleDeleteStage}><Icon type="minus" /></span>
                    </div>
                  </div >
                </div >
                <div className={styles.editBtnBox}>
                  <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                  <div className={styles.editBtn} onClick={this.handleSaveTimingPlan}>确定</div>
                </div>
                {
                  editStageSelect &&
                  <div className={styles.stageSelectMark}>
                    <div className={styles.stageSelectBox}>
                      <div className={styles.stageTilte}>选择阶段</div>
                      <div className={styles.stageContent}>
                        {
                          editPlanStageList &&
                          editPlanStageList.map((stages, index) => {
                            return (
                              <div className={styles.stageBox} key={'选择' + stages.ID + index}>
                                <p className={styles.phaseNo} onClick={() => { this.handleRadioStageCheck(index, stages) }}>
                                  <span className={styles.radioBtn}><i className={styles.radioCheck} style={{ opacity: stageRadioIndex === index ? 1 : 0 }} /></span>
                                  {stages.STAGENO}
                                </p>
                                <img width="35px" height="35px" src={`http://192.168.1.123:26001/atms/comm/images/anniu/${stages.STAGE_IMAGE}`} alt="" />
                                <input disabled type="text" defaultValue={stages.GREEN} />
                              </div>
                            )
                          })
                        }
                      </div>
                      <div className={styles.stageAction}>
                        <div className={styles.stageActionBtn} onClick={this.handleAddStageCheck}>确定</div>
                        <div className={styles.stageActionBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCancelStage}>取消</div>
                      </div>
                    </div>
                  </div>
                }
              </div >
            </div >
          }
        </div >
      </div >
    )
  }
}

const mapStateToProps = state => ({
  data: { ...state.data, ...state.managements },
})
const mapDisPatchToProps = dispatch => ({
  getLoadPlanTree: bindActionCreators(getLoadPlanTree, dispatch),
  getInterList: bindActionCreators(getInterList, dispatch),
  gettimgetTimingInfo: bindActionCreators(gettimgetTimingInfo, dispatch),
  gettimcode: bindActionCreators(gettimcode, dispatch),
  gettimingInfoByExcel: bindActionCreators(gettimingInfoByExcel, dispatch),
  getlcflgss: bindActionCreators(getlcflgss, dispatch),
  gettimvalidate: bindActionCreators(gettimvalidate, dispatch),
  gettimsaveOrUpdateForm: bindActionCreators(gettimsaveOrUpdateForm, dispatch),
})
export default connect(mapStateToProps, mapDisPatchToProps)(AlarmMonitoring)
