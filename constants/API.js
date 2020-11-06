/**
 * @file 接口地址
 * author chaohui
 */

export const API_INTER_LIST = '/atms/mainTree/listUnitInfos'
export const API_CONTROL_ROAD = '/atms/mainTree/loadRecentControlUnitList'
export const API_CONTROL_COUNT = '/atms/mainTree/loadThisMonthControlUnitList'
export const API_PLAN_TIME = '/atms/mainTree/loadRecentSignalTimingChangeUnitList'
export const API_CONTROL_STATUS = '/atms/mainTree/signalControlerStatus'
export const API_REAL_STATUS = '/atms/mainTree/signalNormalAndUnNomalStatusSize'
export const API_FAULT_STATISTICS = '/atms/mainTree/loadTodayAndYesterdayAlarmList'
export const API_INTER_INFO = '/atms/mainTree/unitBasicInfo'
export const API_ISSIGNALING = '/atms/singleUnitMonitor/hasSignal'
export const API_SINGALINFO = '/atms/monitor/unitBasicInfo'
export const API_PLAN_STAGE = '/atms/monitor/planRunning'
export const API_PRIMITIVE_INUTUITYPE = '/atms/singleUnitMonitor/initUiType' // 图元设备配置//路口图元配置--初始化路口图元类型
export const API_MONITOR_INFO = '/atms/monitor/monitorInfo'
export const API_PRIMITIVE_BASEMAPIMG = '/atms/basemap/basemapImg' // 图元配置选择底图
export const API_PRIMITIVE_UPDATEBASEMAP = '/atms/basemap/updatebasemap' // 图元配置修改底图
export const API_PRIMITIVE_UPLOAD = '/atms/basemap/upload' // 图元配置上传图片底图
export const API_PRIMITIVE_EDITDEVICEINFOPO = '/atms/singleUnitMonitor/editDeviceInfoPo' // 更改设备位置
export const API_PRIMITIVE_SHOWDEVICEINFO = '/atms/singleUnitMonitor/showDeviceInfo' // 添加设备获取下拉信息与修改设备
export const API_SINGAL_CONTROL = '/atms/singleUnitMonitor/sigalController'
export const API_PRIMITIVE_SHOWUILIST = '/atms/singleUnitMonitor/showUiList' // 添加设备表单页面图标
export const API_PRIMITIVE_EDITDEVICEINFO = '/atms/singleUnitMonitor/editDeviceInfo' // 添加设备
export const API_PRIMITIVE_REMOVEDEVICEINFO = '/atms/singleUnitMonitor/removedeviceinfo' // 设备删除
export const API_PRIMITIVE_REMOVEDEVICEINFOBYID = '/atms/singleUnitMonitor/removedeviceinfoById' // 删除路段名称
export const API_TIME_TABLE = '/atms/hisenseSignal/loadTimeintervalList'
export const API_DELETE_TIMETABLE = '/atms/hisenseSignal/deleteTimeinterval'
export const API_TIMETABLE_ACTIONS = '/atms/hisenseSignal/loadActionNoList'
export const API_TIMETABLE_SAVE = '/atms/hisenseSignal/saveTimeintervalInfo'
export const API_PHASE_LIST = '/atms/hisenseSignal/loadPhaseList'
export const API_SAVE_PHASEINFO = '/atms/hisenseSignal/savePhaseInfo'
export const API_DELETE_PHASE = '/atms/hisenseSignal/deletePhase'
export const API_TIMING_PLAN = '/atms/hisenseSignal/loadPlanList'
export const API_ROAD_LIST = '/atms/hisenseSignal/loadLaneList'
export const API_PHASE_GETDLNAME = '/atms/singleUnitMonitor/getDLName'
export const API_TIMEPLAN_INFO = '/atms/hisenseSignal/loadPlanInfo'
export const API_CHANNLE_LIST = '/atms/hisenseSignal/loadChannelList'
export const API_SAVE_CHANNELINFO = '/atms/hisenseSignal/saveChannelInfo'
export const API_DELETE_CHANNELINFO = '/atms/hisenseSignal/deleteChannel'
export const API_FLOW_DIRECTION = '/atms/hisenseSignal/loadFlowDirectionList'
export const API_BASE_ACTION = '/atms/timing/loadCfgActionInfo'
export const API_SAVE_TIMINGPLAN = '/atms/hisenseSignal/savePlanTime'
export const API_ADD_TIMINGPLAN = '/atms/hisenseSignal/loadPlanInfo_add'
export const API_DELETE_TIMINGPLAN = '/atms/hisenseSignal/deletePlanInfo_hx'
export const API_DELETE_BASEACTION = '/atms/hisenseSignal/deleteAction'
export const API_PLAN_NOLIST = '/atms/hisenseSignal/loadPlanNoList'
export const API_ACTION_NO = '/atms/hisenseSignal/loadActionNoList'
export const API_ADD_ACTION = '/atms/hisenseSignal/saveActionInfo'
export const API_DIRECTION_LIST = '/atms/hisenseSignal/loadDirectionList'
export const API_DIRECTION_FORLANE = '/atms/hisenseSignal/loadFlowDirectionListForLane'
export const API_ROAD_TYPE = '/atms/hisenseSignal/loadLaneTypeList'
export const API_DELETE_ROAD = '/atms/hisenseSignal/deleteLane'
export const API_SAVE_LANEINFO = '/atms/hisenseSignal/saveLaneInfo'
export const API_FLOW_PHASE = '/atms/hisenseSignal/loadFollowPhaseList'
export const API_DELETE_FLOWPHASE = '/atms/hisenseSignal/deleteFollowPhase'
export const API_PHASENO_LIST = '/atms/hisenseSignal/loadPhaseNoList'
export const API_SAVE_FOLLOWPHASE = '/atms/hisenseSignal/saveFollowPhaseInfo'
export const API_SCHEDULE_LIST = '/atms/hisenseSignal/loadScheduleList'
export const API_LOADMANAGEMENT = '/atms/unitManagement/loadManageMent' // 区域管理选择路口
export const API_VALIDATE = '/atms/districtManagement/validate' // 区域管理验证区域是否存在
export const API_LOADUNITNAME = '/atms/districtManagement/loadUnitName' // 区域管理管理单位 // 路口管理
export const API_LOADUNITNAMES = '/atms/districtManagement/loadUnitName'
export const API_SAVEORUPDATEFORM = '/atms/districtManagement/saveOrUpdateForm' // 区域管理区域信息提交
export const API_LOADPLANTREE = '/atms/districtManagement/loadPlanTree' // 区域管理左侧树形图
export const API_EDITDISTRICTINFOTHING = '/atms/districtManagement/editDistrictInfoThing' // 区域管理信息回显
export const API_DELETEDISTRICT = '/atms/districtManagement/deleteDistrict' // 区域管理道路删除
export const API_TIMGINTERVAL_LIST = '/atms/hisenseSignal/loadTimeintervalNoList'
export const API_SCHEDULENO_LIST = '/atms/hisenseSignal/loadScheduleNoList'
export const API_SAVE_SCHEDULEINFO = '/atms/hisenseSignal/saveScheduleInfo'
export const API_DELETE_SCHEDULE = '/atms/hisenseSignal/deleteSchedule'
export const API_FAULTLOG_LIST = '/atms/singleUnitMonitor/showRealAlarms_hx'
export const API_LOAD_PLANTREE = '/atms/districtManagement/loadPlanTree'
export const API_AREA_LIST = '/atms/unitManagement/loadDistrict'
export const API_PLANSTAGE_LIST = '/atms/hisenseSignal/loadPlanInfo_add'
export const API_MONITORTYPE = '/atms/gm/monitorType'
export const API_GLOBALMONITOR = '/atms/gm/signalStateAnalys'
export const API_GLOBALUNITINFO = '/atms/gm/loadUnitInfos'
export const API_STAGEINFOLIST = '/atms/singleUnitMonitor/showCfgStageInfo'
export const API_DELETESTAGE = '/atms/singleUnitMonitor/deleteStage'
export const API_EDITSTAGEINFO = '/atms/singleUnitMonitor/cfgStageInfo'
export const API_SAVESTAGEINFO = '/atms/singleUnitMonitor/editCfgStageInfo'
export const API_STAGEPIC = '/atms/basemap/stageImg'

