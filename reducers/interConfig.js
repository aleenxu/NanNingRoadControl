/**
 * @file actions dispatch reducer
 */
import * as types from '../constants/ActionTypes'

const interConfig = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_ISSIGNALING:
      return Object.assign({}, state, { issignaling: payload })
    case types.GET_SINGAL_INFO:
      return Object.assign({}, state, { sinaglInfo: payload })
    case types.GET_PLAN_STAGE:
      return Object.assign({}, state, { planStage: payload })
    case types.GET_PRIMITIVE_INUTUITYPE:
      return Object.assign({}, state, { primitiveInutuitype: payload })
    case types.GET_MONITOR_INFO:
      return Object.assign({}, state, { monitorInfo: payload })
    case types.GET_PRIMITIVE_BASEMAPIMG:
      return Object.assign({}, state, { basemapImg: payload })
    // case types.GET_PRIMITIVE_UICONFIG:
    //   return Object.assign({}, state, { uiConfig: payload })
    case types.GET_PRIMITIVE_UPDATEBASEMAP:
      return Object.assign({}, state, { updatebasemap: payload })
    case types.GET_PRIMITIVE_UPLOAD:
      return Object.assign({}, state, { upload: payload })
    case types.GET_PRIMITIVE_EDITDEVICEINFOPO:
      return Object.assign({}, state, { editDeviceInfoPo: payload })
    case types.GET_PRIMITIVE_SHOWDEVICEINFO:
      return Object.assign({}, state, { showDeviceInfo: payload })
    case types.GET_SINGAL_CONTROL:
      return Object.assign({}, state, { singalControler: payload })
    case types.GET_PRIMITIVE_SHOWUILIST:
      return Object.assign({}, state, { showUiList: payload })
    case types.GET_PRIMITIVE_EDITDEVICEINFO:
      return Object.assign({}, state, { editDeviceInfo: payload })
    case types.GET_PRIMITIVE_REMOVEDEVICEINFO:
      return Object.assign({}, state, { removedeviceinfo: payload })
    case types.GET_PRIMITIVE_REMOVEDEVICEINFOBYID:
      return Object.assign({}, state, { removedeviceinfoById: payload })
    case types.GET_TIME_TABLE:
      return Object.assign({}, state, { timeTable: payload })
    case types.GET_TIMETABLE_ACTIONS:
      return Object.assign({}, state, { timeTableActions: payload })
    case types.GET_TIMETABLE_SAVE:
      return Object.assign({}, state, { timeTableSave: payload })
    case types.GET_PHASE_LIST:
      return Object.assign({}, state, { phaseLists: payload })
    case types.GET_TIMING_PLAN:
      return Object.assign({}, state, { timingPlan: payload })
    case types.GET_ROAD_LIST:
      return Object.assign({}, state, { roadList: payload })
    case types.GET_PHASE_GETDLNAME:
      return Object.assign({}, state, { getDLName: payload })
    case types.GET_TIMEPLAN_INFO:
      return Object.assign({}, state, { timePlanInfo: payload })
    case types.GET_CHANNLE_LIST:
      return Object.assign({}, state, { channelList: payload })
    case types.GET_FLOW_DIRECTION:
      return Object.assign({}, state, { flowDirections: payload })
    case types.GET_BASE_ACTION:
      return Object.assign({}, state, { baseActions: payload })
    case types.GET_ADD_TIMINGPLAN:
      return Object.assign({}, state, { addTimingPlan: payload })
    case types.GET_ACTION_NO:
      return Object.assign({}, state, { actionNoList: payload })
    case types.GET_PLAN_NOLIST:
      return Object.assign({}, state, { planNoList: payload })
    case types.GET_DIRECTION_LIST:
      return Object.assign({}, state, { directionList: payload })
    case types.GET_DIRECTION_FORLANE:
      return Object.assign({}, state, { directionForLane: payload })
    case types.GET_ROAD_TYPE:
      return Object.assign({}, state, { roadTypeList: payload })
    case types.GET_FLOW_PHASE:
      return Object.assign({}, state, { flowPhase: payload })
    case types.GET_PHASENO_LIST:
      return Object.assign({}, state, { phaseNoList: payload })
    case types.GET_SCHEDULE_LIST:
      return Object.assign({}, state, { scheduleList: payload })
    case types.GET_TIMGINTERVAL_LIST:
      return Object.assign({}, state, { timeIntervalList: payload })
    case types.GET_SCHEDULENO_LIST:
      return Object.assign({}, state, { scheduleNoList: payload })
    case types.GET_FAULTLOG_LIST:
      return Object.assign({}, state, { faultLogList: payload })
    case types.GET_PLANSTAGE_LIST:
      return Object.assign({}, state, { planStageList: payload })
    case types.GET_STAGEINFO:
      return Object.assign({}, state, { stageInfoList: payload })
    case types.GET_EDITSTAGEINFO:
      return Object.assign({}, state, { editStageInfo: payload })
    case types.GET_STAGEPIC:
      return Object.assign({}, state, { stagePics: payload })
    default:
      return state
  }
}

export default interConfig
