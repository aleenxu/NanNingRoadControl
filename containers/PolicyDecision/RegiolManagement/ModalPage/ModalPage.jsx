import React from 'react'
import { Input, Select, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getloadManageMent, getvalidate, getloadUnitName, getsaveOrUpdateForm } from '../../../../actions/management'
import styles from './ModalPage.scss'

class ModalPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      EquipmentModel: '', // 路口编号
      CorrelationNumber: '', // 区域名称
      IntersectionList: [], // 添加路口列表
      dateListValues: [], // 路口列表
      Correlationdetail: '', // 描述
      ManagementUnit: '', // 管理单位f
      SubordinateUnitLsit: [], // 管理单位列表
      OptionList: [], // 选择路口列表
    }
    this.isShow = []
    this.details = this.props.roadDetail
    this.isvalidate = false
  }
  componentDidMount = () => {
    // eslint-disable-next-line no-undef
    this.props.getloadManageMent()
    this.props.getloadUnitName(this.props.roadDetail.ID || -1)
  }
  componentDidUpdate = (prevState) => {
    const { loadManageMent, loadUnitName, saveOrUpdateForm } = this.props.data
    if (prevState.data.loadManageMent !== loadManageMent) {
      this.getloadManageMent(loadManageMent)
    }
    // if (prevState.data.validate !== validate) {
    //   this.getvalidate(validate)
    // }
    if (prevState.data.loadUnitName !== loadUnitName) {
      this.getloadUnitName(loadUnitName)
    }
    if (prevState.data.saveOrUpdateForm !== saveOrUpdateForm) {
      this.getsaveOrUpdateForm(saveOrUpdateForm)
    }
  }
  getloadManageMent = (loadManageMent) => {
    this.setState({
      SubordinateUnitLsit: loadManageMent,
      ManagementUnit: loadManageMent[0].USER_GROUP_NAME,
    })
    this.ManagementUnitName = loadManageMent[0].ID
  }
  // getvalidate = (validate) => {
  //   console.log(validate, '判断是否为真')
  //   if (validate) {
  //     message.error('该区域编号已经存在')
  //     this.isvalidate = false
  //   } else {
  //     this.isvalidate = true
  //   }
  // }
  getloadUnitName = (loadUnitName) => {
    if (this.props.roadDetail.ID) {
      console.log(loadUnitName.districtHasnot, 'true')
      this.setState({
        OptionList: loadUnitName.districtHasnot,
      }, () => {
        this.detailsFun()
      })
    } else {
      console.log(loadUnitName, 'else')
      this.setState({
        OptionList: loadUnitName,
      }, () => {
        this.detailsFun()
      })
    }
  }
  detailsFun = () => {
    try {
      if (this.details) {
        const { SubordinateUnitLsit, OptionList } = this.state
        const name = SubordinateUnitLsit.find(item => item.ID === this.details.MANAGEMENT_UNIT_ID).USER_GROUP_NAME
        this.arru = OptionList
        this.ids = this.details.ID
        this.isvalidate = true
        this.details.districtHas.forEach((item) => {
          this.arru = this.arru.filter(items => items.ID !== item.ID)
        })
        // console.log(this.details, this.arru, OptionList, this.arru || OptionList, 'qiasss')
        this.setState({
          ManagementUnit: name,
          CorrelationNumber: this.details.DISTRICT_NAME,
          EquipmentModel: this.details.DISTRICT_CODE,
          Correlationdetail: this.details.DETAIL,
          IntersectionList: this.details.districtHas,
          OptionList: this.arru,
        })
      }
    } catch (error) {
      // window.location.reload()
    }
  }
  changValue = (e) => { // 页面所有input框改变触发
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }
  blurchange = () => { // 首个input框失去焦点事件
    const { EquipmentModel } = this.state
    this.props.getvalidate(EquipmentModel).then((res) => {
      if (!res.data.data) {
        this.isvalidate = true
      } else {
        message.error('该区域编号已经存在')
        this.isvalidate = false
      }
    })
  }
  inpvalue = (e) => {
    console.log(e, 'sss')
  }
  handleCancel = () => {
    this.props.isShowModalPage()
    this.setState({
      EquipmentModel: '', // 路口编号
      CorrelationNumber: '', // 区域名称
      IntersectionList: [], // 添加路口列表
      dateListValues: [], // 路口列表
      Correlationdetail: '', // 描述
      ManagementUnit: '', // 管理单位f
      SubordinateUnitLsit: [], // 管理单位列表
      OptionList: [], // 选择路口列表
    })
  }
  sInstallationLocations = (name) => { // 切换管理单位
    const { SubordinateUnitLsit } = this.state
    this.ManagementUnitName = SubordinateUnitLsit.find(item => item.USER_GROUP_NAME === name).ID
    // console.log(this.ManagementUnitName)
    this.setState({
      ManagementUnit: name,
    })
  }
  handleChange = (value) => { // 切换选择路口
    // console.log(value, 'change')
    this.arr = []
    const { OptionList } = this.state
    value.forEach((item) => {
      const obj = OptionList.find(items => items.ID.toString() === item)
      this.arr.push(obj)
    })
    this.setState({
      dateListValues: value,
    })
  }
  addList = () => { // 渲染添加路口名称
    const { OptionList, IntersectionList } = this.state
    if (!OptionList.length) return
    let arrs = OptionList
    this.arr.forEach((item) => {
      arrs = arrs.filter(items => items.ID !== item.ID)
    })
    const ar = [...IntersectionList, ...this.arr]
    this.setState({
      IntersectionList: ar,
      dateListValues: [],
      OptionList: arrs,
    }, () => {
      this.arr = []
    })
  }
  delectIntersectionList = (items) => {
    const { IntersectionList, OptionList } = this.state
    const arr = IntersectionList.filter(item => item.ID !== items.ID)
    OptionList.push(items)
    this.setState({
      IntersectionList: arr,
      OptionList,
    })
  }
  isFormParameters = (obj) => {
    const arr = Object.keys(obj)
    console.log(arr[0])
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 'districtId') {
        if (obj.districtId === '' || obj.districtId === null) {
          console.log(obj.districtId)
          return message.error('请输入区域编号')
        }
      }
      if (arr[i] === 'districtName') {
        if (obj.districtName === '' || obj.districtName === null) {
          return message.error('请输入区域名称')
        }
      }
      if (arr[i] === 'detail') {
        if (obj.detail === '' || obj.detail === null) {
          return message.error('请输入描述')
        }
      }
    }
  }
  modifyOk = async () => { // 区域编号修改
    if (!this.isvalidate) {
      return message.error('该区域编号已经存在')
    }
    const {
      EquipmentModel, CorrelationNumber, Correlationdetail, IntersectionList,
    } = this.state
    let str = ''
    IntersectionList.forEach((item) => {
      str = `${str + item.ID},`
    })
    const strLength = str.slice(0, str.length - 1)
    const obj = {
      districtId: EquipmentModel,
      districtName: CorrelationNumber,
      detail: Correlationdetail,
      id: this.ids,
      management: `${this.ManagementUnitName}`,
      sureId: 'inserdPage',
      trueId: EquipmentModel,
      unitArr: strLength,
    }
    const modifyImg = await this.isFormParameters(obj)
    if (!modifyImg) {
      this.props.getsaveOrUpdateForm(obj).then((res) => {
        const { code } = res.data
        if (code === 200) {
          this.handleCancel()
          this.props.getLoadPlanTree()
          this.isvalidate = false
          message.success('修改成功')
        }
      })
    }
  }
  handleOk = async () => { // 区域编号提交
    if (!this.isvalidate) {
      return message.error('该区域编号已经存在')
    }
    const {
      EquipmentModel, CorrelationNumber, Correlationdetail, IntersectionList,
    } = this.state
    let str = ''
    IntersectionList.forEach((item) => {
      str = `${str + item.ID},`
    })
    const strLength = str.slice(0, str.length - 1)
    const obj = {
      districtId: EquipmentModel,
      districtName: CorrelationNumber,
      detail: Correlationdetail,
      id: '',
      management: `${this.ManagementUnitName}`,
      sureId: 'addPage',
      trueId: EquipmentModel,
      unitArr: strLength,
    }
    const addImg = await this.isFormParameters(obj)
    if (!addImg) {
      this.props.getsaveOrUpdateForm(obj).then((res) => {
        const { code } = res.data
        if (code === 200) {
          this.handleCancel()
          message.success('添加成功')
          this.isvalidate = false
          this.props.getLoadPlanTree()
        }
      })
    }
  }
  render() {
    const {
      EquipmentModel, CorrelationNumber, IntersectionList, Correlationdetail,
      dateListValues, ManagementUnit, SubordinateUnitLsit, OptionList,
    } = this.state
    const { Option } = Select
    console.log(OptionList, 'sdfdss')
    return (
      <div className={styles.ModalPageWrapperBox}>
        <div className={styles.ModalPageWrapper}>
          <div className={styles.mountingTable}>
            <div className={styles.mountingTbody}>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span>*</span>区域编号</div><div><Input disabled={!!this.details} name="EquipmentModel" onBlur={this.blurchange} autocomplete="off" onChange={this.changValue} value={EquipmentModel} /></div></div>
                <div className={styles.mountingTd}><div><span>*</span>区域名称</div><div><Input name="CorrelationNumber" onChange={this.changValue} autocomplete="off" value={CorrelationNumber} /></div></div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span>*</span>管理单位</div>
                  <div>
                    <Select
                      style={{ width: '100%' }}
                      // optionFilterProp="children"
                      value={ManagementUnit}
                      onChange={this.sInstallationLocations}
                    >
                      {SubordinateUnitLsit && SubordinateUnitLsit.map(item =>
                        <Option value={item.USER_GROUP_NAME} key={item.ID}>{item.USER_GROUP_NAME}</Option>)}
                    </Select>
                  </div>
                </div>
                <div className={styles.mountingTd}><div><span>*</span>描述</div><div><Input name="Correlationdetail" autocomplete="off" onChange={this.changValue} value={Correlationdetail} /></div></div>
              </div>
              <div className={`${styles.mountingTr} ${styles.mountingTrx}`}>
                <div className={styles.mountingTd}>
                  <div><span>*</span>选择路口</div>
                  <div className={styles.boxtd}>
                    <Select
                      mode="multiple"
                      showSearch
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                      value={dateListValues}
                      placeholder="请选择路口"
                      // defaultValue={['a10', 'c12']}
                      onChange={this.handleChange}
                    >{
                        OptionList && OptionList.map(item => <Option key={item.ID}>{item.UNIT_NAME}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className={styles.mountingTd}>
                  <div className={styles.fontstyle}>
                    <li> <b onClick={this.addList}>添加方向</b></li>
                  </div>
                </div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTdx}>路口名称</div>
                <div className={styles.mountingTdx}>操作</div>
              </div>
              <div className={styles.boxers} >
                {
                  IntersectionList && IntersectionList.map(item => (
                    <div key={item.ID} className={styles.mountingTr}>
                      <div className={styles.mountingTdx}>{item.UNIT_NAME}</div>
                      <div className={styles.mountingTdx}><span onClick={() => this.delectIntersectionList(item)}>移除</span></div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={styles.mountingTableBottom}>
              <span onClick={this.handleCancel} className={styles.mountingTableBottom_right}>取消</span>
              {
                this.details ?
                  <span onClick={this.modifyOk}>
                    修改
                  </span> :
                  <span onClick={this.handleOk} className={styles.mountingTableBottom_left}>
                    确定
                  </span>
              }
            </div>
          </div>
        </div>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.managements,
  }
}
const mapDisPatchToProps = dispatch => ({
  getloadManageMent: bindActionCreators(getloadManageMent, dispatch),
  getvalidate: bindActionCreators(getvalidate, dispatch),
  getloadUnitName: bindActionCreators(getloadUnitName, dispatch),
  getsaveOrUpdateForm: bindActionCreators(getsaveOrUpdateForm, dispatch),
})
export default connect(mapStateToProps, mapDisPatchToProps)(ModalPage)
