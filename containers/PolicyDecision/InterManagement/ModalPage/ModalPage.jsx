import React from 'react'
import { Input, Select, Radio, Modal, message, Checkbox } from 'antd'
import styles from './ModalPage.scss'
import getResponseData from '../../../../utils/getResponseData'

class ModalPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      SubordinateUnitLsit: [], // 所属单位列表
      unitInterInfo: null,
      interListMsg: null,
    }
    this.deleteUrl = '/atms/unitManagement/delete/'
    this.dateList = []
    this.saveParams = {
      arr: '',
      // backgroundImg: '',
      districtInfo: '',
      id: '',
      latitude: '',
      longitude: '',
      management: '',
      minorUnitNumber: '',
      rotateAngle: '',
      signalCode: '',
      signalGateway: '',
      signalIp: '',
      signalMask: '',
      signalModel: '',
      signalPort: '',
      signalSupplier: '',
      signalSystemCode: '',
      signalUnitId: '',
      sureId: '',
      unitConnectors: '',
      unitId: '',
      unitName: '',
      unitTypeCode: '',
      isSync: 0,
    }
  }
  componentDidMount = () => {
    console.log(this.props, '路口信息')
    const { unitInterInfo } = this.props.data
    if (unitInterInfo) {
      this.getEditInterInfo(unitInterInfo)
    }
  }
  componentDidUpdate = (prevState) => {
    const { unitInterInfo } = this.props.data
    console.log(prevState.data.unitInterInfo, unitInterInfo)
    if (prevState.data.unitInterInfo !== unitInterInfo) {
      console.log(unitInterInfo, '路口信息')
      this.getEditInterInfo(unitInterInfo)
    }
  }
  componentWillUnmount = () => {
    this.setState({
      unitInterInfo: null,
      interListMsg: [],
    })
  }
  // static getDerivedStateFromProps = (props, state) => {
  //   console.log(props, state)
  // }
  getChangeSaveParams = (unitInfo) => {
    console.log('修改参数', unitInfo)
    this.saveParams = {
      arr: '',
      // backgroundImg: unitInfo.BACKGROUND_IMG || '',
      districtInfo: unitInfo.DISTRICT_ID,
      id: unitInfo.ID,
      latitude: unitInfo.LATITUDE,
      longitude: unitInfo.LONGITUDE,
      management: unitInfo.MANAGEMENT_UNIT_ID,
      minorUnitNumber: unitInfo.MINOR_UNIT_NUMBER,
      rotateAngle: unitInfo.ROTATE_ANGLE,
      signalCode: unitInfo.SIGNAL_CODE,
      signalGateway: unitInfo.SIGNAL_GATEWAY,
      signalIp: unitInfo.SIGNAL_IP,
      signalMask: unitInfo.SIGNAL_MASK,
      signalModel: unitInfo.SIGNAL_MODEL,
      signalPort: unitInfo.SIGNAL_PORT,
      signalSupplier: unitInfo.SIGNAL_SUPPLIER,
      signalSystemCode: unitInfo.SIGNAL_SYSTEM_CODE,
      signalUnitId: unitInfo.SIGNAL_UNIT_ID,
      sureId: unitInfo.SUREID || '',
      unitConnectors: [],
      unitId: unitInfo.UNIT_ID,
      unitName: unitInfo.UNIT_NAME,
      unitTypeCode: unitInfo.UNIT_TYPE_CODE,
    }
  }
  // 编辑回显路口信息
  getEditInterInfo = (unitInterInfo) => {
    const { unitInfo } = unitInterInfo
    this.setState({
      unitInterInfo: unitInfo,
      interListMsg: unitInterInfo.unitConnector,
    })
    this.getChangeSaveParams(unitInfo)
    this.saveParams.unitConnectors = JSON.stringify(unitInterInfo.unitConnector)
    this.dateList = unitInterInfo.unitConnector
  }
  // 添加列表
  handleAddInterList = () => {
    const addMsg = {
      CONNECTOR_UNIT_DIRECTION: 0,
      CONNECTOR_UNIT_ID: '',
      ROAD_DETAIL: '',
      ROAD_RANK: '',
      UNIT_DIRECTION: 1,
    }
    this.dateList.push(addMsg)
    this.setState({ interListMsg: this.dateList })
    this.saveParams.unitConnectors = JSON.stringify(this.dateList)
  }
  handleCancel = () => {
    this.props.isShowModalPage()
  }
  // 删除新建列表
  handleDeleteInterList = (index) => {
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        const filterList = selfThis.dateList.splice(index, 1)
        console.log(filterList, index)
        if (index === 0) {
          selfThis.setState({ interListMsg: [] })
          selfThis.saveParams.unitConnectors = JSON.stringify([])
        } else {
          selfThis.setState({ interListMsg: filterList })
          selfThis.saveParams.unitConnectors = JSON.stringify(filterList)
        }
        message.info('删除成功')
      },
    })
  }
  // 修改参数
  handleChangeSaveMsg = (e) => {
    const { value } = e.target
    const pName = e.target.getAttribute('pname')
    this.saveParams[pName] = value
  }
  // 修改下拉参数
  handleSelectSaveParams = (val, options) => {
    console.log(val)
    const { pname } = options.props
    this.saveParams[pname] = val
  }
  handleSaveInterMsg = () => {
    this.saveParams.unitConnectors = JSON.stringify(this.dateList)
    this.props.updateUnitInterInfo(this.saveParams)
  }
  handleInterMsgChange = (val, options) => {
    const { editindex, pname } = options.props
    this.dateList[editindex][pname] = val
  }
  handleInterName = (e) => {
    const pName = e.target.getAttribute('pname')
    const editIndex = e.target.getAttribute('editindex')
    this.dateList[editIndex][pName] = e.target.value
  }
  handleIsAsync = (e) => {
    const { checked } = e.target
    this.saveParams.isSync = checked ? 1 : 0
  }
  handleDeleteInterMsg = () => {
    getResponseData('get', `${this.deleteUrl}${this.saveParams.id}`).then((res) => {
      const { code, data } = res.data
      if (code === 200 && Number(data) > 0) {
        this.handleCancel()
        this.props.getRefreshPage()
      }
      message.info(res.data.message)
    })
  }
  render() {
    const { unitInterInfo, SubordinateUnitLsit, interListMsg } = this.state
    const {
      controlSys, unitInterType, unitDeviceType, managementUnit, areaList, unitDirection, interList,
    } = this.props.data
    const { Option } = Select
    return (
      <div className={styles.modalDiv}>
        <div className={styles.ModalPageWrapper}>
          <div className={styles.mountingTable}>
            <div className={styles.mountingTbody} key={unitInterInfo && (unitInterInfo.ID + unitInterType.UNIT_NAME)}>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}>
                  <div><span className={styles.requiredFields}>*</span>路口编号</div>
                  <div><Input pname="unitId" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.UNIT_ID} /></div>
                </div>
                <div className={styles.mountingTd}>
                  <div><span className={styles.requiredFields}>*</span>路口名称</div>
                  <div><Input pname="unitName" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.UNIT_NAME} /></div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span className={styles.requiredFields}>*</span>路口类型</div>
                  <div>
                    <Select style={{ width: '100%' }} defaultValue={unitInterInfo && unitInterInfo.UNIT_TYPE_CODE} onChange={this.handleSelectSaveParams}>
                      {
                        unitInterType &&
                        unitInterType.map(item => (<Option pname="unitTypeCode" value={item.C_CODE} key={item.C_CODE}>{item.CODE_NAME}</Option>))
                      }
                    </Select>
                  </div>
                </div>
                <div className={styles.mountingTd}><div><span className={styles.requiredFields}>*</span>所属区域</div>
                  <div>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={unitInterInfo && unitInterInfo.DISTRICT_ID}
                      onChange={this.handleSelectSaveParams}
                    >
                      {
                        areaList &&
                        areaList.map(item => (<Option pname="districtInfo" value={item.ID} key={item.ID}>{item.NAME}</Option>))
                      }
                    </Select>
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span className={styles.requiredFields}>*</span>是否多路口</div>
                  <div>
                    <Radio.Group onChange={this.onChangeRadio} defaultValue={unitInterInfo && unitInterInfo.MINOR_UNIT_NUMBER}>
                      <Radio value={1}>否</Radio>
                      <Radio value={2}>是</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className={styles.mountingTd}>
                  <div>
                    <span className={styles.requiredFields}>*</span>控制路口数
                  </div>
                  <div>
                    <Input pname="minorUnitNumber" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.MINOR_UNIT_NUMBER} />
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}>
                  <div>信号控制系统<br />对应路口编号</div>
                  <div><Input pname="UNIT_ID" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.UNIT_ID} /></div>
                </div>
                <div className={styles.mountingTd}><div>管理单位</div>
                  <div>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={unitInterInfo && unitInterInfo.MANAGEMENT_UNIT_ID}
                      onChange={this.handleSelectSaveParams}
                    >
                      {
                        managementUnit &&
                        managementUnit.map(item => (<Option pname="management" value={item.ID} key={item.ID}>{item.USER_GROUP_NAME}</Option>))
                      }
                    </Select>
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span className={styles.requiredFields}>*</span>经度</div>
                  <div>
                    <Input pname="longitude" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.LONGITUDE} />
                  </div>
                </div>
                <div className={styles.mountingTd}><div><span className={styles.requiredFields}>*</span>纬度</div>
                  <div>
                    <Input pname="latitude" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.LATITUDE} />
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div>信号控制系统</div>
                  <div>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={unitInterInfo && unitInterInfo.SIGNAL_SYSTEM_CODE}
                      onChange={this.handleSelectSaveParams}
                    >
                      {
                        controlSys &&
                        controlSys.map(item => (<Option pname="signalSystemCode" value={item.C_CODE} key={item.C_CODE}>{item.CODE_NAME}</Option>))
                      }
                    </Select>
                  </div>
                </div>
                <div className={styles.mountingTd}><div><span className={styles.requiredFields}>*</span>信号机IP</div>
                  <div>
                    <Input pname="signalIp" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.SIGNAL_IP} />
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div>信号机网关</div>
                  <div>
                    <Input pname="signalGateway" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.SIGNAL_GATEWAY} />
                  </div>
                </div>
                <div className={styles.mountingTd}>
                  <div>信号机子网掩码</div>
                  <div><Input pname="signalMask" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.SIGNAL_MASK} /></div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}>
                  <div>信号机端口</div>
                  <div><Input pname="signalPort" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.SIGNAL_PORT} /></div>
                </div>
                <div className={styles.mountingTd}>
                  <div>信号机厂商</div>
                  <div><Input pname="signalSupplier" onChange={this.handleChangeSaveMsg} defaultValue={unitInterInfo && unitInterInfo.SIGNAL_SUPPLIER} /></div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div>信号机型号</div>
                  <div>
                    <Select
                      style={{ width: '100%' }}
                      defaultValue={unitInterInfo && unitInterInfo.SIGNAL_MODEL}
                      onChange={this.handleSelectSaveParams}
                      
                    >
                      {
                        unitDeviceType &&
                        unitDeviceType.map(item => (<Option pname="signalModel" value={item.C_CODE} key={item.C_CODE}>{item.CODE_NAME}</Option>))
                      }
                      {SubordinateUnitLsit && SubordinateUnitLsit.map(item =>
                        <Option value={item.ID} key={item.ID}>{item.USER_GROUP_NAME}</Option>)}
                    </Select>
                  </div>
                </div>
                <div className={styles.mountingTd}>
                  <div><span className={styles.requiredFields}>*</span>信号机编号</div>
                  <div> <Input pname="UNIT_ID" defaultValue={unitInterInfo && unitInterInfo.SIGNAL_CODE} onChange={this.handleChangeSaveMsg} /></div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}>
                  <div>指北针偏转角度</div>
                  <div><Input pname="rotateAngle" defaultValue={unitInterInfo && unitInterInfo.ROTATE_ANGLE} onChange={this.handleChangeSaveMsg} /></div>
                </div>
                <div className={styles.mountingTd}>
                  <div style={{ justifyContent: 'flex-start', paddingLeft: '10px' }}>
                    (顺时针为正,逆时针为负)
                    <span style={{ marginLeft: '50px' }} pname="isSync">是否同步 <Checkbox onChange={this.handleIsAsync} /></span>
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTdx}>路口方向</div>
                <div className={styles.mountingTdx} style={{ flex: 1.3 }}>流向路口</div>
                <div className={styles.mountingTdx}>流向路口方向</div>
                <div className={styles.mountingTdx}>道路名称描述</div>
                <div className={styles.mountingTdx}>路口等级</div>
                <div className={styles.mountingTdx}>操作</div>
              </div>
              <div className={styles.boxers}>
                {
                  interListMsg && interListMsg.map((item, index) => {
                    return (
                      <div className={styles.boxerBox} key={index}>
                        <div>
                          <Select style={{ width: '100%' }} defaultValue={item.UNIT_DIRECTION} onChange={this.handleInterMsgChange}>
                            {
                              unitDirection &&
                              unitDirection.map(dir => (<Option value={dir.C_CODE} pname="UNIT_DIRECTION" editindex={index} key={dir.C_CODE}>{dir.CODE_NAME}</Option>))
                            }
                          </Select>
                        </div>
                        <div>
                          <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ flex: 1.3, width: '115px' }}
                            onSearch={this.SearchList}
                            defaultValue={item.CONNECTOR_UNIT_ID}
                            onChange={this.handleInterMsgChange}
                          >
                            {
                              interList &&
                              interList.map(inter => (<Option value={inter.ID} pname="CONNECTOR_UNIT_ID" editindex={index} key={inter.ID}>{inter.UNIT_NAME}</Option>))
                            }
                          </Select>
                        </div>
                        <div>
                          <Select style={{ width: '100%' }} defaultValue={item.CONNECTOR_UNIT_DIRECTION} onChange={this.handleInterMsgChange}>
                            {
                              unitDirection &&
                              unitDirection.map(dir => (<Option value={dir.C_CODE} pname="CONNECTOR_UNIT_DIRECTION" editindex={index} key={dir.C_CODE}>{dir.CODE_NAME}</Option>))
                            }
                          </Select>
                        </div>
                        <div>
                          <Input defaultValue={item.ROAD_DETAIL} placeholder="道路名称" pname="ROAD_DETAIL" editindex={index} onChange={this.handleInterName} />
                        </div>
                        <div>
                          <Input defaultValue={item.ROAD_RANK} placeholder="路口等级" pname="ROAD_RANK" editindex={index} onChange={this.handleInterName} />
                        </div>
                        <div>
                          <span onClick={() => this.handleDeleteInterList(index)}>删除</span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className={styles.mountingTr}>
                <span onClick={this.handleAddInterList}>添加方向</span>
              </div>
            </div>
            <div className={styles.mountingTableBottom}>
              <span onClick={this.handleCancel} className={styles.mountingTableBottom_right}>取消</span>
              <span className={styles.mountingTableBottom_left} onClick={this.handleDeleteInterMsg}>删除</span>
              <span className={styles.mountingTableBottom_left} onClick={this.handleSaveInterMsg}>确定</span>
            </div>
          </div>
        </div >
      </div>
    )
  }
}

export default ModalPage
