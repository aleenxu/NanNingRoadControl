import * as types from '../constants/ActionTypes'

const secretTask = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_VIP_ADD_UNITSIFRAM:
      return Object.assign({}, state, { vip_addSucess: payload })
    case types.GET_VIP_DELETE_UNITIFRAM:
      return Object.assign({}, state, { vip_delSucess: payload })
    case types.GET_VIP_DELETE_VIPROAD:
      return Object.assign({}, state, { vip_delRoadSucess: payload })
    case types.GET_VIP_FIND_ROADBYVIPID:
      return Object.assign({}, state, { vip_findRoadByVipId: payload })
    case types.GET_VIP_FIND_LIST:
      return Object.assign({}, state, { vip_findList: payload })
    case types.POST_VIP_INITROAD:
      return Object.assign({}, state, { vip_initRoad: payload })
    case types.GET_VIP_LOADUNIT_STAGES:
      return Object.assign({}, state, { vip_loadStages: payload })
    case types.GET_VIP_SAVEVIPROAD:
      return Object.assign({}, state, { vip_saveSucess: payload })
    case types.GET_VIP_SAVEUNITRUNSTAGE:
      return Object.assign({}, state, { vip_unitRunStage: payload })
    default:
      return state
  }
}

export default secretTask
