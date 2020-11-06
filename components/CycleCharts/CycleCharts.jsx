import React from 'react'
// 引入 ECharts 主模块
import echarts from 'echarts'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    const myCharts = echarts.init(this.chartsBox)
    const { title, value } = this.props
    this.renderCharts(myCharts, title, value)
  }
  renderCharts = (myCharts, title, datas) => {
    const options = {
      title: {
        text: title,
        x: 'center',
        bottom: '20',
        textStyle: {
          color: '#5F9FDC',
          fontSize: 14,
          align: 'right',
        },
      },
      series: [{
        name: '',
        textStyle: {
          color: '#fff',
        },
        type: 'gauge',
        // 仪表盘详情，用于显示数据。
        // 刻度
        splitNumber: 10,
        min: 0,
        max: 10,
        axisLine: { // 坐标轴线
          lineStyle: { // 属性lineStyle控制线条样式
            color: [
              [0.2, '#6F962B'],
              [0.4, '#A1EC20'],
              [0.6, '#EDED36'],
              [0.8, '#F1CD16'],
              [1.0, '#F13F16'],

            ],
            width: 10,
          },
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
          },
          iconStyle: {
            normal: {
              color: 'white', // 设置颜色
            },
          },
        },
        axisTick: { // 坐标轴小标记
          show: true, // 属性show控制显示与否，默认不显示
          splitNumber: 5, // 每份split细分多少段
          length: 15, // 属性length控制线长
          lineStyle: { // 属性lineStyle控制线条样式
            color: '#eee',
            width: 1,
            type: 'solid',
          },
        },
        splitLine: { // 分隔线
          length: 15, // 属性length控制线长
          lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto',
          },
        },
        pointer: {
          width: 5,
        },
        detail: {
          show: true,
          offsetCenter: [0, '50%'],
          textStyle: {
            fontSize: 16,
            color: '#6F962B',
          },
        },
        // data: [datas],
        data: [{ value: datas, name: '' }],
      }],
    }
    myCharts.setOption(options)
  }
  render() {
    return (
      <div style={{ width: '240px', height: '220px', display: 'flex', justifyContent: 'center' }} ref={(input) => { this.chartsBox = input }} />
    )
  }
}

export default Dashboard