// 特勤任务
export const API_VIP_ROUTE = '/atms/vip/vipRoute'
export const API_VIP_ROUTE_CHILD = '/atms/vip/vipRoute'
export const API_VIP_ADD_UNITSIFRAM = '/atms/vip/addUnitsIfram' // {vipId}/{unitId} 特勤路线---添加勤务路线下的单个路口
export const API_VIP_DELETE_UNITIFRAM = '/atms/vip/deleteUnitIfram' // {vipId}/{unitId} 特勤路线---删除勤务路线下的单个路口
export const API_VIP_DELETE_VIPROAD = '/atms/vip/deleteVipRoad' // {vipId} 特勤路线---删除勤务路线
export const API_VIP_FIND_ROADBYVIPID = '/atms/vip/findVipRoadByVipId' // {vipId} 特勤路线---勤务路口数据加载
export const API_VIP_FIND_LIST = '/atms/vip/findVipRoadUnitsByVipId' // {vipId}特勤路线---勤务路线路口列表
export const API_VIP_INITROAD = '/atms/vip/initVipRoad' // 特勤路线---路口信息、图片、ip
export const API_VIP_LOADUNIT_STAGES = '/atms/vip/loadunit_stages' // 特勤路线---信号机控制状态
export const API_VIP_SAVEVIPROAD = '/atms/vip/saveVipRoad' // {vipId}/{vipName}/{detail} 特勤路线---添加或者修改勤务路线详细信息
export const API_VIP_SAVEUNITRUNSTAGE = '/atms/vip/saveUnitRunStage' // {vipId}/{unitId}/{stageNo} 特勤路线---修改当前路口得阶段

