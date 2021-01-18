import { combineReducers } from 'redux'
// Announcer
import notificationsReducer from './notificationsReducer'
import actionBannerReducer from './actionBannerReducer'
import newsReducer from './newsReducer'
// Editor
import galleriesReducer from './galleriesReducer'
import imagesReducer from './imagesReducer'
import collectionsReducer from './collectionsReducer'
import selectedDataReducer from './selectedDataReducer'

const appReducer = asyncReducers => combineReducers({

  // Announcer
  notificationsData: notificationsReducer,
  actionBannerData: actionBannerReducer,
  newsData: newsReducer,

  // Editor
  galleriesData: galleriesReducer,
  imagesData: imagesReducer,
  collectionsData: collectionsReducer,
  selectedData: selectedDataReducer,
  ...asyncReducers,
})

function rootReducer(asyncReducers) {
  return appReducer(asyncReducers)
}

export default rootReducer
