/**
 * @file actions
 */

import * as types from '../constants/ActionTypes'
import RestUtil from '../utils/RestUtil'
import {
  API_ISSIGNALING,
  API_SINGALINFO,
  API_PLAN_STAGE,
  API_PRIMITIVE_INUTUITYPE,
  API_MONITOR_INFO,
  API_PRIMITIVE_BASEMAPIMG,
  API_PRIMITIVE_UPDATEBASEMAP,
  API_PRIMITIVE_EDITDEVICEINFOPO,
  API_PRIMITIVE_SHOWDEVICEINFO,
  API_SINGAL_CONTROL,
  API_PRIMITIVE_SHOWUILIST,
  API_PRIMITIVE_EDITDEVICEINFO,
  API_TIME_TABLE,
  API_DELETE_TIMETABLE,
  API_TIMETABLE_ACTIONS,
  API_PRIMITIVE_REMOVEDEVICEINFO,
  API_PRIMITIVE_REMOVEDEVICEINFOBYID,
  API_TIMETABLE_SAVE,
  API_PHASE_LIST,
  API_SAVE_PHASEINFO,
  API_DELETE_PHASE,
  API_TIMING_PLAN,
  API_ROAD_LIST,
  API_PHASE_GETDLNAME,
  API_TIMEPLAN_INFO,
  API_CHANNLE_LIST,
  API_SAVE_CHANNELINFO,
  API_DELETE_CHANNELINFO,
  API_FLOW_DIRECTION,
  API_BASE_ACTION,
  API_SAVE_TIMINGPLAN,
  API_ADD_TIMINGPLAN,
  API_DELETE_TIMINGPLAN,
  API_DELETE_BASEACTION,
  API_ACTION_NO,
  API_PLAN_NOLIST,
  API_ADD_ACTION,
  API_DIRECTION_LIST,
  API_DIRECTION_FORLANE,
  API_ROAD_TYPE,
  API_DELETE_ROAD,
  API_SAVE_LANEINFO,
  API_FLOW_PHASE,
  API_DELETE_FLOWPHASE,
  API_PHASENO_LIST,
  API_SAVE_FOLLOWPHASE,
  API_SCHEDULE_LIST,
  API_TIMGINTERVAL_LIST,
  API_SCHEDULENO_LIST,
  API_SAVE_SCHEDULEINFO,
  API_DELETE_SCHEDULE,
  API_FAULTLOG_LIST,
  API_PLANSTAGE_LIST,
  API_STAGEINFOLIST,
  API_DELETESTAGE,
  API_EDITSTAGEINFO,
  API_SAVESTAGEINFO,
  API_STAGEPIC,

} from '../constants/API'

export const getInterdetailIsSignalling = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_ISSIGNALING}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_ISSIGNALING, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSingalInfo = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SINGALINFO}/${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_SINGAL_INFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getPlanStage = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PLAN_STAGE}/${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PLAN_STAGE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
export const getprimitiveInutuitype = () => { // 获取设备配置
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PRIMITIVE_INUTUITYPE}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_INUTUITYPE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getMonitorInfo = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_MONITOR_INFO}/${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_MONITOR_INFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
export const getbasemapImg = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PRIMITIVE_BASEMAPIMG}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_BASEMAPIMG, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getupdatebasemap = (interId, imgname) => {
  return (dispatch) => {
    try {
      const promises = new Promise((resolve) => {
        const result = RestUtil.post(`${API_PRIMITIVE_UPDATEBASEMAP}?unitId=${interId}&unitbackgroundimg=${imgname}`)
        resolve(result)
      })
      dispatch({ type: types.GET_PRIMITIVE_UPDATEBASEMAP, payload: promises })
    } catch (e) {
      console.log(e)
    }
  }
}

export const geteditDeviceInfoPo = (interId, pLeft, pTop) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PRIMITIVE_EDITDEVICEINFOPO}?pLeft=${pLeft}&pTop=${pTop}&uiId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_EDITDEVICEINFOPO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getshowDeviceInfo = (uiId, unitId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PRIMITIVE_SHOWDEVICEINFO}?uiId=${uiId}&unitId=${unitId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_SHOWDEVICEINFO, payload: result.data }) // 接收唯一编号message
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
export const getshowUiList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PRIMITIVE_SHOWUILIST}?uiType=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_SHOWUILIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSingalController = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_SINGAL_CONTROL}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_SINGAL_CONTROL, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const geteditDeviceInfo = (params) => {
  return async () => {
    const result = await RestUtil.post(API_PRIMITIVE_EDITDEVICEINFO, params)
    return result
  }
}

