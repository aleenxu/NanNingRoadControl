import React from 'react'
import echarts from 'echarts'

class HollowPie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount = () => {
    const chartsBox = echarts.init(this.chartsBox)
    const { seriseData, totleDevice } = this.props.chartsDatas
    this.renderCharts(chartsBox, seriseData, totleDevice)
  }
  renderCharts = (chartsBox, serise, totle) => {
    const options = {
      color: ['#00cf4d', '#d3692f', '#0f85ff', '#00E8FF'],
      title: {
        show: false,
        text: '信号机实时状态统计',
        padding: [5, 0, 0, 20],
        textStyle: {
          fontWeight: 'normal',
          color: '#FFFFFF',
        },
      },
      graphic: {
        type: 'text',
        left: 'center',
        bottom: '33%',
        style: {
          text: ` ${totle}处  \n  ${'信号机总数'}  \n\n`,
          textAlign: 'center',
          fontSize: 14,
          // font: 'italic bolder 30px cursive',
          fill: '#fff',
          width: 30,
          height: 30,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 10,
      //   data: ['离线设备', '在线设备', '异常设备'],
      // },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          itemStyle: {
            normal: {
              color(params) {
                // 自定义颜色
                const colorList = ['#C99D27', '#456FB5', '#0f85ff', '#00E8FF']
                return colorList[params.dataIndex]
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: serise,
          // data: [
          //   { value: 332, name: '离线设备' },
          //   { value: 55, name: '异常设备' },
          //   { value: 88, name: '在线设备' },
          // ],
        },
      ],
    }
    chartsBox.setOption(options, true)
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }} ref={(input) => { this.chartsBox = input }} />
    )
  }
}

export default HollowPie
