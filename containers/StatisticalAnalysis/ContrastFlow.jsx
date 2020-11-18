import React from 'react'
import { Icon, Select, Input, message, Pagination, Modal, DatePicker, Radio } from 'antd'
import moment from 'moment'
import styles from './TrafficSystem.scss'
import TrafficCharts from './TrafficCharts'
import getResponseDatas from '../../utils/getResponseData'

const { Option } = Select
// 流量对比
class ContrastFlow extends React.Component {
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
    this.ListTitle = ['流量（辆/小时）', '占有率（%）']
    this.ListTitleChildren = ['2020-11-03', '2020-11-04', '2020-11-04同比', '2020-10-27', '2020-10-27同比']
    this.dateFormat = 'YYYY-MM-DD'
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
            <div className={styles.syetem_top}>
              <div className={`${styles.syetem_item} `}><span className={styles.item}>统计类型</span>
                <div className={styles.inSle}>
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUser}
                  >
                    <Option value={0} key="124ssswwwa">全部</Option>
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item} `}><span className={styles.item}>统计路口</span>
                <div className={styles.inSle}>
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUser}
                  >
                    <Option value={0} key="124ssswwwa">全部</Option>
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item} `}><span className={styles.item}>报表类型</span>
                <div className={styles.inSle}>
                  <Radio.Group defaultValue="1">
                    <Radio value="1">日报表</Radio>
                    <Radio value="2">月报表</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className={`${styles.syetem_item} `}><span className={styles.item}>数据间隔</span>
                <div className={styles.inSle}>
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUserGroups}
                  >
                    <Option value={0} key="124ssswwwas">全部</Option>
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item}`}><span className={styles.item}>统计日期</span>
                <div style={{ marginRight: '20px' }} className={styles.inSle}>
                  <DatePicker style={{ width: '200px' }} value={moment(ManagementStart, this.dateFormat)} format={this.dateFormat} onChange={this.sInstallationLocationsStart} />
                </div>
              </div>
              <div className={`${styles.syetem_item} `}><span className={styles.item}>统计方式</span>
                <div className={styles.inSle} onChange={(e) => { this.setState({ RadioValue: e.target.value }) }}>
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>数据表</Radio>
                    <Radio value={2}>Echarts表</Radio>
                  </Radio.Group>
                </div>
              </div>

              <i className={styles.line} />
            </div>
            <div className={styles.syetem_top}>
              <div className={`${styles.syetem_item}`}><span className={styles.item}>对比日期</span>
                <div style={{ marginRight: '20px' }} className={styles.inSle}>
                  <DatePicker style={{ width: '200px' }} value={moment(ManagementUnit, this.dateFormat)} format={this.dateFormat} onChange={this.sInstallationLocationsEnd} />
                </div>
                <Icon type="plus-circle" className={styles.plusCircle} />
              </div>
              <span style={{ right: '160px' }} className={styles.searchBtn} onClick={this.searchPage} limitid="24">查询</span>
              <span className={styles.searchBtn} onClick={this.exportTable} limitid="24">导出EXCEL</span>
              <i className={styles.line} />
            </div>
            <div className={styles.syetem_buttom}>
              <div className={styles.listBox}>
                {RadioValue === '2' && <TrafficCharts />}
                {RadioValue === '1' &&
                  <div className={styles.listHeader}>
                    {/* <div className={styles.listHeaderTd} >
                      <div className={styles.HeaderTd} > 时段</div>
                    </div> */}
                    {
                      this.ListTitle.map((item) => {
                        return (
                          <div className={styles.listHeaderTd} key={item} style={{ flex: 1 }}>
                            <div className={styles.HeaderTd} > {item}</div>
                            <div className={styles.HeaderTd} >
                              {
                                this.ListTitleChildren.map((it) => {
                                  return <div key={it} className={styles.listTd}>{it}</div>
                                })
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>}
                {/* listDatas */}
                {RadioValue === '1' &&
                  <div className={styles.listMain}>
                    {
                      [1, 6, 7, 8, 9].map((item) => {
                        return (
                          <div className={styles.listItems} key={item}>
                            <div className={styles.listTd} ><span className={styles.roadName}>0.1{item}</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>0.3{item}</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>0.1{item}</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>0.6{item}</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>0.1{item}</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>{item}.12</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>{item}.82</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>{item}.45</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>{item}.92</span></div>
                            <div className={styles.listTd} ><span className={styles.roadName}>{item}.12</span></div>
                          </div>)
                      })
                    }
                    {
                      (!!listDatas && listDatas.length === 0) ? <div className={styles.noData}>当前查询无数据</div> : null
                    }
                  </div>}
              </div>
            </div>
          </div>
          <div className={styles.pagination}>
            <div className={styles.page}><span className={styles.count}>当前共{totalCount}条，每页显示10条</span><Pagination showQuickJumper current={current} total={totalCount} onChange={this.handlePagination} /></div>
          </div>
        </div>
      </div>
    )
  }
}

export default ContrastFlow
