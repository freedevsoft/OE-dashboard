import {
  GRAPHQL_API, LAYOUT, ASSIGN_STORY, STATUS_MSG,
} from '../actions/types'

const initialState = {
  origin_galleries_data: [],
  current_galleries_data: [],
  is_loading: false,
  statusMessage: '',
}

function galleriesReducer(state = initialState, action) {
  switch (action.type) {
    case STATUS_MSG.SET_STATUS_MSG: {
      return Object.assign({}, state, {
        statusMessage: action.message,
      })
    }
    case GRAPHQL_API.GALLERIES_SAVE_REQUEST: {
      return { ...state, is_loading: true, statusMessage: 'Saving Sections' }
    }
    case GRAPHQL_API.GALLERIES_SAVE_SUCCESS: {
      return Object.assign({}, state, {
        origin_galleries_data: JSON.parse(JSON.stringify(action.data)),
        current_galleries_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
        statusMessage: 'Success to save sections',
      })
    }
    case GRAPHQL_API.GALLERIES_SAVE_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to save sections',
      }
    }
    case GRAPHQL_API.GALLERIES_ADDUPDATE_REQUEST: {
      return { ...state, is_loading: true, statusMessage: 'Saving Sections' }
    }
    case GRAPHQL_API.GALLERIES_ADDUPDATE_SUCCESS: {
      return { ...state, is_loading: false, statusMessage: 'Saved Sections' }
    }
    case GRAPHQL_API.GALLERIES_ADDUPDATE_FAILURE: {
      return { ...state, is_loading: false, statusMessage: 'Saved Sections' }
    }
    case GRAPHQL_API.GALLERIES_GET_REQUEST: {
      return { ...state, is_loading: true, statusMessage: 'Loading Galleries' }
    }
    case GRAPHQL_API.GALLERIES_GET_SUCCESS: {
      return Object.assign({}, state, {
        origin_galleries_data: JSON.parse(JSON.stringify(action.data)),
        current_galleries_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
        statusMessage: 'Success to load galleries',
      })
    }
    case GRAPHQL_API.GALLERIES_GET_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to load galleries',
      }
    }
    default: {
      return state
    }
  }
}

export default galleriesReducer
