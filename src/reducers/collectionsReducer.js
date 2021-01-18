import { GRAPHQL_API } from '../actions/types'

const initialState = {
  origin_collections_data: [],
  current_collections_data: [],
  is_loading: false,
  statusMessage: '',
}

function collectionsReducer(state = initialState, action) {
  switch (action.type) {
    case GRAPHQL_API.COLLECTIONS_SAVE_REQUEST: {
      return {
        ...state,
        is_loading: true,
        statusMessage: 'Saving Collections.....',
      }
    }
    case GRAPHQL_API.COLLECTIONS_SAVE_SUCCESS: {
      return Object.assign({}, state, {
        origin_collections_data: JSON.parse(JSON.stringify(action.data)),
        current_collections_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
        statusMessage: 'Saved Collections',
      })
    }
    case GRAPHQL_API.COLLECTIONS_SAVE_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to Save Collections',
      }
    }
    case GRAPHQL_API.COLLECTIONS_GET_REQUEST: {
      return {
        ...state,
        is_loading: true,
        statusMessage: 'Loading collections....',
      }
    }
    case GRAPHQL_API.COLLECTIONS_GET_SUCCESS: {
      return Object.assign({}, state, {
        origin_collections_data: JSON.parse(JSON.stringify(action.data)),
        current_collections_data: JSON.parse(JSON.stringify(action.data)),
        is_loading: false,
        statusMessage: 'Loaded collections',
      })
    }
    case GRAPHQL_API.COLLECTIONS_GET_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to load collections',
      }
    }
    default: {
      return state
    }
  }
}

export default collectionsReducer
