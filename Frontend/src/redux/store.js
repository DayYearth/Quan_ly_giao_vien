import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import accountReducer from './slice/accountSlide'
import orderReducer  from './slice/orderSlide'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'] // account will not be persisted
}

const rootReducer = combineReducers({
  account: accountReducer,
  myOrder: orderReducer
}); 

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

let persistor = persistStore(store);

export { store, persistor };