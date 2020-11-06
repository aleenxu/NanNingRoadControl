import * as types from '../constants/ActionTypes'
import RestUtil from '../utils/RestUtil'

import {
  API_LOADMANAGEMENT, API_VALIDATE, API_LOADUNITNAME,
  API_SAVEORUPDATEFORM, API_EDITDISTRICTINFOTHING,
  API_LOADUNITNAMES, API_DELETEDISTRICT, API_LOAD_PLANTREE,
  API_SUB_DELETEDISTRICT, API_SUB_EDITDISTRICTINFOTHING, API_SUB_LOADUNITNAME,
  API_SUB_SAVEORUPDATEFORM, API_SUB_VALIDATE,
  API_TIM_GETTIMINGINFO, API_TIM_GETTIMINGINFOBYEXCEL, API_TIM_SAVEORUPDATEFORM,
  API_TIM_TEST, API_TIM_VALIDATE, API_TIM_CODE, API_TIM_LOADMORE, API_TIM_CFGIMGS,
  API_EVLRE_GETINTERLSITREFRESH, API_EVLRE_GETINTERDATATREE, API_EVLRE_GETAREAAVGDELAYTIME,
  API_EVLRE_GETAREAAVGSPEED, API_EVLRE_GETRDCHLLIST,
} from '../constants/API'

export const getloadManageMent = () => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_LOADMANAGEMENT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_LOADMANAGEMENT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getvalidate = (num) => {
  return async () => {
    const result = await RestUtil.get(`${API_VALIDATE}/${num}`)
    return result
  }
}
export const getloadUnitName = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_LOADUNITNAME}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_LOADUNITNAME, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getloadUnitNames = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_LOADUNITNAMES}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_LOADUNITNAMES, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsaveOrUpdateForm = (params) => {
  return async () => {
    const result = await RestUtil.post(API_SAVEORUPDATEFORM, params)
    return result
  }
}
export const geteditDistrictInfoThing = id => async (dispatch) => {
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
export const getdeleteDistrict = (id) => {
  return async () => {
    const result = await RestUtil.post(`${API_DELETEDISTRICT}/${id}`)
    return result
  }
}
// 子区域
export const getLoadPlanTree = (id = '', keyword = '', type = 'subDistrict') => {
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

export const getLoadChildTree = (id = '', keyword = '', type = 'subDistrict') => {
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
export const getloadPlanLoadChild = (id = '', keyword = '', type = 'subDistrict') => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_LOAD_PLANTREE}?id=${id}&searchWord=${keyword}&type=${type}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_LOAD_PLANLOADCHILD, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsubeditDistrictInfoThing = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_SUB_EDITDISTRICTINFOTHING}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SUB_EDITDISTRICTINFOTHING, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsubloadUnitName = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_SUB_LOADUNITNAME}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SUB_LOADUNITNAME, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsubloadUnitNames = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_SUB_LOADUNITNAME}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SUB_LOADUNITNAMES, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getsubsaveOrUpdateForm = (params) => {
  return async () => {
    const result = await RestUtil.post(API_SUB_SAVEORUPDATEFORM, params)
    return result
  }
}
export const getsubvalidate = (num) => {
  return async () => {
    const result = await RestUtil.get(`${API_SUB_VALIDATE}/${num}`)
    return result
  }
}
export const getnewchildree = num => (dispatch) => {
  try {
    dispatch({ type: types.GET_FLOW_NEWCHILDREE, payload: num })
  } catch (e) {
    console.log(e)
  }
}
export const getnewsubchildree = num => (dispatch) => {
  try {
    dispatch({ type: types.GET_SUB_NEWCHILDREE, payload: num })
  } catch (e) {
    console.log(e)
  }
}
export const getsubdeleteDistrict = (id) => {
  return async () => {
    const result = await RestUtil.post(`${API_SUB_DELETEDISTRICT}/${id}`)
    return result
  }
}

// 配时管理
export const gettimgetTimingInfo = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_TIM_GETTIMINGINFO}?${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_TIM_GETTIMINGINFO, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const gettimingInfoByExcel = id => async (dispatch) => {
  try {
    await RestUtil({
      method: 'get',
      url: `${API_TIM_GETTIMINGINFOBYEXCEL}?${id}`,
      responseType: 'blob',
    }).then((results) => {
      dispatch({ type: types.GET_TIM_GETTIMINGINFOBYEXCEL, payload: results.data })
    })
  } catch (e) {
    console.log(e)
  }
}
export const gettimsaveOrUpdateForm = (obj) => {
  return async () => {
    const result = await RestUtil.post(API_TIM_SAVEORUPDATEFORM, obj)
    return result
  }
}
export const gettimtest = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_TIM_TEST}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_TIM_TEST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const gettimcode = () => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_TIM_CODE}/13`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_TIM_CODE, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getloadmore = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_TIM_LOADMORE}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_TIM_LOADMORE, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getlcflgss = id => async (dispatch) => {
  try {
    const result = await RestUtil.get(`${API_TIM_CFGIMGS}/${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_TIM_CFGIMGS, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const gettimvalidate = (id) => {
  return async () => {
    const result = await RestUtil.get(`${API_TIM_VALIDATE}/${id}`)
    return result
  }
}

// 区域优化
export const getInterDataTree = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_EVLRE_GETINTERDATATREE}`)
    if (result.data.code === '1') {
      dispatch({ type: types.GET_EVLRE_GETINTERDATATREE, payload: result.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getInterListRefresh = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_EVLRE_GETINTERLSITREFRESH}?${id}`)
    if (result.data.code === '1') {
      dispatch({ type: types.GET_EVLRE_GETINTERLSITREFRESH, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getAreaAvgDelayTime = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_EVLRE_GETAREAAVGDELAYTIME}?evlregion_id=${id}`)
    if (result.data.code === '1') {
      dispatch({ type: types.GET_EVLRE_GETAREAAVGDELAYTIME, payload: result.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getAreaAvgSpeed = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_EVLRE_GETAREAAVGSPEED}?evlregion_id=${id}`)
    if (result.data.code === '1') {
      dispatch({ type: types.GET_EVLRE_GETAREAAVGSPEED, payload: result.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getRdchlList = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_EVLRE_GETRDCHLLIST}?ctlregion_id=${id}`)
    if (result.data.code === '1') {
      dispatch({ type: types.GET_EVLRE_GETRDCHLLIST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}