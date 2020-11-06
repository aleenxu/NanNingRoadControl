import React from 'react'
import styles from './Intersection.scss'
import { Select } from 'antd'
import echarts from 'echarts'
import RegularCrossing from '../img/03.png'
import KeyIntersection from '../img/04.png'

class Intersection extends React.Component {
  constructor(props) {
    super(props)
    const { itemList, isBtnShow } = this.props
    this.state = {
      itemList,
      options: {
        tooltip: {
          // position: 'left',
          // formatter: `{a} <br/>{b} : {c}${123}`,
        },
        series: [{
          name: '',
          textStyle: {
            fontSize: '10px',
            color: '#fff',
          },
          type: 'gauge',
          // 仪表盘详情，用于显示数据
          // 刻度
          splitNumber: 10,
          min: 10,
          max: 100,
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [0.2, '#6F962B'],
                [0.4, '#A1EC20'],
                [0.6, '#EDED36'],
                [0.8, '#F1CD16'],
                [1.0, '#F13F16'],
              ],
              width: 4,
            },
          },
          axisLabel: { // 刻度标签。
            show: false, // 是否显示标签,默认 true。
          },
          axisTick: { // 坐标轴小标记
            show: false, // 属性show控制显示与否，默认不显示
            splitNumber: 5, // 每份split细分多少段
            length: 12, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: 'red',
              width: 1,
              type: 'solid',
            },
          },
          splitLine: { // 分隔线
            length: 7, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              color: '#F1EC2F',
            },
          },
          title: {
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 12,
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          pointer: {
            // width: 5
          },

          // data: [{value: 50, name: '完成率'}]
          // detail: {
          //   show: false,
          //   offsetCenter: [0, '50%'],

          //   formatter: '{value}%'
          // },
          detail: {
            show: false, // 隐藏仪表盘内容
            textStyle: {
              fontSize: 12,
              color: '#E7D21D',
            },
            // formatter: `{value}${13246}`,
          },
          data: [{
            value: isBtnShow ? itemList.reverseSpeed : itemList.forwordSpeed,
            name: '速度',
          }],
        }],
        // series: [
        //     {
        //         name: '业务指标',
        //         min: 10,
        //         max: 200,
        //         type: 'gauge',
        //         detail: { formatter: '{value}%' },
        //         data: [{ value: 20, name: '完成率' }]
        //     }
        // ]
      },
    }
  }
  componentDidMount = () => {
    const { options } = this.state
    const myChart = echarts.init(this.brokens)
    myChart.setOption(options)
  }
  componentDidUpdate = (nextProps) => {
    const { isBtnShow } = this.props
    if (nextProps.isBtnShow !== isBtnShow) {
      this.getNewisBtnShow(isBtnShow)
    }
  }
  getNewisBtnShow = (isBtnShow) => {
    const { options } = this.state
    const { itemList } = this.props
    if (isBtnShow) {
      options.series[0].data[0].value = itemList.reverseSpeed
      this.setState({ options })
    } else {
      options.series[0].data[0].value = itemList.forwordSpeed
      this.setState({ options })
    }
  }
  render() {
    const { Option } = Select
    const { itemList } = this.state
    console.log(itemList)
    return (
      <div className={styles.IntersectionItem}>
        <dl className={styles.IntersectionItem_top}>
          <dt><span><img src={itemList.is_key_inter === '0' ? RegularCrossing : KeyIntersection} alt="" /></span></dt>
          <dd>{itemList.name}</dd>
        </dl>
        <div className={styles.IntersectionItem_bom}>
          <div className={styles.IntersectionItem_bomLeft}>
            <dl>
              <dt>实时相位差</dt>
              <dd><span>{itemList.real_offset}<b> 秒</b></span></dd>
            </dl>
            <dl>
              <dt>建议相位差</dt>
              <dd><span>{itemList.offset}<b> 秒</b></span></dd>
            </dl>
            <dl>
              <dt>偏移</dt>
              <dd><span>{itemList.real_offset - itemList.offset}<b> 秒</b></span></dd>
            </dl>
            <dl>
              <dt>协调相位</dt>
              <dd><span>{itemList.phase_name}</span></dd>
            </dl>
          </div>
          <div className={styles.IntersectionItem_bomRight}>
            <div ref={(input) => { this.brokens = input }} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
    )
  }
}

export default Intersection
