import React, { Component } from 'react'
import AreaCoordinateMap from './AreaCoordinateMap'
import CustomList from './CustomList/CustomList'

class AreaCoordinate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      CoustomState: true,
    }
  }
  componentDidMount() {

  }
  render() {
    const { CoustomState } = this.state
    return (
      CoustomState ? <AreaCoordinateMap /> : <CustomList />
    )
  }
}

AreaCoordinate.propTypes = {

}

export default AreaCoordinate
