import React from 'react'
import { Icon, Input, Select, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './ChannelConfig.scss'

import { getChannelConfig, getSaveChannelInfo, getDeleteChannelInfo, getFlowDirections } from '../../../../actions/interCofig'

class ChannelConfig extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      channelList: null,
      showEditTiming: false,
      defaultvals: null,
      flowDirections: null,
      defaultFlowDirection: null,
      isEdit: false,
    }
    this.dirList = [
      { id: 1, dir: '北' },
      { id: 2, dir: '东北' },
      { id: 3, dir: '东' },
      { id: 4, dir: '东南' },
      { id: 5, dir: '南' },
      { id: 6, dir: '西南' },
      { id: 7, dir: '西' },
      { id: 8, dir: '西北' },
    ]
    this.saveParams = {
      channelNo: 0,
      controlSource: 0,
      controlSourceType: 0,
      direction: 0,
      flowDirection: 0,
      lampType: 0,
      unitId: 0,
    }
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.saveParams.unitId = this.InterId
    this.props.getChannelConfig(this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { channelList, flowDirections } = this.props.data
    if (prevState.data.channelList !== channelList) {
      this.getChannelList(channelList)
    }
    if (prevState.data.flowDirections !== flowDirections) {
      this.getFlowDirectionList(flowDirections)
    }
  }
  getChannelList = (channelList) => {
    this.setState({ channelList })
  }
  getFlowDirectionList = (flowDirections) => {
    if (flowDirections.length) {
      this.setState({
        flowDirections,
        defaultFlowDirection: flowDirections[0].C_CODE,
      })
      this.saveParams.flowDirection = flowDirections[0].C_CODE
    }
  }
  hadleEditConfig = (channelItem, type = 2) => {
    console.log(channelItem, type)
    this.saveType = type
    this.saveParams = {
      channelNo: channelItem.CHANNEL_NO,
      controlSource: channelItem.CONTROL_SOURCE,
      controlSourceType: channelItem.CONTROL_SOURCE_TYPE,
      direction: channelItem.DIRECTION,
      flowDirection: channelItem.FLOW_DIRECTION,
      lampType: channelItem.LAMP_TYPE,
      unitId: this.InterId,
    }
    this.props.getFlowDirections(channelItem.DIRECTION)
    this.setState({
      defaultvals: channelItem,
      showEditTiming: true,
      isEdit: type === 1,
    })
  }
  handleCloseEdit = () => {
    this.setState({ showEditTiming: false })
  }
  handleChannelNoChange = (e) => {
    const paramsName = e.target.getAttribute('paramsname')
    this.saveParams[paramsName] = e.target.value
  }
  handleSaveParamsChange = (val, options) => {
    const paramsName = options.props.paramsname
    if (paramsName === 'direction') {
      this.props.getFlowDirections(options.key)
    }
    this.saveParams[paramsName] = val
  }
  handleSaveChannelInfo = () => {
    this.props.getSaveChannelInfo(this.saveType, this.saveParams).then((res) => {
      if (res.data.code === 200) {
        this.props.getChannelConfig(this.InterId)
      }
      message.info(res.data.message)
      this.setState({ showEditTiming: false })
    })
  }
  handleDeleteChannel = (e) => {
    const channelNo = e.target.getAttribute('channelid')
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteChannelInfo(channelNo, selfThis.InterId).then((res) => {
          if (res.data.code === 200) {
            selfThis.props.getChannelConfig(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleAddChannel = () => {
    const channelItem = {
      FLOW_DIRECTION: 1,
      UNIT_ID: this.InterId,
      DIRECTION_NAME: '',
      LAMP_TYPE: 1,
      CONTROL_SOURCE_NAME: '',
      FLOW_DIRECTION_NAME: '',
      DIRECTION: 1,
      LAMP_TYPE_NAME: '',
      CHANNEL_NO: 1,
      CONTROL_SOURCE: 1,
      CONTROL_SOURCE_TYPE: 1,
    }
    this.hadleEditConfig(channelItem, 1)
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { channelList, showEditTiming, defaultvals, flowDirections, defaultFlowDirection, isEdit } = this.state
    const { Option } = Select
    return (
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
                <div className={styles.editItemsName}>通道号</div>
                <div className={styles.editItems}>
                  {
                    isEdit ?
                      <Input defaultValue={defaultvals && defaultvals.CHANNEL_NO} paramsname="channelNo" onChange={this.handleChannelNoChange} /> :
                      <Input defaultValue={defaultvals && defaultvals.CHANNEL_NO} disabled paramsname="channelNo" />
                  }
                  
                </div>
                <div className={styles.editItemsName}>通道方向</div>
                <div className={styles.editItems}>
                  <Select defaultValue={(defaultvals && defaultvals.DIRECTION)} onChange={this.handleSaveParamsChange}>
                    {
                      this.dirList.map(item => (<Option key={item.id} value={item.id} paramsname="direction">{item.dir}</Option>))
                    }
                  </Select>
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>灯组类型</div>
                <div className={styles.editItems}>
                  <Select defaultValue={(defaultvals && defaultvals.LAMP_TYPE)} onChange={this.handleSaveParamsChange}>
                    <Option key="1" value={1} paramsname="lampType">箭头灯</Option>
                    <Option key="2" value={2} paramsname="lampType">圆盘灯</Option>
                    <Option key="3" value={3} paramsname="lampType">行人灯</Option>
                  </Select>
                </div>
                <div className={styles.editItemsName}>通道车流</div>
                <div className={styles.editItems}>
                  <Select key={defaultFlowDirection} defaultValue={defaultFlowDirection} onChange={this.handleSaveParamsChange}>
                    {
                      flowDirections &&
                      flowDirections.map((item) => {
                        return (
                          <Option key={item.C_CODE} value={item.C_CODE} paramsname="flowDirection">{item.CODE_NAME}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>控制源类型</div>
                <div className={styles.editItems}>
                  <Select defaultValue={defaultvals && defaultvals.CONTROL_SOURCE_TYPE} onChange={this.handleSaveParamsChange}>
                    <Option key="1" value={1} paramsname="controlSourceType">其他</Option>
                    <Option key="1" value={2} paramsname="controlSourceType">机动车</Option>
                    <Option key="2" value={3} paramsname="controlSourceType">行人</Option>
                    <Option key="3" value={4} paramsname="controlSourceType">跟随相位</Option>
                  </Select>
                </div>
                <div className={styles.editItemsName}>控制源</div>
                <div className={styles.editItems}>
                  <Select defaultValue={defaultvals && defaultvals.CONTROL_SOURCE} onChange={this.handleSaveParamsChange}>
                    <Option key="1" value={1} paramsname="controlSource">ITC100</Option>
                    <Option key="2" value={2} paramsname="controlSource">泰尔文特</Option>
                    <Option key="3" value={3} paramsname="controlSource">骏马</Option>
                    <Option key="4" value={4} paramsname="controlSource">海信信号机</Option>
                    <Option key="5" value={5} paramsname="controlSource">莱斯信号机</Option>
                    <Option key="6" value={6} paramsname="controlSource">中控</Option>
                  </Select>
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveChannelInfo}>确定</div>
              </div>
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>通道配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddChannel}>添加</div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>通道号</div>
            <div className={styles.mountingTh}>控制源</div>
            <div className={styles.mountingTh}>控制源类型</div>
            <div className={styles.mountingTh}>通道方向</div>
            <div className={styles.mountingTh}> 灯组类型</div>
            <div className={styles.mountingTh}> 通道车流</div>
            <div className={styles.mountingTh}> 操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              channelList &&
              channelList.map((item) => {
                return (
                  <div className={styles.mountingTr} key={item.CHANNEL_NO}>
                    <div className={styles.mountingTd}>{item.CHANNEL_NO}</div>
                    <div className={styles.mountingTd}>{item.CONTROL_SOURCE_NAME}</div>
                    <div className={styles.mountingTd}>{item.CONTROL_SOURCE_TYPE}</div>
                    <div className={styles.mountingTd}>{item.DIRECTION_NAME}</div>
                    <div className={styles.mountingTd}>{item.LAMP_TYPE_NAME}</div>
                    <div className={styles.mountingTd}>{item.FLOW_DIRECTION_NAME}</div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span onClick={() => { this.hadleEditConfig(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span onClick={this.handleDeleteChannel} channelid={item.CHANNEL_NO}>删除</span></div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.interConfig,
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getChannelConfig: bindActionCreators(getChannelConfig, dispatch),
    getSaveChannelInfo: bindActionCreators(getSaveChannelInfo, dispatch),
    getDeleteChannelInfo: bindActionCreators(getDeleteChannelInfo, dispatch),
    getFlowDirections: bindActionCreators(getFlowDirections, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(ChannelConfig)
