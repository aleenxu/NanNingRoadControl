import * as types from '../constants/ActionTypes'

const managements = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_LOADMANAGEMENT:
      return Object.assign({}, state, { loadManageMent: payload })
    case types.GET_VALIDATE:
      return Object.assign({}, state, { validate: payload })
    case types.GET_LOADUNITNAME:
      return Object.assign({}, state, { loadUnitName: payload })
    case types.GET_LOADUNITNAMES:
      return Object.assign({}, state, { loadUnitNames: payload })
    case types.GET_SAVEORUPDATEFORM:
      return Object.assign({}, state, { saveOrUpdateForm: payload })
    case types.GET_LOADPLANTREE:
      return Object.assign({}, state, { loadPlanTree: payload })
    case types.GET_LOAD_PLANLOAD:
      return Object.assign({}, state, { loadPlanLoad: payload })
    case types.GET_DELETEDISTRICT:
      return Object.assign({}, state, { deleteDistrict: payload })
    // 子区域管理
    case types.GET_SUB_DELETEDISTRICT:
      return Object.assign({}, state, { subdeleteDistrict: payload })
    case types.GET_SUB_VALIDATE:
      return Object.assign({}, state, { subvalidate: payload })
    case types.GET_SUB_LOADUNITNAME:
      return Object.assign({}, state, { subloadUnitName: payload })
    case types.GET_SUB_LOADUNITNAMES:
      return Object.assign({}, state, { subloadUnitNames: payload })
    case types.GET_SUB_SAVEORUPDATEFORM:
      return Object.assign({}, state, { subsaveOrUpdateForm: payload })
    case types.GET_SUB_EDITDISTRICTINFOTHING:
      return Object.assign({}, state, { subeditDistrictInfoThing: payload })
    case types.GET_FLOW_NEWCHILDREE:
      return Object.assign({}, state, { loadPlanTree: payload })
    case types.GET_LOAD_PLANLOADCHILD:
      return Object.assign({}, state, { loadPlanloadchildsr: payload })
    case types.GET_SUB_NEWCHILDREE:
      return Object.assign({}, state, { loadPlanLoadChild: payload })
    case types.GET_LOAD_PLANTREE:
      return Object.assign({}, state, { loadPlanTree: payload })
    // 配时管理
    case types.GET_TIM_GETTIMINGINFO:
      return Object.assign({}, state, { getTimingInfo: payload })
    case types.GET_TIM_GETTIMINGINFOBYEXCEL:
      return Object.assign({}, state, { getTimingInfoByExcel: payload })
    case types.GET_TIM_SAVEORUPDATEFORM:
      return Object.assign({}, state, { saveOrUpdateForm: payload })
    case types.GET_TIM_TEST:
      return Object.assign({}, state, { test: payload })
    case types.GET_TIM_CODE:
      return Object.assign({}, state, { code: payload })
    case types.GET_TIM_LOADMORE:
      return Object.assign({}, state, { loadmore: payload })
    case types.GET_TIM_CFGIMGS:
      return Object.assign({}, state, { cfgImgs: payload })
    // 区域优化
    case types.GET_EVLRE_GETINTERDATATREE:
      return Object.assign({}, state, { InterDataTree: payload })
    case types.GET_EVLRE_ADDEVLREGIONOPTPLAN:
      return Object.assign({}, state, { addEvlregionOptPlan: payload })
    case types.GET_EVLRE_GETEVLREGIONOPTSETSELECT:
      return Object.assign({}, state, { EvlregionOptSetSelect: payload })
    case types.GET_EVLRE_GETINTERLSITREFRESH:
      return Object.assign({}, state, { InterListRefresh: payload })
    case types.GET_EVLRE_GETAREAAVGDELAYTIME:
      return Object.assign({}, state, { AreaAvgDelayTime: payload })
    case types.GET_EVLRE_GETAREAAVGSPEED:
      return Object.assign({}, state, { AreaAvgSpeed: payload })
    case types.GET_EVLRE_GETRDCHLLIST:
      return Object.assign({}, state, { RdchlList: payload })
    default:
      return state
  }
}

export default managements
