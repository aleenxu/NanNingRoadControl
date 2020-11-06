import React from 'react'
import echarts from 'echarts'

class PieCharts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.boxStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
  componentDidMount = () => {
    const { chartsData, stateAnalysis } = this.props
    if (chartsData.length) {
      const chartsBox = echarts.init(this.chartsBox)
      const seriesData = chartsData.map((item) => {
        const states = stateAnalysis.find(state => state.CONTROL_STATE === item.C_CODE)
        return { name: item.CODE_NAME, value: states ? states.CSIZE : 0 }
      })
      this.renderCharts(chartsBox, seriesData)
    }
  }
  componentDidUpdate = (prevState) => {
    const { chartsData, stateAnalysis } = this.props
    if (chartsData.length) {
      const chartsBox = echarts.init(this.chartsBox)
      const seriesData = chartsData.map((item) => {
        const states = stateAnalysis.find(state => state.CONTROL_STATE === item.C_CODE)
        return { name: item.CODE_NAME, value: states ? states.CSIZE : 0 }
      })
      this.renderCharts(chartsBox, seriesData)
    }
  }
  renderCharts = (chartsBox, seriesData) => {
    const options = {
      title: {
        show: false,
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        show: false,
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '45%'],
          // data: [
          //   { value: 335, name: '直接访问' },
          //   { value: 310, name: '邮件营销' },
          //   { value: 234, name: '联盟广告' },
          //   { value: 135, name: '视频广告' },
          //   { value: 1548, name: '搜索引擎' },
          // ],
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      color: [ // 自定义的颜色
        '#58DD2C',
        '#7C0000',
        '#E8A000',
        '#8819CF',
        '#1869F2',
        '#01C9FD',

      ],
    }
    chartsBox.setOption(options, true)
  }
  render() {
    return (
      <div style={this.boxStyle} ref={(input) => { this.chartsBox = input }}>123</div>
    )
  }
}

export default PieCharts
