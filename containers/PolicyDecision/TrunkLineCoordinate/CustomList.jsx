import React from 'react'
import { Icon, Select, Input, message, Pagination, Modal, DatePicker, Radio } from 'antd'
import moment from 'moment'
import styles from '../../StatisticalAnalysis/TrafficSystem.scss'
import getResponseDatas from '../../../utils/getResponseData'

const { Option } = Select
class RoadTraffic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: 1,
      listDatas: null,
      current: 1,
      ManagementStart: '2019-01-01 00:00:00',
      ManagementUnit: this.formatDate(new Date() * 1),
      RadioValue: '1',
    }
    this.deptListUrl = '/simulation/sys/dept/listPage'
    this.listParams = {
      keyword: '',
      pageNo: 1,
    }
    this.dateFormat = 'YYYY-MM-DD'
    this.data = [[301, "123", null, null, "2020-11-17 17:46:32", "管理员", 0], [261, "测试路线-鲲鹏", 1000, null, "2020-11-03 11:44:30", "管理员", 0], [81, "凤凰-云景三路口协调", 1000, null, "2020-11-03 11:41:55", "管理员", 0], [221, "测试3", null, null, "2020-10-26 10:06:43", "管理员", 0], [121, "测试 ", 1000, "测试1", "2020-10-24 10:17:52", "管理员", 0], [1, "滨湖长湖等三个路口协调", null, null, "2020-09-11 12:50:52", "管理员", 1], [3, "金湖祥宾-悦宾祥宾协调", 442, "博研信号机与泰尔文特信号机协调测试", "2020-07-02 00:12:28", "管理员", 1], [2, "长湖茶花园-长湖滨湖协调", null, null, "2020-06-17 00:00:00", null, 1]]
    this.ListTitle = ['干线名称', '干线里程', '描述', '制定时间', '制定人', '任务状态', '操作']
  }
  componentDidMount = () => {
    this.getDeptList()
  }
  getDeptList = () => {
    getResponseDatas('post', this.deptListUrl, this.getFormData(this.listParams)).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        this.setState({
          listDatas: data.list,
          totalCount: data.totalCount,
          current: Number(this.listParams.pageNo)
        })
      }
    })
  }

  // 转格式
  getFormData = (obj) => {
    const formData = new FormData()
    Object.keys(obj).forEach((item) => {
      formData.append(item, obj[item])
    })
    console.log(formData)
    return formData
  }

  handleGroupMsgChange = (e) => {
    const value = typeof (e) === 'object' ? e.target.value : e
    console.log(value)
  }

  handleChangePage = (page) => {
    this.listParams.pageNo = page
    this.getDeptList()
  }
  handleKeywordChange = (e) => {
    const { value } = e.target
    this.listParams.keyword = value
  }
  handlePagination = (pageNumber) => {
    console.log('Page: ', pageNumber)
    this.listParams.pageNo = pageNumber
    this.getDeptList()
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
  render() {
    const {
      listDatas, totalCount, current, ManagementStart, ManagementUnit, RadioValue,
    } = this.state
    console.log(RadioValue)
    return (
      <div className={(styles.Roadtcontent)}>
        {/* 地图 */}
        <div id="mapContainer" className={styles.mapContainer} >
          <div className={styles.syetem_bg}>
            <div className={styles.syetem_title}>
              协调路线管理
            </div>
            <div className={styles.syetem_top}>
              <div className={`${styles.syetem_item} `}><span className={styles.item}>关键词查询</span>
                <div className={styles.inSle}>
                  <Input placeholder="" />
                </div>
              </div>

              <div className={`${styles.syetem_item} `}><span className={styles.item}>任务状态</span>
                <div className={styles.inSle}>
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUserGroups}
                  >
                    <Option value={0} key="124ssswwwas">全部</Option>
                  </Select>
                </div>
              </div>
              <i className={styles.line} />
            </div>
            <div className={styles.syetem_top}>
              <span style={{ right: '160px' }} className={styles.searchBtn} onClick={this.searchPage} limitid="24">查询</span>
              <span className={styles.searchBtn} onClick={this.exportTable} limitid="24">导出EXCEL</span>
              <span className={styles.searchBtn} style={{ right: '290px' }}>添加</span>
              <i className={styles.line} />
            </div>
            <div className={styles.syetem_buttom}>
              <div className={styles.listBox}>

                <div className={styles.listHeader}>
                  {
                    this.ListTitle.map((item) => {
                      return (
                        <div className={styles.listHeaderTd} key={item} style={{ flex: 1 }}>
                          <div className={styles.HeaderTd} > {item}</div>
                        </div>
                      )
                    })
                  }
                </div>
                {/* listDatas */}

                <div className={styles.listMain}>
                  {
                    this.data.map((item) => {
                      return (
                        <div className={styles.listItems} key={item}>

                          {
                            item.slice(1).map((its) => {
                              return <div key={its} className={styles.listTd} ><span className={styles.roadName}>{its}</span></div>
                            })
                          }
                          <div className={styles.listTd} >
                            <span className={styles.updateName}> 修改 </span>
                            <span className={styles.delectName}> 删除 </span>
                          </div>
                        </div>)
                    })
                  }
                  {
                    (!!listDatas && listDatas.length === 0) ? <div className={styles.noData}>当前查询无数据</div> : null
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={styles.pagination}>
            <div className={styles.page}><span className={styles.count}>当前共{totalCount}条，每页显示10条</span><Pagination showQuickJumper current={current} total={totalCount} onChange={this.handlePagination} /></div>
          </div>
        </div>
      </div >
    )
  }
}

export default RoadTraffic
