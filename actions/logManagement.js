import * as types from '../constants/ActionTypes'
import RestUtil from '../utils/RestUtil'

import {
  API_SYS_LOADMANAGEMENT, // 用户操作日志
  API_SYS_LOADUSER,
  API_SYS_LOADSYSTEMOPERATIONLOGLIST,
  API_SYS_EXPORTEXCELTHING,
  API_ALARM_DELETE, // 系统故障日志
  API_ALARM_EXPORTEXCELTHING,
  API_ALARM_LOADALARMLOGLIST,
  API_ALARM_LOADISTRICT,
  API_ALARM_LOADUNIT,
  API_SIGNAL_DELETE, // 信号控制记录
  API_SIGNAL_EXPORTEXCELTHING,
  API_SIGNAL_LOADDISTRICT,
  API_SIGNAL_LOADSIGNALCONTROLLOGLIST,
  API_SIGNAL_LOADUNIT,
  API_SIGNAL_LOADUSER,
} from '../constants/API'

// 用户操作日志
export const getloadManageMent = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SYS_LOADMANAGEMENT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SYS_LOADMANAGEMENT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getloaduser = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SYS_LOADUSER}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SYS_LOADUSER, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getloadSystemOperationLogList = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SYS_LOADSYSTEMOPERATIONLOGLIST}?${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SYS_LOADSYSTEMOPERATIONLOGLIST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getexportExcelThing = id => async (dispatch) => {
  try {
    await RestUtil({
      method: 'post',
      url: `${API_SYS_EXPORTEXCELTHING}?${id}`,
      responseType: 'blob',
    }).then((results) => {
      dispatch({ type: types.GET_SYS_EXPORTEXCELTHING, payload: results.data })
    })
  } catch (e) {
    console.log(e)
  }
}

// 系统故障日志
export const getaladelete = (id, times) => {
  return async () => {
    const result = await RestUtil.post(`${API_ALARM_DELETE}?id=${id}&updateTime=${times}`)
    return result
  }
}
export const getalaexportExcelThing = id => async (dispatch) => {
  try {
    await RestUtil({
      method: 'post',
      url: `${API_ALARM_EXPORTEXCELTHING}?${id}`,
      responseType: 'blob',
    }).then((results) => {
      dispatch({ type: types.GET_ALARM_EXPORTEXCELTHING, payload: results.data })
    })
  } catch (e) {
    console.log(e)
  }
}
export const getalaloadAlarmLogList = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_ALARM_LOADALARMLOGLIST}?${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_ALARM_LOADALARMLOGLIST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getalaloadDistrict = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_ALARM_LOADISTRICT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_ALARM_LOADISTRICT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getalaloadUnit = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_ALARM_LOADUNIT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_ALARM_LOADUNIT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}

// 信号控制记录
export const getsigdelete = (id, times) => {
  return async () => {
    const result = await RestUtil.post(`${API_SIGNAL_DELETE}?id=${id}&updateTime=${times}`)
    return result
  }
}
export const getsigexportExcelThing = id => async (dispatch) => {
  try {
    await RestUtil({
      method: 'post',
      url: `${API_SIGNAL_EXPORTEXCELTHING}?${id}`,
      responseType: 'blob',
    }).then((results) => {
      dispatch({ type: types.GET_SIGNAL_EXPORTEXCELTHING, payload: results.data })
    })
  } catch (e) {
    console.log(e)
  }
}
export const getsigloadDistrict = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SIGNAL_LOADDISTRICT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SIGNAL_LOADDISTRICT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsigloadSignalControlLogList = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SIGNAL_LOADSIGNALCONTROLLOGLIST}?${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SIGNAL_LOADSIGNALCONTROLLOGLIST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}

export const getsigloadUnit = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SIGNAL_LOADUNIT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SIGNAL_LOADUNIT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsigloadUser = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SIGNAL_LOADUSER}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SIGNAL_LOADUSER, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}