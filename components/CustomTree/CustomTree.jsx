import React from 'react'
import { Icon } from 'antd'

import styles from './CustomTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [],
      interTreeData: null,
    }
  }
  componentDidMount = () => {
    const { treeData, keys } = this.props
    if (treeData) {
      this.setState({ interTreeData: treeData, expendsKey: keys || [] })
    } else {
      this.setState({ interTreeData: [] })
    }
  }
  handleTreeSelect = (e) => {
    e.stopPropagation()
    const id = e.currentTarget.getAttribute('id')
    const level = e.currentTarget.getAttribute('level')
    const value = e.currentTarget.getAttribute('val')
    const index = this.state.expendsKey.indexOf(id)
    if (!id) return
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    if (level === '3') { // 路口 或者 干线
      this.props.getCurrentId(id, value)
    } else if (level === '2') {
      this.props.getchildArea && this.props.getchildArea(id, value)
    }
  }

  render() {
    const { expendsKey, interTreeData } = this.state
    const loop = data => (
      data.map((item) => {
        const isOpen = expendsKey.indexOf(item.id) >= 0
        if (item.children && item.children.length > 0) {
          return (
            <li className={styles.childLi} key={item.id} id={item.id} level={item.lev} val={item.name} onClick={this.handleTreeSelect}>
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
          <li className={styles.childLi} key={item.id} id={item.id} level={item.lev} val={item.name} onClick={this.handleTreeSelect}>
            <span className={styles.childIcon}><Icon type="environment" /></span>
            <span className={styles.childNode}>{item.name}</span>
          </li>
        )
      })
    )
    return (
      <div className={styles.treeWrapper}>
        <ul className={styles.treeList} key={expendsKey.length}>
          {
            interTreeData &&
            interTreeData.map((item) => {
              const isOpen = expendsKey.indexOf(item.id) >= 0
              return (
                <li className={styles.treeLi} key={item.id} id={item.id} level={item.lev} val={item.name} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <Icon type={isOpen ? 'folder-open' : 'folder'} theme="filled" />
                  </span>
                  <span className={styles.treeNode}>{item.name}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.id}>
                      {
                        (item.children && item.children.length > 0) ?
                          loop(item.children) :
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
