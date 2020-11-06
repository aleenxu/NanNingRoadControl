import React from 'react'
import $ from 'jquery'
import { DatePicker, Icon, Select, Pagination } from 'antd'
import './ControlRecord.css'
import requestBaseUrl from '../../../../../../utils/getRequestBaseUrl'

class ControlRecord extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      CtlregionList: null,
      firstCtlregionName: null,
      firstCtlregionId: null,
      InterList: null,
      isFirst: true,
      totalPage: 0,
    }
    this.areaCode = this.props.areaCode
    this.ctlregion_id = this.props.evlregionId
    this.getCtlregionUrl = `${requestBaseUrl}/dws/rdchlOperate/getCtlregionByAreaCode`
    this.getInterListUrl = `${requestBaseUrl}/dws/rdchlOperate/getInterListByCtlregionId`
    this.ControlRecordUrl = `${requestBaseUrl}/dws/evlregionOpt/getSignalControlRecord`
    this.searchParams = {
      control_time_end: '',
      control_time_start: '',
      control_type: '1',
      ctlregion_id: 'HaiDianWuXiLu',
      inter_id: '11LGP063TC0',
      pageNo: 1,
      rdchl_name: '',
      valid_time_end: '',
      valid_time_start: '',
    }
  }
  componentDidMount = () => {
    console.log(this.props)
    console.log(this.ctlregion_id)
    this.getCtlregionByAreaCode()
  }
  getSignalControlRecord = () => {
    $.ajax({
      url: this.ControlRecordUrl,
      type: 'post',
      data: this.searchParams,
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          console.log(result)
          this.setState({
            controlRecordList: result.data,
            totalPage: result.totalPage,
          })
        }
      }
    })
  }
  getCtlregionByAreaCode = () => {
    $.ajax({
      url: this.getCtlregionUrl,
      type: 'post',
      data: {area_code: this.areaCode},
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          console.log(result)
          this.searchParams.ctlregion_id = result.data[0].ctlregion_id
          this.setState({
            CtlregionList: result.data,
            firstCtlregionName: result.data[0].ctlregion_name,
            firstCtlregionId: result.data[0].ctlregion_id,
          }, () => {
            console.log(this.state.firstCtlregionId)
            this.getInterListByCtlregionId(this.state.firstCtlregionId)
          })
        }
      }
    })
  }
  getInterListByCtlregionId = (id) => {
    $.ajax({
      url: this.getInterListUrl,
      type: 'post',
      data: {ctlregion_id: id},
      success: (result) => {
        result = JSON.parse(result)
        if (result.code === '1') {
          console.log(result)
          this.searchParams.inter_id = result.data[0].inter_id
          this.setState({ InterList: result.data }, () => {
            if (this.state.isFirst) {
              this.getSignalControlRecord()
              this.setState({ isFirst: false })
            }
          })
        }
      }
    })
  }
  handleCtlregionChange = (value, options) => {
    // console.log(value, options)
    const ctrlegionId = options.key
    this.searchParams.ctlregion_id = options.key
    this.getInterListByCtlregionId(ctrlegionId)
  }
  handleTimeChange = (moment, value, timeType) => {
    // console.log(moment, value)
    this.searchParams[timeType] = value
  }
  handleInterChange = (value, options) => {
    // console.log(value, options)
    this.searchParams.inter_id = options.key
  }
  handleCotrolType = (value, options) => {
    this.searchParams.control_type = options.key
  }
  handlePageChange = (page, pageSize) => {
    this.searchParams.pageNo = page
    this.getSignalControlRecord()
  }
  closeControlRecord = () => {
    this.props.closeControlRecord()
  }
  render() {
    const { Option } = Select
    return (
      <div className="controlWrapper">
        <div className="controlBox">
          <div className="controlTitle">下发方案管理<Icon type="close" className="closeIcon" onClick={this.closeControlRecord} /></div>
          <div className="controlSearch">
            <div className="searchItem">
              <DatePicker placeholder="操作开始时间" timeName="actionBegin" onChange={(moment, value) => {this.handleTimeChange(moment, value, 'control_time_start')}} />
              -
              <DatePicker placeholder="操作结束时间" onChange={(moment, value) => {this.handleTimeChange(moment, value, 'control_time_end')}} />
            </div>
            <div className="searchItem">
              <DatePicker placeholder="生效开始时间" onChange={(moment, value) => {this.handleTimeChange(moment, value, 'valid_time_start')}} />
              -
              <DatePicker placeholder="生效结束时间" onChange={(moment, value) => {this.handleTimeChange(moment, value, 'control_time_end')}} />
            </div>
            <div className="searchItem">
              <span>子区</span>
                {
                  this.state.CtlregionList &&
                  <Select defaultValue={this.state.CtlregionList[0].ctlregion_name} onChange={this.handleCtlregionChange}>
                    {
                      this.state.CtlregionList.map((item, index) => {
                        return (
                          <Option value={item.ctlregion_name} key={item.ctlregion_id}>{item.ctlregion_name}</Option>
                        )
                      })
                    }
                  </Select>
                }
              
            </div>
            <div className="searchItem">
              <span>路口</span>
              {
                this.state.InterList &&
                <Select defaultValue={this.state.InterList[0].inter_name} onChange={this.handleInterChange}>
                  {
                    this.state.InterList.map((item, index) => {
                      return (
                        <Option value={item.inter_name} key={item.inter_id}>{item.inter_name}</Option>
                      )
                    })
                  }
                </Select>
              }
            </div>
            <div className="searchItem">
              <span>控制类型</span>
              <Select defaultValue="临时方案下发" onChange={this.handleCotrolType}>
                <Option value="临时方案下发" key="1">临时方案下发</Option>
                <Option value="临时方案下发" key="2">多时段方案下发</Option>
                <Option value="临时方案下发" key="3">离线多方案下发</Option>
                <Option value="临时方案下发" key="4">勤务口控制</Option>
              </Select>
            </div>
            <div className="searchItem">
              <div className="controlSearchBox" onClick={this.getSignalControlRecord}>
                <Icon type="search" className="conSearchIcon" />
                方案查询
              </div>
            </div>
          </div>
          <div className="controlTable">
            <div className="controlThead">
              <div className="controlTheadTh">区域</div>
              <div className="controlTheadTh">子区</div>
              <div className="controlTheadTh">干线</div>
              <div className="controlTheadTh">路口</div>
              <div className="controlTheadTh">操作时间</div>
              <div className="controlTheadTh">操作类型</div>
              <div className="controlTheadTh">生效时间</div>
              <div className="controlTheadTh">操作结果</div>
            </div>
            <div className="controlBody">
              {
                this.state.controlRecordList &&
                this.state.controlRecordList.map((item, index) => {
                  return (
                    <div className="controlTr" key={item.control_time_str}>
                      <div className="controlTd">{item.area_name}</div>
                      <div className="controlTd">{item.ctlregion_name}</div>
                      <div className="controlTd">{item.rdchl_name}</div>
                      <div className="controlTd">{item.unit_name}</div>
                      <div className="controlTd">{item.control_time_str}</div>
                      <div className="controlTd">{item.control_type_name}</div>
                      <div className="controlTd">{item.valid_data_str}</div>
                      <div className="controlTd">{item.control_result_name}</div>
                    </div>
                  )
                })
              }
              
            </div>
          </div>
          <div className="pageNationBox">
            <div className="pageNation">
              <Pagination defaultCurrent={1} total={this.state.totalPage} onChange={this.handlePageChange} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ControlRecord

