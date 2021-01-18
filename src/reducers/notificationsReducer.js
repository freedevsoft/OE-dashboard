import { GRAPHQL_API } from '../actions/types'

const initialState = {
  origin_notifications_data: [],
  current_notifications_data: [],
  is_loading: false,
  statusMsg: '',
}

function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case GRAPHQL_API.CHANGE_STATUS_MESSAGE: {
      return { ...state, statusMsg: action.msg, is_loading: action.is_loading }
    }
    case GRAPHQL_API.NOTIFICATIONS_GET_REQUEST: {
      return { ...state, is_loading: true, statusMsg: 'Loading ...' }
    }
    case GRAPHQL_API.NOTIFICATIONS_GET_SUCCESS: {
      return Object.assign({}, state, {
        origin_notifications_data: JSON.parse(JSON.stringify(action.data)),
        current_notifications_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
        statusMsg: 'Loaded',
      })
    }
    case GRAPHQL_API.NOTIFICATIONS_GET_FAILURE: {
      return { ...state, is_loading: false, statusMsg: 'Failed to Load' }
    }
    case GRAPHQL_API.NOTIFICATIONS_SAVE_REQUEST: {
      return { ...state, is_loading: true, statusMsg: 'Saving ...' }
    }
    case GRAPHQL_API.NOTIFICATIONS_SAVE_SUCCESS: {
      return Object.assign({}, state, {
        origin_notifications_data: JSON.parse(JSON.stringify(action.data)),
        current_notifications_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
        statusMsg: 'Saved',
      })
    }
    case GRAPHQL_API.NOTIFICATIONS_SAVE_FAILURE: {
      return { ...state, is_loading: false, statusMsg: 'Failed to Save' }
    }
    default: {
      return state
    }
  }
}

export default notificationsReducer
