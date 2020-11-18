import React, { PureComponent } from 'react'
import publicStyles from './../Monitoring/Monitoring.scss'
import { Icon, Input, message, DatePicker, Select, Modal } from 'antd'
import styles from './SteppingManage.scss'
class SteppingManage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount = () => {

  }
  render() {
    const { Option } = Select
    return (
      <div className={publicStyles.monitorWrapper} style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
        <div className={styles.syetem_bg}>
            <div className={styles.syetem_top}>
              <div className={`${styles.syetem_item}`}><span className={styles.item}>未选路口：</span>
                <div className={styles.inSle}>
                  <Select
                    onChange={this.handleInputChangeUser}
                    defaultValue="全部">
                    <Option value={0} key="124ssswwwa">全部</Option>
                  </Select>
                </div>
              </div>
              <div className={`${styles.syetem_item}`}><span className={styles.item}>已选路口：</span>
                <div className={styles.inSle}>
                  <Select
                    onChange={this.handleInputChangeUserGroups}
                    defaultValue="全部">
                    <Option value={0} key="124ssswwwar">全部</Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className={styles.syetem_buttom}>
              <div className={styles.title} />
              <div className={styles.listBox}>
                <div className={styles.listItems}>
                  <div className={styles.listTd} >用户名称</div>
                  <div className={styles.listTd} >所属用户组</div>
                  <div className={styles.listTd} >IP</div>
                  <div className={styles.listTd} >操作模块</div>
                  <div className={styles.listTd} >操作动作</div>
                  <div className={styles.listTd} >操作时间</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default SteppingManage