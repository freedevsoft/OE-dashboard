import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

const OrganizerCollectionsSelect = ({
  clientsQuery: { loadingClient, data: clients, error: errorClient },
  collectionsQuery: { loadingCollection, data: collections, error: errorCollection },
  ...rest
}) => {
  if (loadingClient || loadingCollection) {
    return <Select placeholder="Loading..." loading {...rest} />
  }

  if (errorClient || !clients || !clients[0] || errorCollection || !collections) {
    return <Select placeholder="Loading..." loading {...rest} />
  }

  const [client] = clients

  const ownedRefs = _.get(client, 'data.organizers')
  const ownedCollectionIds = ownedRefs ? ownedRefs.map(item => _.get(item, 'ref._id')) : []

  const filterCollections = collections.filter(collection => ownedCollectionIds.includes(collection._id))

  return (
    <Select placeholder="Please select a Collection" showSearch optionFilterProp="children" {...rest}>
      {filterCollections.map(collection => {
        const _id = _.get(collection, '_id')
        const collectionName = _.get(collection, 'name')
        const display = _.get(collection, 'data.display')
        const logo = _.get(collection, 'data.logo')

        return (
          <Select.Option value={collectionName} label={display} key={_id}>
            <span role="img" aria-label={display}>
              <img style={{ width: '30px', height: 'auto' }} src={logo} alt="logo" />
              &nbsp;
            </span>
            {display}
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'collectionsQuery',
    options: () => ({
      variables: {
        collectionName: 'ConfigurationsData',
        types: ['organizer-collection'],
      },
    }),
  }),
  graphql(queries.dataQuery, {
    name: 'clientsQuery',
    options: ({ clientId }) => ({
      variables: {
        collectionName: 'ClientsData',
        ids: clientId ? [clientId] : null,
      },
    }),
  }),
  withApollo,
)(OrganizerCollectionsSelect)
