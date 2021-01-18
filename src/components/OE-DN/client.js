import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import ReactLoading from 'react-loading'
import * as queries from 'utils/queries'
import { groupingUpdate, articleUpdate, groupingAdd, documentDelete } from 'utils/subscriptions'
import DynamicNotifications from './DynamicNotifications'

import FilterGroups from './FilterGroups'

class Client extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subscription: null,
      articleSubscription: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.subscription && !nextProps.groupingQuery.loading) {
      return {
        subscription: [
          nextProps.groupingQuery.subscribeToMore({
            document: groupingUpdate,
            updateQuery: (previousResult, { subscriptionData }) => {
              if (
                !subscriptionData.data ||
                !subscriptionData.data.groupingUpdate ||
                !previousResult ||
                !previousResult.grouping ||
                subscriptionData.data.groupingUpdate.clientId !== nextProps.clientInfo._id
              ) {
                return previousResult
              }
              const updatedIndex = previousResult.grouping.findIndex(group => group._id === subscriptionData.data.groupingUpdate._id)
              if (updatedIndex >= 0) {
                // return Object.assign({}, previousResult, {
                //   grouping: [...previousResult.grouping.slice(0, updatedIndex), subscriptionData.data.groupingUpdate, ...previousResult.grouping.slice(updatedIndex + 1)],
                // })
                return { ...previousResult, grouping: [...previousResult.grouping.slice(0, updatedIndex), subscriptionData.data.groupingUpdate, ...previousResult.grouping.slice(updatedIndex + 1)] }
              }

              // return Object.assign({}, previousResult, { grouping: [...previousResult.grouping, subscriptionData.data.groupingUpdate] })
              return { ...previousResult, grouping: [...previousResult.grouping, subscriptionData.data.groupingUpdate] }
            },
          }),
          nextProps.groupingQuery.subscribeToMore({
            document: groupingAdd,
            updateQuery: (previousResult, { subscriptionData }) => {
              if (
                !subscriptionData.data ||
                !subscriptionData.data.groupingAdd ||
                !previousResult ||
                !previousResult.grouping ||
                subscriptionData.data.groupingAdd.clientId !== nextProps.clientInfo._id
              ) {
                return previousResult
              }
              const updatedIndex = previousResult.grouping.findIndex(group => group._id === subscriptionData.data.groupingAdd._id)
              if (updatedIndex >= 0) return previousResult

              // return Object.assign({}, previousResult, { grouping: [...previousResult.grouping, subscriptionData.data.groupingAdd] })
              return { ...previousResult, grouping: [...previousResult.grouping, subscriptionData.data.groupingAdd] }
            },
          }),
          nextProps.groupingQuery.subscribeToMore({
            document: documentDelete,
            updateQuery: (previousResult, { subscriptionData }) => {
              if (!previousResult || !previousResult.grouping || !subscriptionData.data || !subscriptionData.data.documentDelete) {
                return previousResult
              }

              const { grouping } = previousResult

              const deleteIndex = grouping.findIndex(group => group._id === subscriptionData.data.documentDelete._id && group.collectionName === subscriptionData.data.documentDelete.collectionName)
              if (deleteIndex < 0) return previousResult

              // return Object.assign({}, previousResult, { grouping: [...grouping.slice(0, deleteIndex), ...grouping.slice(deleteIndex + 1)] })
              return { ...previousResult, grouping: [...grouping.slice(0, deleteIndex), ...grouping.slice(deleteIndex + 1)] }
            },
          }),
        ],
      }
    }
    if (!prevState.articleSubscription && !nextProps.eventQuery.loading) {
      return {
        articleSubscription: nextProps.eventQuery.subscribeToMore({
          document: articleUpdate,
          updateQuery: (previousResult, { subscriptionData }) => {
            if (!subscriptionData.data) return previousResult

            return previousResult
          },
        }),
      }
    }

    return null
  }

  render() {
    const {
      groupingQuery: { loading, error, grouping: groups },
      clientInfo,
    } = this.props

    if (loading || error) {
      return (
        <div
          style={{
            paddingLeft: 'calc(50% - 35px)',
            paddingTop: 'calc(50vh - 35px)',
          }}
        >
          <ReactLoading type="spinningBubbles" color="lightgray" height={70} width={70} />
        </div>
      )
    }

    if (!groups) {
      return 'error'
    }

    return (
      <div id="react-component-001">
        <div className="myhtml">
          <div className="mybody">
            <FilterGroups groups={groups}>
              <DynamicNotifications clientInfo={clientInfo} />
            </FilterGroups>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ clientInfo }) => ({
      variables: {
        ids: null,
        clientId: clientInfo._id,
      },
    }),
  }),
  graphql(queries.eventQuery, {
    name: 'eventQuery',
    options: () => ({
      variables: {
        collectionName: 'Articles',
      },
    }),
  }),
  withApollo,
)(Client)
