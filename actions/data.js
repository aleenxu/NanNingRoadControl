/**
 * @file actions
 */

import * as types from '../constants/ActionTypes'
import RestUtil from '../utils/RestUtil'
import {
  API_INTER_LIST,
  API_CONTROL_ROAD,
  API_CONTROL_COUNT,
  API_PLAN_TIME,
  API_CONTROL_STATUS,
  API_REAL_STATUS,
  API_FAULT_STATISTICS,
  API_INTER_INFO,
  API_LOAD_PLANTREE,
  API_VIP_ROUTE,
  API_VIP_ROUTE_CHILD,
  API_EDITDISTRICTINFOTHING,
  API_AREA_LIST,
  API_MONITORTYPE,
  API_GLOBALMONITOR,
  API_GLOBALUNITINFO,
  API_LINETREEDATAS,
  API_LAYOUTLIST,
} from '../constants/API'

// 首页路口列表
export const getInterList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_INTER_LIST)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_INTER_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getControlRoads = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_CONTROL_ROAD)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_CONTROL_ROAD, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getControlCount = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_CONTROL_COUNT)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_CONTROL_COUNT, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getPlanTime = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_PLAN_TIME)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PLAN_TIME, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getControlStatus = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_CONTROL_STATUS)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_CONTROL_STATUS, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getRealTimeStatus = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_REAL_STATUS)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_REAL_STATUS, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getfaultStatistics = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_FAULT_STATISTICS)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_FAULT_STATISTICS, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getBasicInterInfo = (interId) => {
  return async () => {
    const result = await RestUtil.get(`${API_INTER_INFO}/${interId}`)
    return result
  }
}

export const getLoadPlanTree = (id = '', keyword = '', type = 'district') => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_LOAD_PLANTREE}?id=${id}&searchWord=${keyword}&type=${type}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_LOAD_PLANTREE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getLoadChildTree = (id = '', keyword = '', type = 'district') => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_LOAD_PLANTREE}?id=${id}&searchWord=${keyword}&type=${type}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_LOAD_CHILDTREE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 树形结构父级
export const getVipRoute = (id = '', searchWord = '') => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_ROUTE}?id=${id}&searchWord=${searchWord}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_ROUTE, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}

// 树形结构二级子级
export const getVipRouteChild = (id = '', searchWord = '') => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_ROUTE_CHILD}?id=${id}&searchWord=${searchWord}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_ROUTE_CHILD, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const geteditDistrictInfoThings = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_EDITDISTRICTINFOTHING}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_EDITDISTRICTINFOTHING, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}

// 区域列表
export const getAreaList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_AREA_LIST)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_AREA_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 全局监控
export const getMonitorType = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_MONITORTYPE)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_MONITORTYPE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 全局监控 状态
export const getGlobalMonitor = (type = '1,3,4', state = 'controlState') => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_GLOBALMONITOR}?signalTypes=${type}&statType=${state}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_GLOBALMONITOR, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 全局监控 路口
export const getGlobalUnitInfo = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_GLOBALUNITINFO)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_GLOBALUNITINFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const setEvaInterId = (interId) => {
  return async (dispatch) => {
    dispatch({ type: types.SET_EVAINTERID, payload: interId })
  }
}

export const getLineTreeData = (isLine, id = '', keyword = '') => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_LINETREEDATAS}?id=${id}&searchWord=${keyword}`)
      if (result.data.code === 200) {
        console.log(result.data.data.phaseNoList)
        dispatch({ type: isLine ? types.GET_LINETREEDATAS : types.GET_LINEINTERTREEDATAS, payload: result.data.data.phaseNoList })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

