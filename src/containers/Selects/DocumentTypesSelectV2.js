import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

const DocumentTypesSelectV2 = ({ dataQuery: { loading, data, error }, value, onChange, placeholder, optionAll, excludeIds, ...rest }) => {
  if (loading) {
    return <Select placeholder={placeholder} loading {...rest} />
  }
  if (error || !data) {
    return <Select placeholder={placeholder} loading {...rest} />
  }

  function handleChange(value, target) {
    onChange({ name: target.props.label, _id: value })
  }

  return (
    <Select placeholder={placeholder} optionFilterProp="children" value={_.get(value, '_id')} onChange={handleChange} {...rest}>
      {optionAll && (
        <Select.Option value={null} label={optionAll} key={-1}>
          {optionAll}
        </Select.Option>
      )}
      {data
        .filter(item => (excludeIds ? !excludeIds.includes(item ? item._id : item) : true))
        .map((item, index) => (
          <Select.Option value={item._id} label={item.name} key={index}>
            {item.name}
          </Select.Option>
        ))}
    </Select>
  )
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'dataQuery',
    options: ({ collectionName, type }) => ({
      variables: {
        collectionName,
        types: type ? [type] : null,
      },
    }),
    // fetchPolicy: 'cache-and-network',
  }),
  withApollo,
)(DocumentTypesSelectV2)
