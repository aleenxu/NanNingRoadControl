
import * as types from '../constants/EvaluateTypes'

const evaluate = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_INTERFLOW:
      return Object.assign({}, state, { interflow: payload })
    case types.GET_INTERQUEUE:
      return Object.assign({}, state, { interqueue: payload })
    case types.GET_INTERSATUATION:
      return Object.assign({}, state, { intersatuation: payload })
    case types.GET_INTERSTOPNUM:
      return Object.assign({}, state, { interstopnum: payload })
    case types.GET_INTERRATIO:
      return Object.assign({}, state, { interratio: payload })
    case types.GET_INTERPHASEODD:
      return Object.assign({}, state, { interphaseodd: payload })
    case types.GET_TRUNKLINEDELAYTIME:
      return Object.assign({}, state, { delayTime: payload })
    case types.GET_TRUNKLINESPEED:
      return Object.assign({}, state, { avgspeed: payload })
    case types.GET_TRUNKLINESTOPNUM:
      return Object.assign({}, state, { stopnum: payload })
    case types.GET_TRUNKLINETRAVEROUTE:
      return Object.assign({}, state, { traveroute: payload })
    case types.GET_AREACONGESTIONTIME:
      return Object.assign({}, state, { congestionTime: payload })
    case types.GET_AREADELAYTIME:
      return Object.assign({}, state, { areadelaytime: payload })
    case types.GET_AREAAVGSPEED:
      return Object.assign({}, state, { areaAvgspeed: payload })
    case types.GET_TRAVELTIME:
      return Object.assign({}, state, { travelTime: payload })
    case types.GET_INTERDELAYTIME:
      return Object.assign({}, state, { interDelayTime: payload })
    default:
      return state
  }
}

export default evaluate
