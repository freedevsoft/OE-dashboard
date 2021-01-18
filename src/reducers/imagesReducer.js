import { GRAPHQL_API, STORIES } from '../actions/types'

const initialState = {
  origin_images_data: [],
  current_images_data: [],
  is_loading: false,
}

function imagesReducer(state = initialState, action) {
  switch (action.type) {
    case GRAPHQL_API.IMAGES_SAVE_REQUEST: {
      return { ...state, is_loading: true }
    }
    case GRAPHQL_API.IMAGES_SAVE_SUCCESS: {
      return Object.assign({}, state, {
        origin_images_data: JSON.parse(JSON.stringify(action.data)),
        current_images_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
      })
    }
    case GRAPHQL_API.IMAGES_SAVE_FAILURE: {
      return { ...state, is_loading: false }
    }
    case GRAPHQL_API.IMAGES_GET_REQUEST: {
      return { ...state, is_loading: true }
    }
    case GRAPHQL_API.IMAGES_GET_SUCCESS: {
      return Object.assign({}, state, {
        origin_images_data: JSON.parse(JSON.stringify(action.data)),
        current_images_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
      })
    }
    case GRAPHQL_API.IMAGES_GET_FAILURE: {
      return { ...state, is_loading: false }
    }
    default: {
      return state
    }
  }
}

export default imagesReducer
