import React, { PureComponent } from "react";
import yellow from "../imgs/yellow.png"
import red from "../imgs/red.png";
import upDownPng from "../imgs/03.png"
import leftRightPng from "../imgs/01.png"
import upLeftDownRight from "../imgs/04.png"
import upLeftUp from "../imgs/11.png"
import rightUpLeftDown from "../imgs/02.png"
import { Button, Switch } from "antd";
//引入视频
import Video from '../../../../components/video/video'
import { SearchOutlined, CompassOutlined } from "@ant-design/icons";
import styles from './ChangePop.scss'
class ChangePop extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      //向东 按钮
      modeMainEStyle:true,
       //向西 按钮
      modeMainWStyle:false,
       //向南 按钮
      modeMainSStyle:true,
       //向北 按钮
      modeMainNStyle:false,
      //视频
      url: [{ url: "rtmp://58.200.131.2:1935/livetv/cctv2", name: "东", id: "my_E"  }, { url: "rtmp://58.200.131.2:1935/livetv/cetv2", name: "西", id: "my_W" , displayStyle:true }],
      arl: [{ url: "rtmp://58.200.131.2:1935/livetv/cctv13", name: "南", id: 'my_S'  }, { url: "rtmp://58.200.131.2:1935/livetv/startv", name: "北", id: "my_N" , displayStyle:true }],
    }
  }
  componentDidMount = () => {
  }

  render() {
    const { modeNavShow, modeMapShow, modeMainMonitor, modeMainTabShow ,modeMainEStyle,modeMainWStyle,modeMainSStyle,modeMainNStyle,modeMainTabTypeD,modeMainTabD} = this.state;
    return (
      <div className={styles.modeMainMonitorHome}>
        <div className={styles.modeMainSlidMode}>
          <div className={styles.modeMainSlidHeadMode}>
            <div className={styles.modeMainIptHome}>
              <input type="text" placeholder="查询…" className={styles.modeMainIpt} />
              <div className={styles.modeMainIptBox}>
                <SearchOutlined />
              </div>
            </div>
            <div className={styles.modeMainLengthHome}>
              <div className={styles.modeMainLength}>干线长度</div><div className={styles.modeMainLengthNum}><span className={styles.modeMainLengthUnit}>6</span>km</div>
            </div>
            <div className={styles.modeMainLabelHome}>
              <div className={styles.modeMainLabel}>
                <div className={styles.modeMainLabelIcon}><CompassOutlined /></div>
                <div className={styles.modeMainLabelText}>东西向</div>
              </div>
            </div>
          </div>
          <div className={styles.modeMainDirection}>
            <div className={styles.modeMainEWMode}>
              {/* 东西走向 */}
              <Video url={this.state.url} showB={true}></Video>
              {/* <div className={styles.modeMainEWBtn}>
                <Button className={styles.modeShowStyle}>东</Button>
                <Button className={styles.modeShowStyle}>西</Button>
              </div>
              <div className={styles.modeMainEWVideo}>
              </div> */}
            </div>
            <div className={styles.modeMainSNMode}>
              {/* 南北走向 */}
              <Video url={this.state.arl} showB={true}></Video>
              {/* <div className={styles.modeMainSNBtn}>
                <Button className={styles.modeShowStyle}>南</Button>
                <Button className={styles.modeShowStyle}>北</Button>
              </div>
              <div className={styles.modeMainSNVideo}>
              </div> */}
            </div>
          </div>
        </div>

        <div className={styles.modeMainContentMode}>
          <div className={styles.modeMainMonitorContent}>
            <div className={styles.modeMainMonitorContentHome}>

              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStrip}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#02AED7,#0173C8)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLine}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    苏州街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>
                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStripTwo} style={{ position: "absolute", top: "202px", left: "calc(190px * 1)" }}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#0163DA,#0147CB)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLineTwo} style={{ position: "absolute", top: "0px", left: "calc(155px + 185px * 1)" }}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    中关村大街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>

                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStripTwo} style={{ position: "absolute", top: "202px", left: "calc((190px - 2px) * 2)" }}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#0163DA,#0147CB)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLineTwo} style={{ position: "absolute", top: "0px", left: "calc(155px + 185px * 2)" }}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    中关村大街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>

                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStripTwo} style={{ position: "absolute", top: "202px", left: "calc((190px - 3px) * 3)" }}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#0163DA,#0147CB)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLineTwo} style={{ position: "absolute", top: "0px", left: "calc(155px + 185px * 3)" }}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    中关村大街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>

                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStripTwo} style={{ position: "absolute", top: "202px", left: "calc((190px - 4px) * 4)" }}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#0163DA,#0147CB)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLineTwo} style={{ position: "absolute", top: "0px", left: "calc(155px + 185px * 4)" }}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    中关村大街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>

                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStripTwo} style={{ position: "absolute", top: "202px", left: "calc((190px - 4px) * 5)" }}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#0163DA,#0147CB)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLineTwo} style={{ position: "absolute", top: "0px", left: "calc(155px + 185px * 5)" }}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    中关村大街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>
                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 条状图 */}
              <div className={styles.modeMainMonitorContentStripTwo} style={{ position: "absolute", top: "202px", left: "calc((190px - 4px) * 6)" }}>
                <div style={{ width: 150, height: 18, background: "linear-gradient(to top,#0163DA,#0147CB)", borderRadius: "20px", position: "relative" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(67,176,220,.66)", position: "absolute", right: "0", top: 0 }}>
                  </div>
                </div>
              </div>
              {/* 球形+内容 */}
              <div className={styles.modeMainMonitorContentLineTwo} style={{ position: "absolute", top: "0px", left: "calc(155px + 185px * 6)" }}>
                <div className={styles.modeMainMonitorContentCross}>
                  <div className={styles.modeMainMonitorContentCrossText}>
                    中关村大街
                        </div>
                </div>
                <div className={styles.modeMainMonitorContentball}>

                </div>
                <div className={styles.modeMainMonitorContentList}>
                  <div className={styles.modeMainMonitorContentListTop}>
                    <div className={styles.autoOper}>自动运行</div>
                    <div className={styles.switch}><Switch defaultChecked onChange={this.onChange} style={{ background: "#4A62E7" }} /></div>
                    <div className={styles.openHand}>开启手动</div>
                  </div>
                  <div className={styles.modeMainMonitorContentListBottom}>
                    <div className={styles.modeMainMonitorContentListTable}>
                      <div className={styles.modeMainMonitorContentListImg}><img src={yellow} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={red} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={leftRightPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upDownPng} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={upLeftDownRight} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg} style={{ background: "#000E35" }}><img src={upLeftUp} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                      <div className={styles.modeMainMonitorContentListImg}><img src={rightUpLeftDown} alt="" /></div>
                      <div className={styles.modeMainMonitorContentListNum}><div className={styles.contentListNum}>44</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ChangePop