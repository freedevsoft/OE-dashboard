import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'

import { ApolloClient, HttpLink } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { urlBackend, wsUrlBackend, backendProtocol, backendDomain, backendPort } from './utils/index'
import configureStore from './store'
import Routes from './routes/index'
import { getUserInfo } from './utils/queries'

const history = createBrowserHistory()
const store = configureStore()

class App extends Component {
  render() {
    const { authState, authData } = this.props

    if (authState !== 'signedIn') {
      return null
    }

    // Extract query parameters to check if backend was specified.
    const qp = new URLSearchParams(window.location.search);
    
    let bepr = "SECURE";
    if (qp.has('backendprotocol')) {
      bepr = qp.get("backendprotocol");
    }
    let bed = backendDomain;
    if (qp.has('backenddomain')) {
      bed = qp.get("backenddomain");
    }
    let bep = backendPort;
    if (qp.has('backendport')) {
      bep = qp.get("backendport");
    }

    let beu = "https://"+bed+":"+bep;
    let wbeu = "wss://"+bed+":"+bep;;
    if (bepr == "STANDARD")
    {
      beu = "http://"+bed+":"+bep;
      wbeu = "ws://"+bed+":"+bep;;
    }

    if (qp.has('backendurl')) {
      beu = qp.get("backendurl");
    }
    console.log ("beu: "+beu);
    if (qp.has('wsbackendurl')) {
      wbeu = qp.get("wsbackendurl");
    }
    console.log ("wbeu: "+wbeu);


    const httpLink = new HttpLink({
      uri: beu,
    })

    const wsLink = new WebSocketLink({
      uri: wbeu,
    })

    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query)

        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      },
      wsLink,
      httpLink,
    )

    const cache = new InMemoryCache({})

    const client = new ApolloClient({
      link,
      cache,
      resolvers: {},
      // dataIdFromObject: o => o._id,
    })

    client
      .query({
        query: getUserInfo,
        variables: { cognitoIds: [authData.username] },
      })
      .then(res => {
        console.log('RES', res)
      })

    cache.writeData({
      data: {
        user: {
          cognitoIds: [authData.username],
          name: null,
          __typename: 'UserInfo',
        },
      },
    })

    console.log(this.props)

    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Routes history={history} />
        </Provider>
      </ApolloProvider>
    )
  }
}

export default App
