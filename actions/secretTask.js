import * as types from '../constants/ActionTypes'
import RestUtil from '../utils/RestUtil'

import { API_VIP_ADD_UNITSIFRAM, API_VIP_DELETE_UNITIFRAM, API_VIP_DELETE_VIPROAD,
  API_VIP_FIND_ROADBYVIPID, API_VIP_FIND_LIST, API_VIP_INITROAD, API_VIP_LOADUNIT_STAGES, API_VIP_SAVEVIPROAD, API_VIP_SAVEUNITRUNSTAGE   } from '../constants/API'

export const getAddUnitsIfram = (vipId, unitId) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_ADD_UNITSIFRAM}/${vipId}/${unitId}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_ADD_UNITSIFRAM, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getDeleteUnitFram = (vipId, unitId) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_DELETE_UNITIFRAM}/${vipId}/${unitId}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_DELETE_UNITIFRAM, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getDeleteVipRoad = ( vipId ) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_DELETE_VIPROAD}/${vipId}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_DELETE_VIPROAD, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getFindRoadByVipId = ( vipId ) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_FIND_ROADBYVIPID}/${vipId}`)
    if (result.data.code === 200) {
      debugger
      dispatch({ type: types.GET_VIP_FIND_ROADBYVIPID, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getFindList = (vipId) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_FIND_LIST}/${vipId}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_FIND_LIST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getInitRoad = ( vipInfo ) => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_VIP_INITROAD}`, vipInfo)
    if (result.data.code === 200) {
      dispatch({ type: types.POST_VIP_INITROAD, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getLoadUnitStage = () => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_LOADUNIT_STAGES}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_LOADUNIT_STAGES, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getSaveVipRoad = (vipId = '', vipName = '', detail = '' ) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_SAVEVIPROAD}?vipId=${vipId}&vipName=${vipName}&detail=${detail}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_SAVEVIPROAD, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getSaveUnitRunStage = (vipId = '', unitId = '', stageNo = '' ) => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_VIP_SAVEUNITRUNSTAGE}/${vipId}/${unitId}/${stageNo}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_VIP_SAVEUNITRUNSTAGE, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
