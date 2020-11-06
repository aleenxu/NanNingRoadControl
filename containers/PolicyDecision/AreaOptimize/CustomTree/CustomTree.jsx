import React from 'react'
import { Select, Icon, Switch } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getInterDataTree } from '../../../../actions/management'
import styles from './CustomTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [1, 11, 2, 22, 12],
      treeDate: [],
    }
    this.loopDate = [
      {
        name: '美兰区',
        id: 1,
        children: [
          {
            name: '海淀五西路',
            id: 11,
            children: [
              {
                name: '海淀五西路世纪大道',
                id: 111,
              },
              {
                name: '海淀五西路世纪大道',
                id: 1111,
              },
            ],
          },
          {
            name: '海淀五东路',
            id: 12,
            children: [
              {
                name: '海淀五东路世纪大道',
                id: 112,
              },
              {
                name: '海淀五东路世纪大道',
                id: 1112,
              },
            ],
          },
        ],
      },
      {
        name: '龙华区',
        id: 2,
        children: [
          {
            name: '龙华路',
            id: 22,
            children: [
              {
                name: '龙华路世纪大道',
                id: 222,
              },
            ],
          },
        ],
      },
    ]
  }
  componentDidMount = () => {
    this.props.getInterDataTree()
  }
  componentDidUpdate = (prevState) => {
    const { InterDataTree } = this.props.data
    if (prevState.data.InterDataTree !== InterDataTree) {
      this.getInterLists(InterDataTree)
    }
  }
  getInterLists = (InterDataTree) => { // 展示树形图
    console.log(InterDataTree) // 展示树形图数据
    this.setState({
      treeDate: InterDataTree.data
    })
  }
  handleTreeSelect = (e) => {
    e.stopPropagation()
    const id = e.currentTarget.getAttribute('id')
    const level = e.currentTarget.getAttribute('level')
    const index = this.state.expendsKey.indexOf(id)
    if (!id) return
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    if (level === '3') {
      console.log('路口id:::::', id)
    }
  }

  render() {
    const { expendsKey, treeDate } = this.state
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
          <li className={styles.childLi} key={item.id} id={item.id} onClick={this.handleTreeSelect}>
            <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
            <span className={styles.childNode}>{item.name}</span>
          </li>
        )
      })
    )
    return (
      <div className={styles.treeWrapper}>
        <div className={styles.interSearch}>
          <Select defaultValue="1">
            <Option key="1">贵阳市</Option>
            <Option key="2">南阳市</Option>
          </Select>
          <span className={styles.searchBox}>
            <input className={styles.searchInput} type="text" placeholder="请输入你要搜索的内容" />
            <Icon className={styles.searchIcon} type="search" />
          </span>
        </div>
        <ul className={styles.treeList}>
          {
            treeDate && treeDate.map((item) => {
              const isOpen = expendsKey.indexOf(item.id) >= 0
              return (
                <li className={styles.treeLi} key={item.id} id={item.id} level={item.lev} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <Icon type={isOpen ? 'folder-open' : 'folder'} theme="filled" />
                  </span>
                  <span className={styles.treeNode}>{item.name}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.id}>
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

const mapStateToProps = (state) => {
  return {
    data: { ...state.managements },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getInterDataTree: bindActionCreators(getInterDataTree, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(CustomTree)
