import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import { dataUpdate } from 'utils/subscriptions'
import ReactLoading from 'react-loading'
import Client from './client'

class OEDN extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subscription: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.subscription && !nextProps.clientsQuery.loading) {
      return {
        subscription: nextProps.clientsQuery.subscribeToMore({
          document: dataUpdate,
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
      clientsQuery: { loading, error, data: clients },
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

    if (!clients || !clients[0]) {
      return 'No Client found'
    }

    return <Client clientInfo={clients[0]} />
  }
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'clientsQuery',
    options: ({ clientName }) => {
      return {
        variables: {
          collectionName: 'ClientsData',
          names: [clientName],
        },
      }
    },
  }),
  withApollo,
)(OEDN)
