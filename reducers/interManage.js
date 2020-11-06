/**
 * @file 路口管理 reducer
 */

import * as types from '../constants/InterManageTypes'

const interManage = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNITINTER_INFO:
      return Object.assign({}, state, { unitInterInfo: payload })
    case types.GET_UNIT_CONTROLSYS:
      return Object.assign({}, state, { controlSys: payload })
    case types.GET_UNIT_INTERTYPE:
      return Object.assign({}, state, { unitInterType: payload })
    case types.GET_UNIT_DEVICETYPE:
      return Object.assign({}, state, { unitDeviceType: payload })
    case types.GET_MANAGEMENT_UNIT:
      return Object.assign({}, state, { managementUnit: payload })
    case types.GET_UNIT_DIRECTION:
      return Object.assign({}, state, { unitDirection: payload })
    default:
      return state
  }
}

export default interManage

