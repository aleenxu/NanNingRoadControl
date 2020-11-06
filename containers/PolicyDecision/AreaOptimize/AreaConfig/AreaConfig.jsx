import React from 'react'
import { Icon } from 'antd'
import Optimize from './AreaConfigPage/optimize'
import styles from './AreaConfig.scss'
import ControlRecord from './AreaConfigPage/ControlRecord/ControlRecord'

class AreaConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showControlRecord: false,
    }
  }
  componentDidMount = () => { }
  closePage = () => { // 关闭当前弹窗页面
    this.props.closepage()
  }
  showControlRecord = () => {
    this.setState({ showControlRecord: true })
  }
  closeControlRecord = () => {
    this.setState({ showControlRecord: false })
  }
  render() {
    return (
      <div className={styles.configWrapper}>
        <div className={styles.title}>
          <span>区域优化配置</span>
          <span onClick={this.closePage}><Icon type="close" /></span>
        </div>
        {
          this.state.showControlRecord &&
          <div className="controlRecordBox">
            <ControlRecord evlregionId={this.props.ctrlregionId} areaCode={this.props.areaId} closeControlRecord={this.closeControlRecord} />
          </div>
        }
        <div className={styles.greenWrapper}>
          <div className={styles.greenWave}>
            <Optimize {...this.props} showControlRecord={this.showControlRecord} />
          </div>
        </div>
      </div>
    )
  }
}

export default AreaConfig
