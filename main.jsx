import React from 'react'
import reactDom from 'react-dom'
import Loadable from 'react-loadable'
import { HashRouter, BrowserRouter, Route, BrowserHistory, Redirect, Switch } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { PersistGate } from 'redux-persist/lib/integration/react'
import zhCN from 'antd/es/locale/zh_CN'

import './app.css'
import { store, persistore } from './configureStore'
import LoadingPage from './components/LoadingPage/LoadingPage'
import RedirectCom from './components/RedirectCom/RedirectCom'
// import RealTime from './TestRealTimeGreenWave'

const Loading = () => <LoadingPage />
const Login = Loadable({
  loader: () => import('./containers/Login/Login'),
  loading: Loading,
  delay: 0,
})
const Header = Loadable({
  loader: () => import('./containers/HomePage/Header/Header'),
  loading: Loading,
  delay: 0,
})
const InterDetails = Loadable({
  loader: () => import('./containers/PolicyDecision/InterDetails/InterDetails'),
  loading: Loading,
  delay: 0,
})
const HomePage = Loadable({
  loader: () => import('./containers/PolicyDecision/SignalHome/SignalHome'),
  loading: Loading,
  delay: 0,
})
const Monitoring = Loadable({
  loader: () => import('./containers/PolicyDecision/Monitoring/Monitoring'),
  loading: Loading,
  delay: 0,
})
const SteppingManage = Loadable({
  loader: () => import('./containers/PolicyDecision/SteppingManage/SteppingManage'),
  loading: Loading,
  delay: 0,
})
const SecretTask = Loadable({
  loader: () => import('./containers/PolicyDecision/SecretTask/SecretTask'),
  loading: Loading,
  delay: 0,
})
const TrunkLineCoordinate = Loadable({
  loader: () => import('./containers/PolicyDecision/TrunkLineCoordinate/TrunkLineCoordinate'),
  loading: Loading,
  delay: 0,
})
const TrunkLineMonitoring = Loadable({
  loader: () => import('./containers/PolicyDecision/TrunkLineMonitoring/TrunkLineMonitoring'),
  loading: Loading,
  delay: 0,
})
const AreaCoordinate = Loadable({
  loader: () => import('./containers/PolicyDecision/AreaCoordinate/AreaCoordinate'),
  loading: Loading,
  delay: 0,
})
const Surveillance = Loadable({
  loader: () => import('./containers/PolicyDecision/Surveillance/Surveillance'),
  loading: Loading,
  delay: 0,
})
const InterManagement = Loadable({
  loader: () => import('./containers/PolicyDecision/InterManagement/InterManagement'),
  loading: Loading,
  delay: 0,
})
const RegiolManagement = Loadable({
  loader: () => import('./containers/PolicyDecision/RegiolManagement/RegiolManagement'),
  loading: Loading,
  delay: 0,
})
const RegiolManagementChild = Loadable({
  loader: () => import('./containers/PolicyDecision/RegiolManagementChild/RegiolManagementChild'),
  loading: Loading,
  delay: 0,
})
const Timanagement = Loadable({
  loader: () => import('./containers/PolicyDecision/Timanagement/Timing'),
  loading: Loading,
  delay: 0,
})
const Trafficsystem = Loadable({
  loader: () => import('./containers/SystemManage/TrafficSystem'),
  loading: Loading,
  delay: 0,
})
// const Entrance = Loadable({
//   loader: () => import('./containers/EntrancePlus/EntrancePlus'),
//   loading: Loading,
//   delay: 0,
// })
// const Inter = Loadable({
//   loader: () => import('./containers/Evaluate/Inter/Inter'),
//   loading: Loading,
//   delay: 0,
// })
// const Area = Loadable({
//   loader: () => import('./containers/Evaluate/Area/Area'),
//   loading: Loading,
//   delay: 0,
// })
// const Artery = Loadable({
//   loader: () => import('./containers/Evaluate/Artery/Artery'),
//   loading: Loading,
//   delay: 0,
// })

// const Optimize = Loadable({
//   loader: () => import('./containers/PolicyDecision/optimize/optimize'),
//   loading: Loading,
//   delay: 0,
// })



// const AreaOptimize = Loadable({
//   loader: () => import('./containers/PolicyDecision/AreaOptimize/AreaOptimize'),
//   loading: Loading,
//   delay: 0,
// })




