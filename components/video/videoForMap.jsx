//<Video url={this.state.url} showB={true}></Video>
// url => 数据源 showB => 是否显示按钮
import React, { Component } from 'react'
//引入依赖
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import videojs from 'video.js'
import styles from './video.scss'
import { Button } from "antd"
class videoForMap extends Component {
  state = {}
  //组件挂载完成之后初始化播放控件
  componentDidMount() {
    const videoJsOptions = {
      autoplay: true,
      controls: true,
      sources: [{
        src: this.props.url.url,
        type: 'rtmp/flv'
      }]
    }
    window.playerMap = videojs(this.props.url.id, videoJsOptions, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
      videojs.log('Your player is ready!');
      // In this context, `this` is the player that was created by Video.js.
      this.play();
      // How about an event listener?
      this.on('ended', function () {
        videojs.log('Awww...over so soon?!');
      });
    });
  }
  componentWillUnmount = () => {
    debugger
    const myVideoElem = document.getElementById(this.props.url.id);
    if (myVideoElem) {
      const player = videojs(this.props.url.id);
      player.dispose();
    }
  }
  render() {
    const { url } = this.props;
    return (
      <div className="VideoAppBox">
        <video style={{ width: "460px", height: "210px", margin: "0 auto" }} id={url.id} className="video-js vjs-default-skin">
        </video>
      </div>
    )
  }
}

export default videoForMap