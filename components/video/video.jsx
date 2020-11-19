//<Video url={this.state.url} showB={true}></Video>
// url => 数据源 showB => 是否显示按钮
import React, { Component } from 'react'
//引入依赖
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import videojs from 'video.js'
import styles from './video.scss'
import {Button} from "antd"
class VideoApp extends Component{
  state={
      nowPlay:"",
      showButton:this.props.showB && true
  }
//组件挂载完成之后初始化播放控件
  componentDidMount(){
  const videoJsOptions = {
          autoplay: true,
          controls: true,
          sources: [{
            // src: 'rtmp://192.168.1.124:9999/live/31434',
            src: this.props.url[0].url,
            type: 'rtmp/flv'
          }]
        }
      this.player = videojs(this.props.url[0].id, videoJsOptions , function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
          videojs.log('Your player is ready!');
          // In this context, `this` is the player that was created by Video.js.
          this.play();
          // How about an event listener?
          this.on('ended', function() {
            videojs.log('Awww...over so soon?!');
          });
        }); 
  }
  handleClick(item){
      if(item.name===this.state.nowPlay){
          return
      }
      this.setState({
          nowPlay:item.name,
          displayStyle:item.displayStyle
      })
          this.player.pause();
          //切换网址
          this.player.src(item.url);
          this.player.load();
          this.player.play();
  }
  componentWillUnmount = () =>{
    const myVideoElem = document.getElementById(this.props.url[0].id);
    if(myVideoElem){
        const player = videojs(this.props.url[0].id);
        player.dispose();
    }
  }
  render(){ 
      let li = {
      }
      let playing = {
         color:"#fff"
      }
      const {url} =this.props;
    return(
       <div className="VideoAppBox">
              <div>
                  <ul style={{marginBottom:"13px"}}>
                  {
                    this.state.showButton&&
                      url.map((item,index)=>{
                          return <Button  key={item.name} onClick={()=>this.handleClick(item)} style={{width:"66px",height:"40px",background: "#010F46",border: "1px solid #4289E1",color: "#515A8B",fontSize: "20px",boxShadow:"inset 0px 0px 1.7px 1px #4289E1", marginRight:'10px'}}>
                                      <span style={this.state.displayStyle === item.displayStyle ? playing : li }>{item.name}</span>
                                  </Button>
                      })
                  }
                  </ul> 
                  <video style={{width:"483px",height:"292px",margin:"0 auto"}} id={url[0].id} className="video-js vjs-default-skin">
                  </video>
              </div> 
          </div>   
      )
  }
}

export default VideoApp