const Usergroup = Loadable({
  loader: () => import('./containers/SystemManage/Usergroup'),
  loading: Loading,
  delay: 0,
})
// const Journal = Loadable({
//   loader: () => import('./containers/SystemManage/Journal'),
//   loading: Loading,
//   delay: 0,
// })
// const TrafficMenu = Loadable({
//   loader: () => import('./containers/SystemManage/TrafficMenu'),
//   loading: Loading,
//   delay: 0,
// })
const Jurisdiction = Loadable({
  loader: () => import('./containers/SystemManage/Jurisdiction'),
  loading: Loading,
  delay: 0,
})
const UserActionLog = Loadable({
  loader: () => import('./containers/SystemManage/UserActionLog/UserActionLog'),
  loading: Loading,
  delay: 0,
})
const SystemFaultLog = Loadable({
  loader: () => import('./containers/SystemManage/SystemFaultLog/SystemFaultLog'),
  loading: Loading,
  delay: 0,
})
const SignalControlRecord = Loadable({
  loader: () => import('./containers/SystemManage/SignalControlRecord/SignalControlRecord'),
  loading: Loading,
  delay: 0,
})

// const GreenWaveMonitor = Loadable({
//   loader: () => import('./containers/PolicyDecision/GreenWave/GreenWave'),
//   loading: Loading,
//   delay: 0,
// })
// const HomePage = Loadable({
//   loader: () => import('./containers/HomePage/HomePage'),
//   loading: Loading,
//   delay: 0,
// })
// const EvaHome = Loadable({
//   loader: () => import('./containers/Evaluate/EvaHome/HomePage'),
//   loading: Loading,
//   delay: 0,
// })

// const OptInter = Loadable({
//   loader: () => import('./containers/PolicyDecision/OptInter/optInter'),
//   loading: Loading,
//   delay: 0,
// })

const Parent = () => (
  <div style={{ height: '100%' }}>
    <Route path="*" component={Header} />
    <Route exact path="/home" component={HomePage} />
    <Route exact path="/monitoring" component={Monitoring} />
    <Route exact path="/steppingManage" component={SteppingManage} />
    <Route exact path="/secretTask" component={SecretTask} />
    <Route exact path="/trunkLineCoordinate" component={TrunkLineCoordinate} />
    <Route exact path="/trunkLineMonitoring" component={TrunkLineMonitoring} />
    <Route exact path="/areaCoordinate" component={AreaCoordinate} />
    <Route exact path="/surveillance" component={Surveillance} />
    <Route exact path="/InterManagement" component={InterManagement} />
    <Route exact path="/RegiolManagement" component={RegiolManagement} />
    <Route exact path="/RegiolManagementChild" component={RegiolManagementChild} />
    <Route exact path="/timanagement" component={Timanagement} />
    <Route exact path="/trafficsystem" component={Trafficsystem} />
    <Route exact path="/usergroup" component={Usergroup} />
    <Route exact path="/jurisdiction" component={Jurisdiction} />
    <Route exact path="/useractionlog" component={UserActionLog} />
    <Route exact path="/systemfaultlog" component={SystemFaultLog} />
    <Route exact path="/signalcontrolrecord" component={SignalControlRecord} />
    {/* <Route exact path="/signalhome" component={SignalHome} />
    <Route exact path="/evahome" component={EvaHome} />
    <Route exact path="/inter" component={Inter} />
    <Route exact path="/area" component={Area} />
    <Route exact path="/artery" component={Artery} />
    <Route exact path="/optimize" component={Optimize} />
    <Route exact path="/areaOptimize" component={AreaOptimize} />
    <Route exact path="/journal" component={Journal} />
    <Route exact path="/trafficMenu" component={TrafficMenu} />
    <Route exact path="/greenwavemonitor" component={GreenWaveMonitor} />
    <Route exact path="/optInter" component={OptInter} />
    <Route path="/realtime" component={RealTime} />
    <Route path="/entrance" component={Entrance} /> */}
  </div>
)
reactDom.render(
  <AppContainer>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <PersistGate loading="null" persistor={persistore}>
          <BrowserRouter basename="" history={BrowserHistory}>
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route exact path="/login" component={Login} />
              <Route exact path="/interdetails" component={InterDetails} />
              <Route exact path="/redirect" component={RedirectCom} />
              <Route path="/" component={Parent} />
            </Switch>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  </AppContainer>
  , document.getElementById('content'),
)
