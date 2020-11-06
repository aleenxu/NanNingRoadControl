/**
 * @file 路口管理发出的action
 */

import * as types from '../constants/InterManageTypes'
import RestUtil from '../utils/RestUtil'
import {
  API_UINTINTER_INFO,
  API_UNIT_MANAGEMENTCODE,
  API_MANAGEMENT_UNIT,
  API_SAVE_INTERMANAGE,
} from '../constants/interManageAPI'

export const getUnitInterInfo = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UINTINTER_INFO}${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_UNITINTER_INFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getInterControlSys = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_MANAGEMENTCODE}${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_UNIT_CONTROLSYS, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getUnitInterType = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_MANAGEMENTCODE}${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_UNIT_INTERTYPE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getUnitDeviceType = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_MANAGEMENTCODE}${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_UNIT_DEVICETYPE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getManagementUnit = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_MANAGEMENT_UNIT)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_MANAGEMENT_UNIT, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getUnitDirection = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_MANAGEMENTCODE}${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_UNIT_DIRECTION, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSaveInterManage = (params) => {
  return async () => {
    const result = await RestUtil.post(API_SAVE_INTERMANAGE, params)
    return result
  }
}

export const getDefaultUnitInfo = (unitInfo) => {
  return (dispatch) => {
    dispatch({ type: types.GET_UNITINTER_INFO, payload: unitInfo })
  }
}
