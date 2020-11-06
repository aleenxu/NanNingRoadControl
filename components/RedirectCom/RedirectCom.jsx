import React from 'react'
import { Spin } from 'antd'
import getHttp from '../../utils/RestUtil'

class RedirectCom extends React.Component {
  constructor(props) {
    super(props)
    this.styles = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e375d',
    }
    this.verifyToken = '/simulation/sys/user/tokenLogin'
    this.userLimit = '/simulation/sys/menu/getUserMentList'
  }
  componentDidMount = () => {
    let token = 'noTokenCarry'
    if (window.location.href.split('?')[1]) {
      token = window.location.href.split('?')[1].split('=')[1]
    }
    getHttp.get(`${this.verifyToken}?singleToken=${token}`).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        localStorage.setItem('userInfo', JSON.stringify(data))
        getHttp.post(`${this.userLimit}?userId=${data.id}`).then((result) => {
          if (result.data.code === 0) {
            localStorage.setItem('userLimit', JSON.stringify(result.data.data))
            this.props.history.push('/home')
          }
        })
      }
    })
  }
  render() {
    return (
      <div style={this.styles}><Spin size="large" /></div>
    )
  }
}

export default RedirectCom
