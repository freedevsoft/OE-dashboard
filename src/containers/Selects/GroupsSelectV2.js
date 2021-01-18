import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import { getDepthValue } from 'utils/index'
import _ from 'lodash'

const GroupsSelectV2 = ({ groupingQuery: { loading, grouping, error }, value, onChange, type, ...rest }) => {
  if (loading) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }
  if (error || !grouping) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }

  function handleChange(value, target) {
    onChange({ name: target.props.label, _id: value })
  }

  return (
    <Select placeholder="Please select an Option" showSearch optionFilterProp="children" value={getDepthValue(value, '_id')} onChange={handleChange} {...rest}>
      {grouping.map((item, index) => (
        <Select.Option value={item._id} label={item.name} key={index}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ type, header }) => ({
      variables: {
        type,
        clientId: _.get(header, 'client._id'),
      },
    }),
  }),
  withApollo,
)(GroupsSelectV2)
