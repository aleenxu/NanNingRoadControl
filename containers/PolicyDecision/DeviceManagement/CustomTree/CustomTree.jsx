import React from 'react'
import { Icon, Tooltip } from 'antd'

import styles from './CustomTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [1, 11, 2, 22, 12],
      visible: 0, // 右键菜单
      treeChecked: null,
    }
  }
  componentDidMount = () => {
  }
  btns = (id) => {
    // console.log(id)
  }
  handleTreeSelect = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const id = Number(e.currentTarget.getAttribute('id'))
    const interid = Number(e.currentTarget.getAttribute('interid'))
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    this.props.visibleShowLeft('', '', false)
    console.log(interid)
    interid ? this.props.hanleSelectInter(e) : null
  }
  rightDown = (e, id, boolean) => { // 鼠标右击
    e.stopPropagation()
    e.preventDefault()
    const { visibleShowLeft } = this.props
    if (boolean) {
      const top = e.pageY
      if (e.button === 2) {
        visibleShowLeft(top, id, true)
      }
    } else {
      visibleShowLeft('', '', false)
    }
  }
  noShow = (e) => { // 禁止默认右键菜单
    e.stopPropagation()
    e.preventDefault()
  }
  render() {
    const { expendsKey, treeChecked } = this.state
    const loop = data => (
      data.map((item) => {
        const isOpen = expendsKey.indexOf(item.NAME) >= 0
        if (item.children && item.children.length) {
          return (
            <li className={styles.childLi} key={item.ID} id={item.ID} onClick={this.handleTreeSelect}>
              <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
              <span className={styles.childNode}>{item.NAME}</span>
              {
                isOpen &&
                <ul className={styles.childTree}>
                  {loop(item.children)}
                </ul>
              }
            </li>
          )
        }
        return (
          <li className={styles.childLi} onMouseDown={(e) => this.rightDown(e, '', false)} key={item.ID} id={item.ID} lng={item.LONGITUDE} lat={item.LATITUDE} interid={item.ID} onClick={this.handleTreeSelect}>
            <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
            <span title={item.NAME} className={styles.childNode}>{item.NAME}</span>
          </li>
        )
      })
    )
    return (
      <div className={styles.treeWrapper}>
        <ul className={styles.treeList}>
          {
            this.props.vipRouteList && this.props.vipRouteList.map((item) => {
              const isOpen = expendsKey.indexOf(item.ID) >= 0
              return (
                <li className={styles.treeLi} key={item.ID} id={item.ID} onContextMenu={this.noShow} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
                  </span>
                  <span title={item.NAME} onClick={() => this.btns(item.ID)} onMouseDown={e => this.rightDown(e, item.ID, true)} className={styles.childNode}>{item.NAME}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.ID}>
                      {loop(item.children)}
                    </ul>
                  }
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default CustomTree
