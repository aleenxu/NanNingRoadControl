import React, { PureComponent } from 'react'
import publicStyles from './../Monitoring/Monitoring.scss'
import { Icon, Input, message, DatePicker, Select, Modal } from 'antd'
import styles from './SteppingManage.scss'
class SteppingManage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      listHeight: 'auto',
    }
  }
  componentDidMount = () => {
    this.setState({
      listHeight:$(listBox).height() - 20
    })
  }
  render() {
    const { listHeight } = this.state
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
                  <div className={styles.listTd} >路口名称</div>
                  <div className={styles.listTd} >阶段链</div>
                  <div className={styles.listTd} >控制状态</div>
                  <div className={styles.listTd} >是否过渡</div>
                  <div className={styles.listTd} >操作</div>
                </div>
                <div className={styles.listBox} id="listBox" style={{height:`${listHeight}px`, overflowY:'auto'}}>
                  <div className={styles.listItems} style={{background: "none"}}>
                    <div className={styles.listTd} >X304-南宁港牛湾作业区1</div>
                    <div className={styles.listTd} ></div>
                    <div className={styles.listTd} >单点离线</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} ></div>
                  </div>
                  <div className={styles.listItems}>
                    <div className={styles.listTd} >三塘南路-水颜岭路路口（电信）	</div>
                    <div className={styles.listTd} >
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                    </div>
                    <div className={styles.listTd} >本地多时段</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} >
                      <s>锁定</s>
                      <s>自动</s>
                    </div>
                  </div>
                  <div className={styles.listItems}>
                    <div className={styles.listTd} >X304-南宁港牛湾作业区1</div>
                    <div className={styles.listTd} >
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                    </div>
                    <div className={styles.listTd} >本地多时段</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} >
                      <s>锁定</s>
                      <s>自动</s>
                    </div>
                  </div>
                  <div className={styles.listItems}>
                    <div className={styles.listTd} >三津大道-下津路路口（电信）</div>
                    <div className={styles.listTd} >
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                    </div>
                    <div className={styles.listTd} >本地多时段</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} >
                      <s>锁定</s>
                      <s>自动</s>
                    </div>
                  </div>
                  <div className={styles.listItems}>
                    <div className={styles.listTd} >安吉大道-西津路路口（电信）	</div>
                    <div className={styles.listTd} >
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                    </div>
                    <div className={styles.listTd} >本地多时段</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} >
                      <s>锁定</s>
                      <s>自动</s>
                    </div>
                  </div>
                  <div className={styles.listItems}>
                    <div className={styles.listTd} >中山路-七星路路口（电信）	</div>
                    <div className={styles.listTd} >
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                    </div>
                    <div className={styles.listTd} >本地多时段</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} >
                      <s>锁定</s>
                      <s>自动</s>
                    </div>
                  </div>
                  <div className={styles.listItems}>
                    <div className={styles.listTd} >中华路-北大路路口（电信）</div>
                    <div className={styles.listTd} >
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                      <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                    </div>
                    <div className={styles.listTd} >本地多时段</div>
                    <div className={styles.listTd} >否</div>
                    <div className={styles.listTd} >
                      <s>锁定</s>
                      <s>自动</s>
                    </div>
                  </div>
                  {/* {
                    [1,2,3,4,5,6,7,8,9].map(items => {
                      return <div key={'listItem'+items} className={styles.listItems}>
                                <div className={styles.listTd} >三塘南路-水颜岭路路口（电信）	</div>
                                <div className={styles.listTd} >
                                  <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw10_ch.gif'} />
                                  <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw18_ch.gif'} />
                                  <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw12_ch.gif'} />
                                  <img src={'http://124.70.43.68:8880/atms-web/resources/comm/images/anniu/xw17_ch.gif'} />
                                </div>
                                <div className={styles.listTd} >本地多时段</div>
                                <div className={styles.listTd} >否</div>
                                <div className={styles.listTd} >
                                  <s>锁定</s>
                                  <s>自动</s>
                                </div>
                              </div>
                    })
                  } */}
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default SteppingManage