export const getremovedeviceinfo = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_PRIMITIVE_REMOVEDEVICEINFO}?deviceId=${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_REMOVEDEVICEINFO, payload: result.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
export const getremovedeviceinfoById = (id) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_PRIMITIVE_REMOVEDEVICEINFOBYID}?id=${id}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PRIMITIVE_REMOVEDEVICEINFOBYID, payload: result.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getTimeTable = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_TIME_TABLE}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_TIME_TABLE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getDeleteTimeTable = (id) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_TIMETABLE}?id=${id}`)
    return result
  }
}

export const getTimetableActions = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_TIMETABLE_ACTIONS}?id=0&unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_TIMETABLE_ACTIONS, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSaveTimeTable = (params) => {
  return async () => {
    const result = await RestUtil.post(API_TIMETABLE_SAVE, params)
    return result
  }
}

export const getPhaseList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_PHASE_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PHASE_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSavePhaseInfo = (type, params) => {
  return async () => {
    const result = await RestUtil.post(`${API_SAVE_PHASEINFO}?type=${type}`, params)
    return result
  }
}

export const getDeletePhaseInfo = (phaseNo, interId) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_PHASE}?phaseNo=${phaseNo}&unitId=${interId}`)
    return result
  }
}

export const getTimingPlan = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_TIMING_PLAN}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_TIMING_PLAN, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getRoadLists = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_ROAD_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_ROAD_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getDLNames = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PHASE_GETDLNAME}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PHASE_GETDLNAME, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getTimePlanInfo = (id, planNo, interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_TIMEPLAN_INFO}?id=${id}&planNo=${planNo}&unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_TIMEPLAN_INFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getChannelConfig = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_CHANNLE_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_CHANNLE_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSaveChannelInfo = (type, params) => {
  return async () => {
    const result = await RestUtil.post(`${API_SAVE_CHANNELINFO}?type=${type}`, params)
    return result
  }
}

export const getDeleteChannelInfo = (channelNo, interId) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_CHANNELINFO}?channelNo=${channelNo}&unitId=${interId}`)
    return result
  }
}

export const getSaveTimingPlan = (params) => {
  return async () => {
    const result = await RestUtil.post(API_SAVE_TIMINGPLAN, params)
    return result
  }
}

export const getDeleteTimingPlan = (planNo, interId) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_TIMINGPLAN}?planNo=${planNo}&unitId=${interId}`)
    return result
  }
}

export const getDeleteBaseAction = (id) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_BASEACTION}?id=${id}`)
    return result
  }
}

export const getAddActions = (params) => {
  return async () => {
    const result = await RestUtil.post(API_ADD_ACTION, params)
    return result
  }
}

export const getDeleteRoad = (params) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_ROAD}${params}`)
    return result
  }
}

export const getSaveLaneInfo = (type, params) => {
  return async () => {
    const result = await RestUtil.post(`${API_SAVE_LANEINFO}?type=${type}`, params)
    return result
  }
}

export const getDeleteFlowPhase = (folowNo, interId) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_FLOWPHASE}?followNo=${folowNo}&unitId=${interId}`)
    return result
  }
}

export const getSaveFollowPhase = (type, params) => {
  return async () => {
    const result = await RestUtil.post(`${API_SAVE_FOLLOWPHASE}?type=${type}`, params)
    return result
  }
}

export const getFlowDirections = (direction) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_FLOW_DIRECTION}?direction=${direction}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_FLOW_DIRECTION, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getBaseAction = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_BASE_ACTION}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_BASE_ACTION, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getAddTimingPlan = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_ADD_TIMINGPLAN}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_ADD_TIMINGPLAN, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getActionNoList = (id, interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_ACTION_NO}?id=${id}&unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_ACTION_NO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getPlanNoList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_PLAN_NOLIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PLAN_NOLIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getDirectionList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(API_DIRECTION_LIST)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_DIRECTION_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getDirectionForLane = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(API_DIRECTION_FORLANE)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_DIRECTION_FORLANE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getRoadTypeList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(API_ROAD_TYPE)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_ROAD_TYPE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getFlowPhaseList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_FLOW_PHASE}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_FLOW_PHASE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getPhaseNoList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_PHASENO_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PHASENO_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getScheduleList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_SCHEDULE_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_SCHEDULE_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getRimgIntervalList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_TIMGINTERVAL_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_TIMGINTERVAL_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getScheduleNoList = (id, interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_SCHEDULENO_LIST}?id=${id}&unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_SCHEDULENO_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getSaveScheduleInfo = (params) => {
  return async () => {
    const result = await RestUtil.post(API_SAVE_SCHEDULEINFO, params)
    return result
  }
}

export const getDeleteScheduleInfo = (id) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETE_SCHEDULE}?id=${id}`)
    return result
  }
}

export const getFaultLogList = (type, interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_FAULTLOG_LIST}?faultType=${type}&unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_FAULTLOG_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getPlanStageList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PLANSTAGE_LIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_PLANSTAGE_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getStageInfoList = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_STAGEINFOLIST}?unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_STAGEINFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getEditStageInfo = (id, interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_EDITSTAGEINFO}?id=${id}&unitId=${interId}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_EDITSTAGEINFO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getStagePics = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_STAGEPIC)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_STAGEPIC, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getAddSaveStage = (params) => {
  return async () => {
    const result = await RestUtil.post(API_SAVESTAGEINFO, params)
    return result
  }
}

export const getDeleteStage = (id) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETESTAGE}?id=${id}`)
    return result
  }
}

