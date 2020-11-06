import * as types from '../constants/ActionTypes'

const logManagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    // 用户操作日志
    case types.GET_SYS_LOADMANAGEMENT:
      return Object.assign({}, state, { loadManageMenter: payload })
    case types.GET_SYS_LOADUSER:
      return Object.assign({}, state, { loaduser: payload })
    case types.GET_SYS_LOADSYSTEMOPERATIONLOGLIST:
      return Object.assign({}, state, { loadSystemOperationLogList: payload })
    case types.GET_SYS_EXPORTEXCELTHING:
      return Object.assign({}, state, { exportExcelThing: payload })
    // 系统故障日志
    case types.GET_ALARM_DELETE:
      return Object.assign({}, state, { aladelete: payload })
    case types.GET_ALARM_EXPORTEXCELTHING:
      return Object.assign({}, state, { alaexportExcelThing: payload })
    case types.GET_ALARM_LOADALARMLOGLIST:
      return Object.assign({}, state, { alaloadAlarmLogList: payload })
    case types.GET_ALARM_LOADISTRICT:
      return Object.assign({}, state, { alaloadDistrict: payload })
    case types.GET_ALARM_LOADUNIT:
      return Object.assign({}, state, { alaloadUnit: payload })
    // 控制记录日志
    case types.GET_SIGNAL_DELETE:
      return Object.assign({}, state, { sigdelete: payload })
    case types.GET_SIGNAL_EXPORTEXCELTHING:
      return Object.assign({}, state, { sigexportExcelThing: payload })
    case types.GET_SIGNAL_LOADDISTRICT:
      return Object.assign({}, state, { sigloadDistrict: payload })
    case types.GET_SIGNAL_LOADSIGNALCONTROLLOGLIST:
      return Object.assign({}, state, { sigloadSignalControlLogList: payload })
    case types.GET_SIGNAL_LOADUNIT:
      return Object.assign({}, state, { sigloadUnit: payload })
    case types.GET_SIGNAL_LOADUSER:
      return Object.assign({}, state, { sigloadUser: payload })
    default:
      return state
  }
}

export default logManagement
