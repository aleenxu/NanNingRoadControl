import React, { PureComponent } from 'react'
import styles from './../Monitoring/Monitoring.scss'
class SteppingManage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount = () => {

  }
  render() {
    return (
      <div className={styles.monitorWrapper} style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <div style={{position:'absolute',zIndex:'1000'}}>开发中。。。</div>
      </div>
    )
  }
}

export default SteppingManage