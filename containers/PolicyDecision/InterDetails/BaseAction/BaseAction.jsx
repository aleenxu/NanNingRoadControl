import React from 'react'
import { Icon, Select, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './BaseAction.scss'

import { getBaseAction, getDeleteBaseAction, getActionNoList, getPlanNoList, getAddActions } from '../../../../actions/interCofig'

class BaseAction extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      baseActions: null,
      showEditBox: false,
      actionNoLists: null,
      planNoLists: null,
      defaultAction: null,
      defaultPlan: null,
    }
    this.saveParams = {
      actionNo: 0,
      id: 0,
      planNo: 0,
      unitId: 0,
    }
  }
  componentDidMount = () => {
    this.InterId = this.props.interId
    this.saveParams.unitId = this.InterId
    this.props.getBaseAction(this.InterId)
    this.props.getPlanNoList(this.InterId)
  }
  componentDidUpdate = (prevState) => {
    const { baseActions, actionNoList, planNoList } = this.props.data
    if (prevState.data.baseActions !== baseActions) {
      this.getBaseActions(baseActions)
    }
    if (prevState.data.actionNoList !== actionNoList) {
      this.getActionNolists(actionNoList)
    }
    if (prevState.data.planNoList !== planNoList) {
      this.getPlanNoLists(planNoList)
    }
  }
  getActionNolists = (actionNoLists) => {
    this.setState({ actionNoLists })
  }
  getPlanNoLists = (planNoLists) => {
    this.setState({ planNoLists })
  }
  getBaseActions = (baseActions) => {
    this.setState({ baseActions })
  }
  handleEditAction = (item) => {
    this.saveParams.actionNo = item.ACTIONNO
    this.saveParams.id = item.ID
    this.saveParams.planNo = item.PLANNO
    this.props.getActionNoList(item.ID, this.InterId)
    this.setState({
      showEditBox: true,
      defaultAction: item.ACTIONNO,
      defaultPlan: item.PLANNO,
    })
  }
  handleCloseEdit = () => {
    this.setState({ showEditBox: false })
  }
  handleDeletePlan = (e) => {
    const id = e.target.getAttribute('planid')
    const { confirm } = Modal
    const selfThis = this
    confirm({
      title: '确定要删除吗？',
      className: styles.confirmBox,
      onOk() {
        selfThis.props.getDeleteBaseAction(id).then((res) => {
          if (res.data.code === 200) {
            selfThis.props.getBaseAction(selfThis.InterId)
          }
          message.info(res.data.message)
        })
      },
    })
  }
  handleChangeAction = (value, options) => {
    const pName = options.props.pname
    this.saveParams[pName] = value
  }
  handleAddAction = () => {
    const planNo = this.state.planNoLists[0]
    this.saveParams.planNo = planNo
    this.saveParams.actionNo = 1
    this.saveParams.id = 0
    this.setState({
      defaultAction: null,
      defaultPlan: planNo,
      actionNoLists: [],
      showEditBox: true,
    })
  }
  handleSaveActions = () => {
    this.props.getAddActions(this.saveParams).then((res) => {
      if (res.data.code === 200) {
        this.props.getBaseAction(this.InterId)
      }
      message.info(res.data.message)
      this.handleCloseEdit()
    })
  }
  closeConfigPop = () => {
    this.props.closeConfigPop()
  }
  render() {
    const { Option } = Select
    const { baseActions, showEditBox, planNoLists, actionNoLists, defaultAction, defaultPlan } = this.state
    return (
      <div className={styles.phaseConfigBox}>
        {
          showEditBox &&
          <div className={styles.editBox}>
            <div className={styles.editDetails}>
              <div className={styles.editTitle}>
                编辑阶段
                <span className={styles.cloeEditIcon} onClick={this.handleCloseEdit}><Icon type="close" /></span>
              </div>
              <div className={styles.editContent}>
                <div className={styles.editItemsName}>动作编号</div>
                <div className={styles.editItems}>
                  <Select defaultValue={defaultAction || 1} onChange={this.handleChangeAction}>
                    {
                      actionNoLists &&
                      new Array(255).fill(true).map((item, index) => {
                        if (actionNoLists.indexOf(String(index + 1)) === -1) {
                          return (
                            <Option key={'动作' + index + 1} value={index + 1} pname="actionNo">{index + 1}</Option>
                          )
                        }
                      })
                    }
                  </Select>
                </div>
                <div className={styles.editItemsName}>执行方案</div>
                <div className={styles.editItems} style={{ flex: 1.2 }}>
                  <Select defaultValue={defaultPlan} onChange={this.handleChangeAction}>
                    {
                      planNoLists &&
                      planNoLists.map((item) => {
                        return (
                          <Option key={item} value={item} pname="planNo">{'方案' + item}</Option>
                        )
                      })
                    }
                    <Option key={251} value={251} pname="planNo">关灯控制</Option>
                    <Option key={252} value={252} pname="planNo">全红控制</Option>
                    <Option key={254} value={254} pname="planNo">感应控制</Option>
                    <Option key={255} value={255} pname="planNo">闪光控制</Option>
                  </Select>
                </div>
              </div>
              <div className={styles.editBtnBox}>
                <div className={styles.editBtn} style={{ backgroundColor: '#ccc' }} onClick={this.handleCloseEdit}>取消</div>
                <div className={styles.editBtn} onClick={this.handleSaveActions}>确定</div>
              </div>
            </div>
          </div>
        }
        <div className={styles.phaseConfigBox_top}>
          <div className={styles.phaseConfigBoxTop_left}>时基动作配置</div>
          <div className={styles.phaseConfigBoxTop_right} onClick={this.closeConfigPop}><Icon type="close" /></div>
        </div>
        <div className={styles.phaseConfigBox_center}>
          <div onChange={this.PhaseAdd} className={styles.phaseConfigBoxCenter_left} onClick={this.handleAddAction}>添加</div>
          <div className={styles.phaseConfigBoxCenter_left}>上载</div>
          <div className={styles.phaseConfigBoxCenter_left}>下发</div>
        </div>
        <div className={styles.phaseConfigBox_box}>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>动作编号</div>
            <div className={styles.mountingTh}>关联方案</div>
            <div className={styles.mountingTh}> 操作</div>
          </div>
          <div className={styles.mountingTbody}>
            {
              baseActions &&
              baseActions.map((item) => {
                return (
                  <div className={styles.mountingTr} key={item.ID}>
                    <div className={styles.mountingTd}>{item.ACTIONNO}</div>
                    <div className={styles.mountingTd}>
                      {
                        item.PLANNO === 251 ? '关灯控制' : item.PLANNO === 252 ? '全红控制' : item.PLANNO === 254 ? '感应控制' : item.PLANNO === 255 ? '闪光控制' :
                          `方案${item.PLANNO}`
                      }
                    </div>
                    <div className={styles.mountingTd}>
                      <div className={styles.deviceMsg}><span planid={item.ID} onClick={() => { this.handleEditAction(item) }}>修改</span></div>
                      <div className={styles.deviceMsg}><span planid={item.ID} onClick={this.handleDeletePlan}>删除</span></div>
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
    getBaseAction: bindActionCreators(getBaseAction, dispatch),
    getDeleteBaseAction: bindActionCreators(getDeleteBaseAction, dispatch),
    getActionNoList: bindActionCreators(getActionNoList, dispatch),
    getPlanNoList: bindActionCreators(getPlanNoList, dispatch),
    getAddActions: bindActionCreators(getAddActions, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(BaseAction)
