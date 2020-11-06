import React from 'react'
import $ from 'jquery'
import './GreenWaveCharts.css'


class GreenWaveCharts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      svgs: null,
      reverseSvgs: null,
      publicSvgs: null,
      reversePlubSvgs: null,
    }
    this.W = 950 // 容器width
    this.H = 345  // 容器height
    this.xAxis = this.props.totleDistance // x轴的总距离（后期表示数据中各个路口距离之和）
    this.yAxis = 400 // y轴的总时间s
    this.Hs = this.H / this.yAxis // 每秒所占px值
    this.Ws = this.W / this.xAxis // 每千米所占px值
    this.ySplit = 10 // y轴分10份
    this.ySplitS = this.yAxis / this.ySplit // y轴每份的秒数
    this.yScaleH = this.Hs * this.ySplitS // y轴每个刻度的高度
    this.xSplit = 5 // x轴分5份
    this.xSplitD = this.xAxis / this.xSplit // x轴每份的距离
    this.xScaleW = this.Ws * this.xSplitD // x轴每个刻度的宽度
    this.cycleTime = 196 // 路口周期时长（后期获取各路口中的phaseList中的cycle_time）
    this.greenTime = 40 // 路口绿灯时长 （后期获取各个路口中的phaseList中的spliteTIme）
    this.redTime = this.cycleTime - this.greenTime // 红灯时长
    this.xAxisArr = [] // new Array(this.xSplit).fill(0)
    this.yAxisArr = new Array(this.ySplit).fill(0)
    this.repeatBox = new Array(3).fill(0)
    this.len = 0 // 路口到0点的距离
    this.unitMsg = []
    this.greenPositions = []
    this.reversePositions = []
    this.svgs = []
    this.publicSvgs = []
    this.reverseSvgs = []
    this.reversePlubSvgs = []
    this.cycleNumArr = []
    this.reverseCycleNumArr = []
    this.reverseWave = []
  }
  componentDidMount = () => {
    this.prevTime = 0
    this.reversePrevTime = 0
    this.greenPositions = []
    this.reversePositions = []
    this.svgs = []
    this.reverseSvgs = []
    this.cycleNumArr = []
    this.reverseCycleNumArr = []
    this.reverseWave = []
    this.getGreenWaveCharts(this.props.chartsData)
  }
  componentWillReceiveProps = (nextProps) => {
    this.prevTime = 0
    this.reversePrevTime = 0
    this.greenPositions = []
    this.reversePositions = []
    this.svgs = []
    this.reverseSvgs = []
    this.cycleNumArr = []
    this.reverseCycleNumArr = []
    this.reverseWave = []
    this.setState({
      svgs: null,
      reverseSvgs: null,
      publicSvgs: null,
      reversePlubSvgs: null,
    }, () => {
      this.getGreenWaveCharts(nextProps.chartsData)
    })
  }
  getGreenWaveCharts = (chartsData) => {
    // 获取正向绿波坐标点
    this.interLen = 0
    this.reversePrevTime = 0
    this.offsetTime = 0
    this.reverseOffsetTime = 0
    this.positions = []
    this.reversePoints = []
    this.cycleTime = 0
    chartsData.forEach((item, index) => {
      this.xAxisArr.push(item.lenAll) // 路口距离。做横坐标刻度显示
      this.cycleTime = item.cycle_time > this.cycleTime ? item.cycle_time : this.cycleTime
      if (item.cycle_time !== '' && item.phaseList.length > 0) {
        const forwardOffset = parseFloat(item.forward_offset) // 相位差时间，转为px，就是当前路口的绿波起点，leftBottom
        if (index === 0) {
          this.forwardOffset = forwardOffset < 0 ? forwardOffset + parseFloat(item.cycle_time) : forwardOffset
          this.offsetTime = this.forwardOffset
        }
        const prevEle = $('#phaseBox' + index).prevAll()
        if (prevEle.length > 0) { // 当前协调不是相位列表中的第一个时，起始位置的偏移要减去协调相位box之前所有元素的高度
          this.prevEleHeight = 0
          $(prevEle).each((index, items) => {
            this.prevEleHeight += $(items).height()
          })
        } else {
          this.prevEleHeight = 0
        }
        $('#phaseBox' + index).closest('.repeatBox')[0].style.bottom = forwardOffset * this.Hs - this.prevEleHeight + 'px' // 设置协调相位的偏移
        if (index !== chartsData.length - 1 && chartsData[index + 1].phaseList.length > 0) {
          const nextForwarSpeed = parseFloat(chartsData[index + 1].forwordSpeed)
          const interLen = parseFloat(item.lenAll)
          const nextLen = parseFloat(chartsData[index + 1].lenAll)
          const disTime = (nextLen - interLen) / (nextForwarSpeed / 3.6) // 行程时间
          // 开始计算位置点
          const leftBottom = 345 - (index === 0 ? this.forwardOffset * this.Hs : this.offsetTime * this.Hs) // 当前路口的绿波起点
          const rightBottom = 345 - ((disTime + this.offsetTime) * this.Hs) // 下一个路口的绿波起点
          const phaseTime = (chartsData[index].phaseList.filter(phaseItem => chartsData[index].forward_phase_plan_name === phaseItem.phase_name))[0].split_time // 当前路口的协调相位时间
          // (disTime + this.offsetTime) 下个路口的起始时间
          const rightTop = 345 - ((disTime + this.offsetTime + parseFloat(phaseTime)) * this.Hs)
          const leftTop = (leftBottom + (rightTop - rightBottom))
          const interLeft = item.lenAll * this.Ws
          const nextInterLeft = chartsData[index + 1].lenAll * this.Ws
          // 各路口协调相位的开始和结束位置，为了计算公共部分绿波带
          const leftStart = item.forward_offset >= 0 ? 345 - (item.forward_offset * this.Hs) : 345 - ((item.cycle_time + item.forward_offset) * this.Hs)
          const leftEnd = leftStart - $('#phaseBox' + index).height()
          const rightStart = chartsData[index + 1].forward_offset >= 0 ? 344 - (chartsData[index + 1].forward_offset * this.Hs) : 344 - ((chartsData[index + 1].cycle_time + chartsData[index + 1].forward_offset) * this.Hs)
          const rightEnd = rightStart - $('#phaseBox' + (index + 1)).height()
          const obj = {
            leftBottom,
            rightBottom,
            rightTop,
            leftTop,
            bottomLeft: interLeft,
            topLeft: interLeft,
            bottomRight: nextInterLeft,
            topRight: nextInterLeft,
            leftStart,
            leftEnd,
            rightStart,
            rightEnd,
          }
          this.offsetTime += disTime
          this.positions.push(obj)
        }
        const num = (this.H / (item.cycle_time * this.Hs)) // 周期循环个数
        this.cycleNumArr.push(Math.floor(num))
      }
    })
    // 获取反向绿波坐标点 px
    for (let i = chartsData.length - 1; i >= 0; i--) {
      const reverseChartsData = chartsData[i]
      console.log(reverseChartsData)

      if (reverseChartsData.cycle_time !== '' && reverseChartsData.phaseList.length > 0) {
        const reverseOffset = parseFloat(reverseChartsData.reverse_offset) // 相位差时间，转为px，就是当前路口的绿波起点，leftBottom
        if (i === chartsData.length - 1) {
          this.reverseOffset = reverseOffset < 0 ? reverseOffset + parseFloat(reverseChartsData.cycle_time) : reverseOffset
          this.reverseOffsetTime = this.reverseOffset
        }
        const prevEle = $('#reversePhaseBox' + i).prevAll()
        if (prevEle.length > 0) { // 当前协调不是相位列表中的第一个时，起始位置的偏移要减去协调相位box之前所有元素的高度
          this.reversePrevEleHeight = 0
          $(prevEle).each((index, items) => {
            this.reversePrevEleHeight += $(items).height()
          })
        } else {
          this.reversePrevEleHeight = 0
        }
        $('#reversePhaseBox' + i).closest('.repeatBox')[0].style.bottom = reverseOffset * this.Hs - this.reversePrevEleHeight + 'px' // 设置协调相位的偏移
        if (i !== 0 && chartsData[i - 1].phaseList.length > 0) {
          const nextReverseSpeed = parseFloat(chartsData[i - 1].reverseSpeed)
          const interLen = parseFloat(reverseChartsData.lenAll)
          const nextLen = parseFloat(chartsData[i - 1].lenAll)
          const disTime = (interLen - nextLen) / (nextReverseSpeed / 3.6) // 行程时间
          // 开始计算位置点
          const leftBottom = 345 - (i === chartsData.length - 1 ? this.reverseOffset * this.Hs : this.reverseOffsetTime * this.Hs) // 当前路口的绿波起点
          const rightBottom = 345 - ((disTime + this.reverseOffsetTime) * this.Hs) // 下一个路口的绿波起点
          const phaseTime = (chartsData[i - 1].phaseList.filter(phaseItem => chartsData[i - 1].reverse_phase_plan_name === phaseItem.phase_name))[0].split_time // 当前路口的协调相位时间
          // (disTime + this.offsetTime) 下个路口的起始时间
          const rightTop = 345 - ((disTime + this.reverseOffsetTime + parseFloat(phaseTime)) * this.Hs)
          const leftTop = (leftBottom + (rightTop - rightBottom))
          const interLeft = (reverseChartsData.lenAll * this.Ws) + 20
          const nextInterLeft = (chartsData[i - 1].lenAll * this.Ws) + 20
          // 各路口协调相位的开始和结束位置，为了计算公共部分绿波带
          const leftStart = reverseChartsData.reverse_offset >= 0 ? 345 - (reverseChartsData.reverse_offset * this.Hs) : 345 - ((reverseChartsData.cycle_time + reverseChartsData.reverse_offset) * this.Hs)
          const leftEnd = leftStart - $('#reversePhaseBox' + i).height()
          const rightStart = chartsData[i - 1].reverse_offset >= 0 ? 344 - (chartsData[i - 1].reverse_offset * this.Hs) : 344 - ((chartsData[i - 1].cycle_time + chartsData[i - 1].reverse_offset) * this.Hs)
          const rightEnd = rightStart - $('#reversePhaseBox' + (i - 1)).height()
          const obj = {
            leftBottom,
            rightBottom,
            rightTop,
            leftTop,
            bottomLeft: interLeft,
            topLeft: interLeft,
            bottomRight: nextInterLeft,
            topRight: nextInterLeft,
            leftStart,
            leftEnd,
            rightStart,
            rightEnd,
          }
          this.reverseOffsetTime += disTime
          console.log('反向：：：：：：', obj)
          this.reversePoints.push(obj)
        }
      }
    }
    // 正向绿波
    this.cycleNum = Math.max.apply(null, this.cycleNumArr)
    this.positions.forEach((points) => {
      for (let i = 0; i < this.cycleNum; i++) {
        const repeatH = (this.cycleTime * i) * this.Hs
        const leftBottom = points.leftBottom - repeatH
        const rightBottom = points.rightBottom - repeatH
        const leftTop = points.leftTop - repeatH
        const rightTop = points.rightTop - repeatH
        const obj = { leftBottom, rightBottom, leftTop, rightTop, bottomLeft: points.bottomLeft, topLeft: points.topLeft, bottomRight: points.bottomRight, topRight: points.topRight }
        this.svgs.push(obj)
        const { leftStart, leftEnd, rightStart, rightEnd } = points
        if (points.leftBottom >= leftEnd && points.leftTop <= leftStart && points.rightBottom >= rightEnd && points.rightTop <= rightStart) {
          const { bottomLeft, bottomRight } = points
          let leftB = (points.leftBottom <= leftStart ? points.leftBottom : leftStart)
          let leftT = (points.leftTop >= leftEnd ? points.leftTop : leftEnd)
          let rightB = (points.rightBottom <= rightStart ? points.rightBottom : rightStart)
          let rightT = (points.rightTop >= rightEnd ? points.rightTop : rightEnd)
          // 计算左右两侧的最小公共部分， 若不计算则画出的是不规则的四边形
          const leftDifferB = points.leftBottom - leftB
          const leftDifferT = points.leftTop - leftT
          const rightDifferB = points.rightBottom - rightB
          
          if (leftDifferB < rightDifferB) {
            leftB = points.leftBottom - rightDifferB
          } else if (rightDifferB < leftDifferB) {
            rightB = points.rightBottom - leftDifferB
          }
          rightT = points.rightTop - leftDifferT > rightEnd ? points.rightTop - leftDifferT : rightEnd
          if (points.rightTop - leftDifferT < rightEnd) {
            leftT = leftB - (rightB - rightT)
          }
          const pubLicPint = {
            leftBG: leftB - repeatH, rightBG: rightB - repeatH, leftTG: leftT - repeatH, rightTG: rightT - repeatH, bottomLeft, bottomRight,
          }
          this.publicSvgs.push(pubLicPint)
        }
      }
    })
    console.log('公共绿波部分正向：：：：', this.publicSvgs)
    this.setState({ svgs: this.svgs, publicSvgs: this.publicSvgs })

    // 反向绿波
    this.reversePoints.forEach((points) => {
      for (let i = 0; i < this.cycleNum; i++) {
        const repeatH = (this.cycleTime * i) * this.Hs
        const leftBottom = points.leftBottom - repeatH
        const rightBottom = points.rightBottom - repeatH
        const leftTop = points.leftTop - repeatH
        const rightTop = points.rightTop - repeatH
        const obj = { leftBottom, rightBottom, leftTop, rightTop, bottomLeft: points.bottomLeft, topLeft: points.topLeft, bottomRight: points.bottomRight, topRight: points.topRight }
        this.reverseSvgs.push(obj)
        const { leftStart, leftEnd, rightStart, rightEnd } = points
        if (points.leftBottom >= leftEnd && points.leftTop <= leftStart && points.rightBottom >= rightEnd && points.rightTop <= rightStart) {
          const { bottomLeft, bottomRight } = points
          let leftB = (points.leftBottom <= leftStart ? points.leftBottom : leftStart)
          let leftT = (points.leftTop >= leftEnd ? points.leftTop : leftEnd)
          let rightB = (points.rightBottom <= rightStart ? points.rightBottom : rightStart)
          let rightT = (points.rightTop >= rightEnd ? points.rightTop : rightEnd)
          // 计算左右两侧的最小公共部分， 若不计算则画出的是不规则的四边形
          const leftDifferB = points.leftBottom - leftB
          const leftDifferT = points.leftTop - leftT
          const rightDifferB = points.rightBottom - rightB
          
          if (leftDifferB < rightDifferB) {
            leftB = points.leftBottom - rightDifferB
          } else if (rightDifferB < leftDifferB) {
            rightB = points.rightBottom - leftDifferB
          }
          rightT = points.rightTop - leftDifferT > rightEnd ? points.rightTop - leftDifferT : rightEnd
          if (points.rightTop - leftDifferT < rightEnd) {
            leftT = leftB - (rightB - rightT)
          }
          const pubLicPint = {
            leftBG: leftB - repeatH, rightBG: rightB - repeatH, leftTG: leftT - repeatH, rightTG: rightT - repeatH, bottomLeft, bottomRight,
          }
          this.reversePlubSvgs.push(pubLicPint)
        }
      }
    })
    this.setState({ reverseSvgs: this.reverseSvgs, reversePlubSvgs: this.reversePlubSvgs })
  }
  render() {
    const randomNum = Math.random()
    return (
      <div className="greenWaveBox">
        {
          this.props.showForwordWave &&
          <svg style={{ position: 'absolute', top: '0', zIndex: '1', opacity: '.8' }} width="1000px" height="350px" viewBox="0 0 1000 350">
            {
              this.state.svgs &&
              this.state.svgs.map((item, indexs) => {
                return (
                  <g key={indexs + randomNum}>
                    {/* <polygon key={item} points={`${item.leftTop[0]},${item.leftTop[1]} ${item.rightTop[0]},${item.rightTop[1]} ${item.rightBottom[0]},${item.rightBottom[1]} ${item.leftBottom[0]},${item.leftBottom[1]}`} style={{fill: '#73a22b', stroke: '#73a22b'}} /> */}
                    <polygon points={`${item.bottomLeft},${item.leftBottom} ${item.bottomLeft},${item.leftTop} ${item.bottomRight},${item.rightTop} ${item.bottomRight},${item.rightBottom}`} style={{ fill: 'none', stroke: '#73a22b' }} />
                    {/* <polygon points={`0,42 0,19 504,43 504,66`} style={{fill: '#4c791d', stroke: '#4c791d'}} /> */}
                  </g>
                )
              })
            }
            {
              this.state.publicSvgs &&
              this.state.publicSvgs.map((item, indexs) => {
                return (
                  <g key={indexs + randomNum}>
                    {/* <polygon key={item} points={`${item.leftTop[0]},${item.leftTop[1]} ${item.rightTop[0]},${item.rightTop[1]} ${item.rightBottom[0]},${item.rightBottom[1]} ${item.leftBottom[0]},${item.leftBottom[1]}`} style={{fill: '#73a22b', stroke: '#73a22b'}} /> */}
                    <polygon points={`${item.bottomLeft},${item.leftBG} ${item.bottomLeft},${item.leftTG} ${item.bottomRight},${item.rightTG} ${item.bottomRight},${item.rightBG}`} style={{ fill: '#73a22b', stroke: '#73a22b' }} />
                    {/* <polygon points={`0,42 0,19 504,43 504,66`} style={{fill: '#4c791d', stroke: '#4c791d'}} /> */}
                  </g>
                )
              })
            }
          </svg>
        }
        {
          this.props.showReverseWave &&
          <svg style={{ position: 'absolute', top: '0', zIndex: '1', opacity: '.8' }} width="1000px" height="350px" viewBox="0 0 1000 350">
            {
              // "723,313  850,298  850,268  723,283" #4e7e1a 反向
              this.state.reverseSvgs &&
              this.state.reverseSvgs.map((item, indexs) => {
                return (
                  <g key={indexs + randomNum}>
                    {/* <polygon points={`${item.leftTop[0]},${item.leftTop[1]} ${item.rightTop[0]},${item.rightTop[1]} ${item.rightBottom[0]},${item.rightBottom[1]} ${item.leftBottom[0]},${item.leftBottom[1]}`} style={{fill: '#73a22b', stroke: '#73a22b'}} /> */}
                    <polygon points={`${item.bottomLeft},${item.leftBottom} ${item.bottomLeft},${item.leftTop} ${item.bottomRight},${item.rightTop} ${item.bottomRight},${item.rightBottom}`} style={{ fill: 'none', stroke: '#4c791d' }} />
                    {/* <polygon key={item} points={`${item.reverseLeftTop[0]},${item.reverseLeftTop[1]} ${item.reverseRightTop[0]},${item.reverseRightTop[1]} ${item.reverseRightBottom[0]},${item.reverseRightBottom[1]} ${item.reverseLeftBottom[0]},${item.reverseLeftBottom[1]}`} style={{fill: '#4c791d', stroke: '#4c791d'}} /> */}
                  </g>
                )
              })
            }
            {
              this.state.reversePlubSvgs &&
              this.state.reversePlubSvgs.map((item, indexs) => {
                return (
                  <g key={indexs + randomNum}>
                    <polygon points={`${item.bottomLeft},${item.leftBG} ${item.bottomLeft},${item.leftTG} ${item.bottomRight},${item.rightTG} ${item.bottomRight},${item.rightBG}`} style={{ fill: '#4c791d', stroke: '#4c791d' }} />
                    {/* <polygon points={`0,42 0,19 504,43 504,66`} style={{fill: '#4c791d', stroke: '#4c791d'}} /> */}
                  </g>
                )
              })
            }
          </svg>
        }
        <div className="begainBox">0</div>
        <div className="xCoordinate"><div className="xarrows"></div></div>
        <div className="yCoordinate"><div className="yarrows"></div></div>
        {
          this.props.chartsData.map((item, index) => {
            if (item.cycle_time !== '') {
              const num = this.H / (item.cycle_time * this.Hs)
              const cycleTimeArr = new Array(Math.ceil(num)).fill(item.cycle_time * this.Hs)
              return (
                <div className="graphBox" style={{ left: item.lenAll * this.Ws + 'px' }} key={item.forward_offset+index}>
                  <div className="repeatBox" style={{ left: '0' }}>
                    {
                      this.repeatBox.map((repeat, reIndex) => {
                        const bottomN = (item.cycle_time * this.Hs) * cycleTimeArr.length
                        return (
                          <div key={reIndex} className="forwordGraph" style={{ bottom: reIndex === 0 ? -bottomN + 'px' : reIndex === 1 ? 0 : bottomN + 'px' }}>
                            {
                              cycleTimeArr.map((cycle, _index) => {
                                return (
                                  <div key={_index} className="phaseBox" style={{ bottom: cycle * _index + 'px' }}>
                                    {
                                      item.phaseList.length > 0 &&
                                      item.phaseList.map((items, indexs) => {
                                        const phaseOffSet = items.split_time < 0 ? -(items.split_time) : items.split_time
                                        if (item.forward_phase_plan_name === items.phase_name) {
                                          return (
                                            <div key={indexs} id={ reIndex === 1 && _index === 0 ? 'phaseBox' + index : ''} className="greenBox colorBox" phasename={items.phase_name} style={{ height: phaseOffSet * this.Hs + 'px', backgroundColor: '#73a22b' }}></div>
                                          )
                                        } else {
                                          return (
                                            <div key={indexs} className="redBox colorBox" phasename={items.phase_name} style={{ height: phaseOffSet * this.Hs + 'px' }}></div>
                                          )
                                        }
                                      })
                                    }
                                  </div>
                                )
                              })
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="repeatBox" style={{ left: '20px' }}>
                    {
                      this.repeatBox.map((repeat, reIndex) => {
                        const bottomN = (item.cycle_time * this.Hs) * cycleTimeArr.length
                        return (
                          <div key={reIndex} className="forwordGraph" style={{ bottom: reIndex === 0 ? -bottomN + 'px' : reIndex === 1 ? 0 : bottomN + 'px' }}>
                            {
                              cycleTimeArr.map((cycle, _index) => {
                                return (
                                  <div className="phaseBox" style={{ bottom: cycle * _index + 'px' }} key={cycle*_index}>
                                    {
                                      item.phaseList.length > 0 &&
                                      item.phaseList.map((items, indexs) => {
                                        const phaseOffSet = items.split_time < 0 ? -(items.split_time) : items.split_time
                                        if (item.reverse_phase_plan_name === items.phase_name) {
                                          return (
                                            <div key={items.phase_name} id={ reIndex === 1 && _index === 0 ? 'reversePhaseBox' + index : ''} className="greenBox colorBox" phasename={items.phase_name} style={{ height: phaseOffSet * this.Hs + 'px', backgroundColor: '#4c791d' }} />
                                          )
                                        }
                                        return (
                                          <div key={items.phase_name} className="redBox colorBox" phasename={items.phase_name} style={{ height: phaseOffSet * this.Hs + 'px' }} />
                                        )
                                      })
                                    }
                                  </div>
                                )
                              })
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
          })
        }
        
        {/* <div className="graphBox">
          <div className="forwordGraph">
            <div className="phaseBox">
              <div className="greenBox colorBox"></div>
            </div>
          </div>
          <div className="reverseGraph"></div>
        </div> */}
        {
          this.yAxisArr.map((item, index) => {
            return (
              <div className="yAxisBox" style={{ height: this.yScaleH + 'px', bottom: index * this.yScaleH + 'px' }} key={'y' + index}>
                <div style={{ position: 'relative' }}>
                  <span className="yScaleText">{this.ySplitS * (index +1)}</span>
                </div>
              </div>
            )
          })
        }
        {
          this.xAxisArr.map((item, index) => {
            const interMsg = this.props.chartsData[index]
            if (interMsg) {
              return (
                <div className="xAxisBox" style={{ width: this.Ws * item + 'px', left: '0px' }} key={'x' + index}>
                  <div style={{ position: 'relative' }}>
                    <span className="xScalText">{item}</span>
                  </div>
                  <div className="xAxisInterMsg" style={{ width: '200px', left: this.Ws * item - 20 + 'px' }} key={interMsg.inter_name + interMsg.forwordSpeed + interMsg.reverseSpeed}>
                    <div>{interMsg.inter_name}</div>
                    <div>周期：{interMsg.phaseList.length > 0 ? interMsg.phaseList[0].cycle_time : 0}秒</div>
                    <div>速度(正)：{interMsg.forwordSpeed}km/h</div>
                    <div>速度(反)：{interMsg.reverseSpeed}km/h</div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }
}

export default GreenWaveCharts
