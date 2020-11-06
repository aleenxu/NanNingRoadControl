import React from 'react'
import echarts from 'echarts'

class roadCharts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      legend: null,
      series: null,
      nodata: true,
    }
    this.keyNum = Math.random()
  }
  componentDidMount = () => {
    const datas = this.props.chartsData
    if (!!datas && datas.time.length > 0) {
      this.setState({ nodata: false }, () => {
        const chartsBox = echarts.init(this.chartsBox)
        this.renderCharts(chartsBox, datas.legend, datas.time, datas.series, this.props.title)
      })
    } else {
      this.setState({ nodata: true })
    }
  }
  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps)
    const datas = nextProps.chartsData
    if (!!datas && datas.time.length > 0) {
      this.setState({ nodata: false }, () => {
        const chartsBox = echarts.init(this.chartsBox)
        this.renderCharts(chartsBox, datas.legend, datas.time, datas.series, nextProps.title)
      })
    } else {
      this.setState({ nodata: true })
    }
  }
  renderCharts = (menuChart2, legend, time, series, title) => {
    console.log(legend, time, series)
    // 绘制图表
    const options = {
      noDataLoadingOption: {
        text: '暂无数据',
        effect: 'bubble',
        effectOption: {
          effect: {
            n: 0,
          },
        },
      },
      title: {
        text: title,
        y: '15px',
        subtext: '',
        textStyle: {
          fontSize: 15,
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      toolbox: {
        show: true,
        right: 80,
        top: 10,
        feature: {
          magicType: { show: true, type: ['line', 'bar'] },
        },
        iconStyle: {
          normal: {
            color: 'white',//设置颜色
          },
        },
      },
      grid: {
        left: '2%',
        right: '6%',
        bottom: '9%',
        top: '23%',
        containLabel: true,
      },
      legend: {
        // data: ['东进口左转', '东进口直行', '东南进口左转', '东南进口直行', '西南进口左转', '西南进口直行', '西北进口左转', '西北进口直行', '西北进口左转1', '西北进口直行1'],
        data: legend,
        x: 'center',
        y: '15px',
        textStyle: {
          top: 10,
          color: '#fff',
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          // data: ['10:50', '10:55', '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50'],
          data: time,
          axisLabel: {//X轴文字
            textStyle: {
              fontSize: 12,
              color: '#fff',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {//Y轴刻度值
            formatter: '{value}',
            textStyle: {
              fontSize: 12,
              color: '#fff',
            },
          },
        },
      ],
      // series: [
      //   {
      //     name: '东进口左转',
      //     type: 'bar',
      //     data: [2.0, 4.9, 1.0, 33.2, 25.6, 75.7, 25.6, 162.2, 32.6, 20.0, 6.4, 3.3, 33]
      //   }
      // ]
      series,
    }
    menuChart2.setOption(options, true)
  }
  render() {
    if (!this.state.nodata) {
      return (
        <div ref={(input) => { this.chartsBox = input }} style={{ width: '100%', height: '260px' }} key={this.keyNum + this.props.title} />
      )
    }
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        暂无数据
        <div style={{ position: 'absolute', top: '10px', left: '20px' }}>{this.props.title}</div>
      </div>
    )
  }
}

export default roadCharts
