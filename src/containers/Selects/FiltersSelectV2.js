import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import { getDepthValue } from 'utils/index'

const FiltersSelect = ({ dataQuery: { loading, data, error }, value, onChange, ...rest }) => {
  if (loading) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }
  if (error || !data) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }

  function handleChange(value, target) {
    onChange({ name: target.props.label, _id: value })
  }

  return (
    <Select placeholder="Please select an Option" showSearch optionFilterProp="children" value={getDepthValue(value, '_id')} onChange={handleChange} {...rest}>
      {data.map((item, index) => (
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
    options: () => ({
      variables: {
        collectionName: 'Filters',
      },
    }),
  }),
  withApollo,
)(FiltersSelect)
