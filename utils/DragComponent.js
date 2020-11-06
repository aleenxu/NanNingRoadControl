import React from 'react'

const DragComponent = (NewComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      const names = this.props.confName
      if (this.props.layoutDatas) {
        this.layoutMsg = this.props.layoutDatas.find(item => item.confName === names)
      }
      console.log(this.layoutMsg, names)
      const { top, left, right, bottom } = this.layoutMsg
      this.dragStyle = {
        zIndex: 2,
        position: 'absolute',
        top,
        left,
        bottom,
        right,
        // height: 'auto',
        width: '440px',
      }
    }
    // 拖放开始
    handleDragStart = (ev) => {
      console.log(ev.target)
      const { screenX, screenY } = ev
      const { left, top, right, bottom } = ev.target.style
      this.startX = screenX
      this.startY = screenY
      this.startLeft = parseInt(left, 0)
      this.startTop = parseInt(top, 0)
      this.startRight = parseInt(right, 0)
      this.startBottom = parseInt(bottom, 0)
      ev.target.style.opacity = 0.5
      console.log(this.startTop, this.startLeft)
    }
    // 拖放结束
    handleDragEnd = (e) => {
      const { screenX, screenY } = e
      const moveX = isNaN(this.startLeft) ? this.startX - screenX : screenX - this.startX
      const moveY = isNaN(this.startTop) ? this.startY - screenY : screenY - this.startY
      // e.target.style.left = `${this.startLeft + moveX <= 0 ? 0 : this.startLeft + moveX}px`
      // e.target.style.top = `${this.startTop + moveY <= 0 ? 0 : this.startTop + moveY}px`
      if (!isNaN(this.startLeft)) {
        e.target.style.left = `${this.startLeft + moveX <= 0 ? 0 : this.startLeft + moveX}px`
      }
      if (!isNaN(this.startTop)) {
        e.target.style.top = `${this.startTop + moveY <= 0 ? 0 : this.startTop + moveY}px`
      }
      if (!isNaN(this.startRight)) {
        e.target.style.right = `${this.startRight + moveX <= 0 ? 0 : this.startRight + moveX}px`
      }
      if (!isNaN(this.startBottom)) {
        e.target.style.bottom = `${this.startBottom + moveX <= 0 ? 0 : this.startBottom + moveX}px`
      }
      e.target.style.opacity = 1
    }
    render() {
      return (
        <div
          style={this.dragStyle}
          draggable
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >
          <NewComponent {...this.props} />
        </div>
      )
    }
  }
}

export default DragComponent
