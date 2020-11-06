import React from 'react'
import { Icon } from 'antd'

import styles from './CustomTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [],
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
    console.log('ssdsdsdsdsd')
    this.defaultChildren = loadPlanTree.map(() => [])
    this.setState({ loadPlanTree, defaultChildren: this.defaultChildren })
  }
  // 二级目录 路口
  getPlanChildTree = (loadChildTree) => {
    this.defaultChildren.splice(this.treeIndex, 1, loadChildTree)
    this.setState({ defaultChildren: this.defaultChildren })
  }
  handleTreeSelect = (e) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.visibleShowLeft('', '', false)
    const id = Number(e.currentTarget.getAttribute('id'))
    this.treeIndex = Number(e.currentTarget.getAttribute('itemindex'))
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    this.props.getSelectTreeId(id)
  }
  rightDown = (e, id, boolean) => { // 鼠标右击
    // e.stopPropagation()
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
  handleTreeChildSelect = (e) => {
    console.log(98745)
    e.stopPropagation()
    const id = Number(e.currentTarget.getAttribute('id'))
    if (id) {
      this.props.getSelectChildId(id)
    }
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
          <li className={styles.childLi} key={item.ID} onMouseDown={() => this.rightDown('', '', false)} id={item.ID} onClick={this.handleTreeChildSelect}>
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
                <li className={styles.treeLi} key={item.ID} onContextMenu={this.noShow} id={item.ID} itemindex={index} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
                  </span>
                  <span title={item.NAME} onMouseDown={e => this.rightDown(e, item.ID, true)} className={styles.childNode}>{item.NAME}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.ID}>
                      {
                        this.state.defaultChildren[index].length > 0 ?
                          loop(this.state.defaultChildren[index]) :
                          <li className={styles.childLi} onClick={this.handleTreeChildSelect}>
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
