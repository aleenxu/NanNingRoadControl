import React, { Component } from 'react'
import styles from './Form.scss'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { name, headOne, headTwo, headTre, datas = [], type } = this.props
    return (
      <div className={styles.formBox}>
        <p className={styles.pTop}>{name}</p>
        <div className={styles.mountingManage}>
          <div className={styles.mountingTable}>
            <div className={styles.mountingThead}>
              <div className={styles.mountingTh}>{headOne}</div>
              <div className={styles.mountingTh}>{headTwo}</div>
              <div className={styles.mountingTh}>{headTre}</div>
            </div>
            <div className={styles.mountingTbody}>
              {
                datas && datas.map(item => (
                  <div className={styles.mountingTr} key={item.UNIT_NAME}>
                    <div title={type === 'count' ? item.UNIT_NAME : item.DISTRICT_NAME} className={styles.mountingTd}>{type === 'count' ? item.UNIT_NAME : item.DISTRICT_NAME}</div>
                    <div title={type === 'count' ? item.NUM : item.UNIT_NAME} className={styles.mountingTd}>{type === 'count' ? item.NUM : item.UNIT_NAME}</div>
                    <div title={type === 'times' ? item.PLAN_TIMING_CHANGE_TIME : item.CONTROL_TIME} className={styles.mountingTd}>{type === 'times' ? item.PLAN_TIMING_CHANGE_TIME : item.CONTROL_TIME}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form
