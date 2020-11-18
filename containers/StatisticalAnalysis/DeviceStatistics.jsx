import React from 'react'
import { Icon, Select, Input, message, Pagination, Modal, DatePicker, Radio } from 'antd'
import moment from 'moment'
import styles from './TrafficSystem.scss'
import TrafficCharts from './TrafficCharts'
import getResponseDatas from '../../utils/getResponseData'

const { Option } = Select
// 路口流量
class DeviceStatistics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: 1,
      listDatas: [['测试1', 0, 0, 0, 0], ['武鸣区', 1, 8, 0, 0], ['西乡塘区', 56, 362, 0, 54], ['ces1001', 1, 0, 0, 0], ['测试2', 1, 0, 0, 0], ['鲲鹏测试区', 1, 8, 0, 0], ['江南区', 43, 214, 0, 39], ['兴宁区', 71, 293, 0, 55], ['邕宁区', 44, 223, 0, 37], ['良庆区', 81, 434, 0, 225], ['青秀区', 159, 923, 12, 222], ['测试数据', 0, 0, 0, 0]],
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
  }
  componentDidMount = () => {
    // this.getDeptList()
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
  handleAddSum = (arr) => {
    let s = 0
    arr.forEach((val) => {
      s += val
    })

    return s
  };
  render() {
    const {
      listDatas, totalCount, current, RadioValue,
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
              <div className={`${styles.syetem_item} `}><span className={styles.item}>区域</span>
                <div className={styles.inSle}>
                  <Select
                    defaultValue="全部"
                    onChange={this.handleInputChangeUser}
                  >
                    <Option value={0} key="124ssswwwa">全部</Option>
                  </Select>
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
              <span style={{ right: '160px' }} className={styles.searchBtn} onClick={this.searchPage} limitid="24">查询</span>
              <span className={styles.searchBtn} onClick={this.exportTable} limitid="24">导出EXCEL</span>
              <i className={styles.line} />
            </div>
            <div className={styles.syetem_buttom}>
              <div className={styles.listBox}>
                {RadioValue === '2' && <TrafficCharts />}
                {RadioValue === '1' &&
                  <div className={styles.listHeader}>
                    <div className={styles.listHeaderTd} style={{ flex: 1 }}>
                      <div className={styles.HeaderTd} > 区域/设备</div>
                    </div>
                    <div className={styles.listHeaderTd} >
                      <div className={styles.HeaderTd} > 信号机</div>
                    </div>
                    <div className={styles.listHeaderTd} >
                      <div className={styles.HeaderTd} > 信号灯</div>
                    </div>
                    <div className={styles.listHeaderTd} >
                      <div className={styles.HeaderTd} > 检测器</div>
                    </div>
                    <div className={styles.listHeaderTd} >
                      <div className={styles.HeaderTd} > 其他</div>
                    </div>
                    <div className={styles.listHeaderTd} >
                      <div className={styles.HeaderTd} > 合计</div>
                    </div>
                  </div>}
                {/* listDatas */}
                {RadioValue === '1' &&
                  <div className={styles.listMain}>
                    {
                      listDatas.map((item) => {
                        return (
                          <div className={styles.listItems} key={item}>
                            {
                              item.map((its) => {
                                return <div className={styles.listTd} key={its}><span className={styles.roadName}>{its}</span></div>
                              })
                            }

                            <div className={styles.listTd}><span className={styles.roadName}>{this.handleAddSum(item.slice(1))}</span></div>
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

export default DeviceStatistics