// 子区域管理
export const API_SUB_DELETEDISTRICT = '/atms/subDistrictManagement/deleteDistrict' // 删除子区域
export const API_SUB_EDITDISTRICTINFOTHING = '/atms/subDistrictManagement/editDistrictInfoThing' // 加载当前区域信息
export const API_SUB_LOADUNITNAME = '/atms/subDistrictManagement/loadUnitName' // 加载当前区域下的存在路口以及不存在路口
export const API_SUB_SAVEORUPDATEFORM = '/atms/subDistrictManagement/saveOrUpdateForm' // 区域信息提交
export const API_SUB_VALIDATE = '/atms/subDistrictManagement/validate' // 验证区域是否存在

// 配时管理
export const API_TIM_GETTIMINGINFO = '/atms/timingManagement/getTimingInfo' // 加载配时列表信息
export const API_TIM_GETTIMINGINFOBYEXCEL = '/atms/timingManagement/getTimingInfoByExcel' // 配时列表导出excel
export const API_TIM_LOADMORE = '/atms/timingManagement/loadmore' // 点击加后所有配时方案信息
export const API_TIM_SAVEORUPDATEFORM = '/atms/timingManagement/saveOrUpdateForm' // 表单提交
export const API_TIM_TEST = '/atms/timingManagement/test' // 测试
export const API_TIM_VALIDATE = '/atms/timingManagement/validate' // 验证路口和相位当前是否存在
export const API_TIM_CODE = '/atms/unitManagement/code' // 信号机品牌
export const API_TIM_CFGIMGS = '/atms/timingManagement/cfgImgs' // 加载当前路口下所有阶段图

// 用户操作日志
export const API_SYS_EXPORTEXCELTHING = '/atms/systemOperationLog/exportExcelThing' // 用户操作日志-导出用户操作日志Excel
export const API_SYS_LOADMANAGEMENT = '/atms/systemOperationLog/loadManageMent' // 用户操作日志-所属用户组-下拉框
export const API_SYS_LOADSYSTEMOPERATIONLOGLIST = '/atms/systemOperationLog/loadSystemOperationLogList' // 用户操作日志-分页查询列表
export const API_SYS_LOADUSER = '/atms/systemOperationLog/loadUser' // 用户操作日志-所属用户-下拉框

// 系统故障日志
export const API_ALARM_DELETE = '/atms/alarmList/delete' // 系统故障日志-删除
export const API_ALARM_EXPORTEXCELTHING = '/atms/alarmList/exportExcelThing' // 系统故障日志-导出Excel
export const API_ALARM_LOADALARMLOGLIST = '/atms/alarmList/loadAlarmLogList' // 系统故障日志-分页查询列表
export const API_ALARM_LOADISTRICT = '/atms/alarmList/loadDistrict' // 系统故障日志-所属区域-下拉框
export const API_ALARM_LOADUNIT = '/atms/alarmList/loadUnit' // 系统故障日志-所属路口-下拉框

// 控制记录日志
export const API_SIGNAL_DELETE = '/atms/signalControlLog/delete' // 控制记录日志-删除
export const API_SIGNAL_EXPORTEXCELTHING = '/atms/signalControlLog/exportExcelThing' // 控制记录日志-导出Excel
export const API_SIGNAL_LOADDISTRICT = '/atms/signalControlLog/loadDistrict' // 系统故障日志-所属路口-下拉框
export const API_SIGNAL_LOADSIGNALCONTROLLOGLIST = '/atms/signalControlLog/loadSignalControlLogList' // 控制记录日志-分页查询列表
export const API_SIGNAL_LOADUNIT = '/atms/signalControlLog/loadUnit' // 控制记录日志-所属路口-下拉框
export const API_SIGNAL_LOADUSER = '/atms/signalControlLog/loadUser' // 控制记录日志-所属用户-下拉框

// 区域优化
export const API_EVLRE_GETINTERDATATREE = '/dws/evlregionOpt/getInterDataTree' // 路口树结构
export const API_EVLRE_ADDEVLREGIONOPTPLAN = '/dws/evlregionOpt/addEvlregionOptPlan' // 保存方案
export const API_EVLRE_GETEVLREGIONOPTSETSELECT = '/dws/evlregionOpt/getEvlregionOptSetSelect' // 区域优化设置下
export const API_EVLRE_GETINTERLSITREFRESH = '/dws/evlregionOpt/getInterListRefresh' // 刷新路口数据
export const API_EVLRE_GETAREAAVGDELAYTIME = '/dws/evlregionOpt/getAreaAvgDelayTime' // 区域平均延误
export const API_EVLRE_GETAREAAVGSPEED = '/dws/evlregionOpt/getAreaAvgSpeed' // 区域平均车速
export const API_EVLRE_GETRDCHLLIST = '/dws/evlregionOpt/getRdchlList' // 根据区域获取干线

// 绿波监视
export const API_LINETREEDATAS = '/atms/greenWaveCoordinate/loadTree' // 树

