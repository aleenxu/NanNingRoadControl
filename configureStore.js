import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'

function configureStore() {
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
  }
  const persistReducers = persistReducer(persistConfig, rootReducer)
  const store = createStore(persistReducers, applyMiddleware(thunk))
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers')
      store.replaceReducer(nextReducer)
    })
  }
  return store
}

export const store = configureStore()
export const persistore = persistStore(store)
