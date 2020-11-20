import React, { Component } from 'react'
import AreaCoordinateMap from './SecretTaskMap'
import CustomList from './CustomList'
import img from '../TrunkLineMonitoring/imgs/kuang.png'

class AreaCoordinate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      CoustomState: true,
    }
    this.style = {
      width: '100px',
      textAlign: 'center',
      lineHeight: '28px',
      background: `url(${img}) center center no-repeat`,
      backgroundSize: ' 100% 100%',
      color: '#ccc',
      fontSize: '16px',
      cursor: 'pointer',
      position: 'fixed',
      right: '35px',
      top: '115px',
      zIndex: 2,
    }
  }
  componentDidMount() {

  }
  ChangePop = () => {
    this.setState({
      CoustomState: !this.state.CoustomState,
    })
  }
  render() {
    const { CoustomState } = this.state
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={this.style} onClick={this.ChangePop}>模式切换</div>
        {CoustomState ? <AreaCoordinateMap /> : <CustomList />}
      </div>

    )
  }
}

AreaCoordinate.propTypes = {

}

export default AreaCoordinate
