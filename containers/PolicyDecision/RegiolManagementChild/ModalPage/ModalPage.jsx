import React from 'react'
import { Input, Select, message, DatePicker } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { getsubvalidate, getsubloadUnitName, getsubsaveOrUpdateForm } from '../../../../actions/management'
import styles from './ModalPage.scss'

class ModalPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      EquipmentModel: '', // 子路口编号
      CorrelationNumber: '', // 子区域名称
      IntersectionList: [], // 添加路口列表
      dateListValues: [], // 路口列表
      Correlationdetail: '', // 描述
      ManagementUnit: this.formatDate(new Date()), // 管理单位f
      OptionList: [], // 选择路口列表
    }
    this.isShow = []
    this.details = this.props.roadDetail
    this.dateFormat = 'YYYY-MM-DD'
    this.isvalidate = false
    this.ManagementUnitNumber = null
  }
  componentDidMount = () => {
    // eslint-disable-next-line no-undef
    this.props.getsubloadUnitName(this.props.roadDetail.ID || -1)
  }
  componentDidUpdate = (prevState) => {
    const { loadManageMent, subloadUnitName, subsaveOrUpdateForm } = this.props.data
    if (prevState.data.loadManageMent !== loadManageMent) {
      this.getloadManageMent(loadManageMent)
    }
    if (prevState.data.subloadUnitName !== subloadUnitName) {
      this.getsubloadUnitName(subloadUnitName)
    }
    if (prevState.data.subsaveOrUpdateForm !== subsaveOrUpdateForm) {
      this.getsubsaveOrUpdateForm(subsaveOrUpdateForm)
    }
  }
  // getloadManageMent = (loadManageMent) => {
  //   this.setState({
  //      loadManageMent,
  //     ManagementUnit: loadManageMent[0].USER_GROUP_NAME,
  //   })
  //   this.ManagementUnitName = loadManageMent[0].ID
  // }
  getsubloadUnitName = (loadUnitName) => {
    if (this.props.roadDetail.ID) {
      this.setState({
        OptionList: loadUnitName.districtHasnot,
      }, () => {
        this.detailsFun()
      })
    } else {
      this.setState({
        OptionList: loadUnitName.districtHasnot,
      }, () => {
        this.detailsFun()
      })
    }
  }
  detailsFun = () => {
    try {
      if (this.details) {
        const { OptionList } = this.state
        this.arru = OptionList
        this.ids = this.details.ID
        this.ManagementUnitNumber = this.details.UPDATE_TIME
        this.isvalidate = true
        this.details.districtHas.forEach((item) => {
          this.arru = this.arru.filter(items => items.ID !== item.ID)
        })
        this.setState({
          ManagementUnit: this.formatDate(this.details.UPDATE_TIME),
          CorrelationNumber: this.details.SUB_DISTRICT_NAME,
          EquipmentModel: this.details.SUB_DISTRICT_CODE,
          Correlationdetail: this.details.DETAIL,
          IntersectionList: this.details.districtHas,
          OptionList: this.arru,
        })
      }
    } catch (error) {
      // window.location.reload()
    }
  }
  formatDate = (value) => { // 时间戳转换日期格式方法
    if (value == null) {
      return ''
    }
    const date = new Date(value)
    const y = date.getFullYear()// 年
    let MM = date.getMonth() + 1// 月
    MM = MM < 10 ? (`0${MM}`) : MM
    let d = date.getDate()// 日
    d = d < 10 ? (`0${d}`) : d
    let h = date.getHours()// 时
    h = h < 10 ? (`0${h}`) : h
    let m = date.getMinutes()// 分
    m = m < 10 ? (`0${m}`) : m
    let s = date.getSeconds()// 秒
    s = s < 10 ? (`0${s}`) : s
    return `${y}-${MM}-${d} ${h}:${m}:${s}`
  }
  changValue = (e) => { // 页面所有input框改变触发
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }
  blurchange = () => { // 首个input框失去焦点事件
    const { EquipmentModel } = this.state
    this.props.getsubvalidate(EquipmentModel).then((res) => {
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
      ManagementUnit: '', // 更新时间
      OptionList: [], // 选择路口列表
    })
  }
  sInstallationLocations = (date) => { // 切换更新时间
    console.log(this.formatDate(new Date(date._d) * 1), '')
    this.ManagementUnitNumber = new Date(date._d) * 1
    this.setState({
      ManagementUnit: this.formatDate(new Date(date._d) * 1),
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
      if (arr[i] === 'subDistrictId') {
        if (obj.subDistrictId === '' || obj.subDistrictId === null) {
          return message.error('请输入子区域编号')
        }
      }
      if (arr[i] === 'districtName') {
        if (obj.subDistrictName === '' || obj.subDistrictName === null) {
          return message.error('请输入子区域名称')
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
      return message.error('该子区域编号已经存在')
    }
    const {
      EquipmentModel, CorrelationNumber, Correlationdetail, IntersectionList, ManagementUnit,
    } = this.state
    let str = ''
    IntersectionList.forEach((item) => {
      str = `${str + item.ID},`
    })
    const strLength = str.slice(0, str.length - 1)
    const obj = {
      subDistrictId: EquipmentModel,
      subDistrictName: CorrelationNumber,
      detail: Correlationdetail,
      id: this.ids,
      updateTime: ManagementUnit,
      sureId: 'inserdPage',
      trueId: EquipmentModel,
      unitArr: strLength,
    }
    const modifyImg = await this.isFormParameters(obj)
    if (!modifyImg) {
      this.props.getsubsaveOrUpdateForm(obj).then((res) => {
        const { code } = res.data
        if (code === 200) {
          this.handleCancel()
          message.success('修改成功')
          this.props.getLoadPlanTree()
          this.isvalidate = false
        }
      })
    }
  }
  handleOk = async () => {
    if (!this.isvalidate) {
      return message.error('该区域编号已经存在')
    }
    const {
      EquipmentModel, CorrelationNumber, Correlationdetail, IntersectionList, ManagementUnit
    } = this.state
    let str = ''
    IntersectionList.forEach((item) => {
      str = `${str + item.ID},`
    })
    const strLength = `${str.slice(0, str.length - 1)},`
    const obj = {
      subDistrictId: EquipmentModel,
      subDistrictName: CorrelationNumber,
      detail: Correlationdetail,
      id: '',
      updateTime: ManagementUnit,
      sureId: 'addPage',
      trueId: EquipmentModel,
      unitArr: strLength,
    }
    const addImg = await this.isFormParameters(obj)
    if (!addImg) {
      this.props.getsubsaveOrUpdateForm(obj).then((res) => {
        const { code } = res.data
        if (code === 200) {
          this.handleCancel()
          message.success('添加成功')
          this.props.getLoadPlanTree()
          this.isvalidate = false
        }
      })
    }
  }
  render() {
    const {
      EquipmentModel, CorrelationNumber, IntersectionList, Correlationdetail,
      dateListValues, ManagementUnit, OptionList,
    } = this.state
    const { Option } = Select
    console.log(OptionList, 'sdfdss')
    return (
      <div className={styles.ModalPageWrapperBox}>
        <div className={styles.ModalPageWrapper}>
          <div className={styles.mountingTable}>
            <div className={styles.mountingTbody}>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span>*</span>子区域编号</div><div><Input disabled={!!this.details} name="EquipmentModel" onBlur={this.blurchange} autocomplete="off" onChange={this.changValue} value={EquipmentModel} /></div></div>
                <div className={styles.mountingTd}><div><span>*</span>子区域名称</div><div><Input name="CorrelationNumber" onChange={this.changValue} autocomplete="off" value={CorrelationNumber} /></div></div>
              </div>
              <div className={styles.mountingTr}>
                <div className={styles.mountingTd}><div><span>*</span>更新时间</div>
                  <div>
                    {/* this.formatDate(new Date() * 1) */}
                    {/* <Select
                      style={{ width: '100%' }}
                      // optionFilterProp="children"
                      value={ManagementUnit}
                      onChange={this.sInstallationLocations}
                    >
                      {SubordinateUnitLsit && SubordinateUnitLsit.map(item =>
                        <Option value={item.USER_GROUP_NAME} key={item.ID}>{item.USER_GROUP_NAME}</Option>)}
                    </Select> */}
                    {/* <DatePicker onChange={this.sInstallationLocations} /> style={{ width: '177px' }}*/}
                    <DatePicker value={moment(ManagementUnit, this.dateFormat)} format={this.dateFormat} onChange={this.sInstallationLocations} />
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
  // getloadManageMent: bindActionCreators(getloadManageMent, dispatch),
  getsubvalidate: bindActionCreators(getsubvalidate, dispatch),
  getsubloadUnitName: bindActionCreators(getsubloadUnitName, dispatch),
  getsubsaveOrUpdateForm: bindActionCreators(getsubsaveOrUpdateForm, dispatch),
})
export default connect(mapStateToProps, mapDisPatchToProps)(ModalPage)
