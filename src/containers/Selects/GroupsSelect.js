import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

const GroupsSelect = ({ groupingQuery: { loading, grouping, error }, header, ...rest }) => {
  if (loading) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }
  if (error || !grouping) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }

  const body = grouping.map(item => (
    <Select.Option value={item.name} label={item.name} key={item._id}>
      {item.name}
    </Select.Option>
  ))

  return (
    <Select
      placeholder="Please select an Option"
      showSearch
      optionFilterProp="children"
      key={_.get(header, 'customer._id') + _.get(header, 'client._id') + _.get(header, 'platform._id') + _.get(header, 'campaign._id')}
      {...rest}
    >
      {body}
    </Select>
  )
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header }) => ({
      variables: {
        ids: null,
        customerId: _.get(header, 'customer._id'),
        clientId: _.get(header, 'client._id'),
        appId: _.get(header, 'campaign._id'),
      },
    }),
  }),
  withApollo,
)(GroupsSelect)
