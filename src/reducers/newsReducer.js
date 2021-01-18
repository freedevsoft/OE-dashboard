import { GRAPHQL_API, RECORDS } from '../actions/types'

const initialState = {
  origin_data: [],
  current_data: [],
  is_loading: false,
  dataChanged: false,
  current_subdata: null,
  statusMsg: '',
}

function newsReducer(state = initialState, action) {
  switch (action.type) {
    case GRAPHQL_API.CHANGE_STATUS_MESSAGE: {
      return { ...state, statusMsg: action.msg, is_loading: action.is_loading }
    }
    case GRAPHQL_API.NEWS_SAVE_REQUEST: {
      return { ...state, is_loading: true, statusMsg: 'Saving ...' }
    }
    case GRAPHQL_API.NEWS_SAVE_SUCCESS: {
      console.log('RELOAD', action.data)

      return {
        ...state,
        origin_data: action.data.slice(),
        current_data: action.data,
        dataChanged: !state.dataChanged,
        is_loading: false,
        statusMsg: 'Saved',
      }
    }
    case GRAPHQL_API.NEWS_SAVE_FAILURE: {
      return { ...state, is_loading: false, statusMsg: 'Save Failed' }
    }
    case GRAPHQL_API.NEWS_GET_REQUEST: {
      return { ...state, is_loading: true, statusMsg: 'Loading ...' }
    }
    case GRAPHQL_API.NEWS_GET_SUCCESS: {
      // action.data.forEach(data => {
      //   if (!data.socialChecked) data.socialChecked = []
      // })
      return {
        ...state,
        origin_data: action.data.slice(),
        current_data: action.data,
        is_loading: false,
        statusMsg: 'Loaded',
        current_subdata: action.data[0],
        dataChanged: !state.dataChanged,
      }
    }
    case GRAPHQL_API.NEWS_GET_FAILURE: {
      return { ...state, is_loading: false, statusMsg: 'Load Failed' }
    }
    case RECORDS.SELECT_RECORD: {
      switch (action.recordType) {
        case 'control': {
          let { current_subdata } = state
          current_subdata = state.current_data[action.recordIndex]

          return {
            ...state,
            dataChanged: !state.dataChanged,
            current_subdata,
          }
        }
      }
    }
    case RECORDS.ADD_RECORD: {
      switch (action.recordType) {
        case 'control': {
          const record = {
            OE: {
              name: 'BreakingNews',
              version: '0.0.0.1',
              record: {
                name: 'New Collection',
                version: '0.0.0.1',
              },
            },
            collectionName: 'New News',
            collectionType: 'collections',
            title: '',
            text: '',
            fgcolor: 'blue',
            bgcolor: 'green',
            channelChecked: [],
            socialChecked: [],
            publish_date: new Date(),
          }

          const { current_data } = state
          current_data.unshift(record)

          return {
            ...state,
            dataChanged: !state.dataChanged,
            current_data,
          }
        }
      }
    }
    case RECORDS.EDIT_RECORD: {
      switch (action.recordType) {
        case 'control': {
          const { current_data } = state
          current_data[action.recordIndex][action.field] = action.newValue

          return {
            ...state,
            dataChanged: !state.dataChanged,
            current_data,
          }
        }
        case 'sub': {
          const { current_subdata } = state
          console.log('234324', current_subdata)
          current_subdata[action.field] = action.newValue

          return {
            ...state,
            dataChanged: !state.dataChanged,
            current_subdata,
          }
        }
      }
    }
    case RECORDS.REMOVE_RECORD: {
      switch (action.recordType) {
        case 'control': {
          const { current_data } = state
          current_data.splice(action.recordIndex, 1)

          return {
            ...state,
            dataChanged: !state.dataChanged,
            current_data,
          }
        }
      }
    }
    default: {
      return state
    }
  }
}

export default newsReducer
