import React from 'react'
import { Icon } from 'antd'

import styles from './CustomInterTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [],
      visible: 0, // 右键菜单
      loadPlanTree: null,
      defaultChildren: null,
    }
    this.defaultChildren = []
  }
  componentDidMount = () => {
    // console.log('customTree:::', this.props)
  }
  componentDidUpdate = (prevState) => {
    const { loadPlanTree, loadChildTree } = this.props.data
    if (prevState.data.loadPlanTree !== loadPlanTree) {
      this.getPlanTree(loadPlanTree)
    }
    if (prevState.data.loadChildTree !== loadChildTree) {
      this.getPlanChildTree(loadChildTree)
    }
  }
  getPlanTree = (loadPlanTree) => {
    this.defaultChildren = loadPlanTree.map(() => [])
    this.setState({ loadPlanTree, defaultChildren: this.defaultChildren })
  }
  // 二级目录 路口
  getPlanChildTree = (loadChildTree) => {
    console.log(loadChildTree)
    this.defaultChildren.splice(this.treeIndex, 1, loadChildTree)
    this.setState({ defaultChildren: this.defaultChildren })
  }
  handleTreeSelect = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const id = Number(e.currentTarget.getAttribute('id'))
    this.treeIndex = Number(e.currentTarget.getAttribute('itemindex'))
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    if (!this.props.rightDownNone) {
      this.props.visibleShowLeft('', '', false)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    this.props.getSelectTreeId(id)
  }
  handleTreeChildSelect = (e) => {
    e.stopPropagation()
    const id = Number(e.currentTarget.getAttribute('id'))
    const lng = Number(e.currentTarget.getAttribute('lng'))
    const lat = Number(e.currentTarget.getAttribute('lat'))
    if (id) {
      this.props.getSelectChildId(id, lng, lat)
    }
  }
  rightDown = (e, id, boolean) => { // 鼠标右击
    if (this.props.rightDownNone) return false
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
    const { expendsKey, loadPlanTree } = this.state
    const loop = data => (
      data.map((item) => {
        const isOpen = expendsKey.indexOf(item.id) >= 0
        if (item.children && item.children.length) {
          return (
            <li className={styles.childLi} key={item.id} id={item.id} onClick={this.handleTreeSelect}>
              <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
              <span className={styles.childNode}>{item.name}</span>
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
          <li
            className={styles.childLi}
            onMouseDown={(e) => { this.rightDown(e, '', false) }}
            key={item.ID}
            id={item.ID}
            lng={item.LONGITUDE}
            lat={item.LATITUDE}
            onClick={this.handleTreeChildSelect}
          >
            <span className={styles.childIcon}><Icon type="environment" theme="filled" /></span>
            <span title={item.NAME} className={styles.childNode}>{item.NAME}</span>
          </li>
        )
      })
    )
    return (
      <div className={styles.treeWrapper}>
        <ul className={styles.treeList}>
          {
            loadPlanTree &&
            loadPlanTree.map((item, index) => {
              const isOpen = expendsKey.indexOf(item.ID) >= 0
              return (
                <li className={styles.treeLi} key={item.ID} id={item.ID} itemindex={index} onContextMenu={this.noShow} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
                  </span>
                  <span title={item.NAME} className={styles.childNode} onMouseDown={e => this.rightDown(e, item.ID, true)}>{item.NAME}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.ID}>
                      {
                        this.state.defaultChildren[index].length > 0 ?
                          loop(this.state.defaultChildren[index]) :
                          <li className={styles.childLi}>
                            <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
                            <span className={styles.childNode}>暂无数据</span>
                          </li>
                      }
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
