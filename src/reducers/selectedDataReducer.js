import { GRAPHQL_API, STORIES } from '../actions/types'

const initialState = {
  origin_contents_data: [],
  current_contents_data: [],
  is_loading: false,
  changed: false,
  statusMessage: '',
}

function selectedDataReducer(state = initialState, action) {
  switch (action.type) {
    case GRAPHQL_API.DATA_GET_REQUEST: {
      return { ...state, is_loading: true, statusMessage: 'Loading Data....' }
    }
    case GRAPHQL_API.DATA_GET_SUCCESS: {
      const { origin_contents_data } = state
      const { current_contents_data } = state
      origin_contents_data[action.collection] = JSON.parse(
        JSON.stringify(action.data),
      )
      current_contents_data[action.collection] = JSON.parse(
        JSON.stringify(action.data),
      )

      return Object.assign({}, state, {
        origin_contents_data,
        current_contents_data,
        is_loading: false,
        changed: !state.changed,
        statusMessage: 'Loaded Data',
      })
    }
    case GRAPHQL_API.DATA_GET_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to load Data',
      }
    }
    case GRAPHQL_API.BYOE_GET_REQUESET: {
      return { ...state, is_loading: true, statusMessage: 'Loading Data....' }
    }
    case GRAPHQL_API.BYOE_GET_SUCCESS: {
      const { origin_contents_data } = state
      const { current_contents_data } = state
      origin_contents_data[action.collection].push(
        JSON.parse(JSON.stringify(action.data)),
      )
      current_contents_data[action.collection].push(
        JSON.parse(JSON.stringify(action.data)),
      )

      return {
        ...state,
        is_loading: false,
        statusMessage: 'Loaded Data',
        changed: !state.changed,
        origin_contents_data,
        current_contents_data,
      }
    }
    case GRAPHQL_API.BYOED_GET_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to load Data',
      }
    }
    case GRAPHQL_API.CONTENTS_PRESAVE_REQUEST: {
      return { ...state, is_loading: true, statusMessage: 'Saving Data....' }
    }
    case GRAPHQL_API.CONTENTS_SAVE_SUCCESS: {
      const { origin_contents_data } = state
      const { current_contents_data } = state
      origin_contents_data[action.collection] = JSON.parse(
        JSON.stringify(action.data),
      )
      current_contents_data[action.collection] = JSON.parse(
        JSON.stringify(action.data),
      )

      return Object.assign({}, state, {
        origin_contents_data,
        current_contents_data,
        is_loading: false,
        changed: !state.changed,
        statusMessage: 'Saved Data',
      })
    }
    case GRAPHQL_API.CONTENTS_SAVE_FAILURE: {
      return {
        ...state,
        is_loading: false,
        statusMessage: 'Failed to save Data',
      }
    }
    default: {
      return state
    }
  }
}

export default selectedDataReducer
