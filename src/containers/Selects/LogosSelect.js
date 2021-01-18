import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

const LogosSelect = ({ dataQuery: { loading, data, error }, ...rest }) => {
  if (loading) {
    return <Select placeholder="Please select a logo" loading {...rest} />
  }
  if (error || !data) {
    return <Select placeholder="Please select a logo" loading {...rest} />
  }

  return (
    <Select placeholder="Please select a logo" showSearch optionFilterProp="children" {...rest}>
      <Select.Option value={null} label="No Logo" key={-1}>
        No Logo
      </Select.Option>
      {data.map((logo, index) => (
        <Select.Option value={_.get(logo, 'data.url')} label={_.get(logo, 'name')} key={index}>
          <span role="img" aria-label={_.get(logo, 'name')}>
            <img style={{ width: '30px' }} src={_.get(logo, 'data.url')} alt="logo" />
            &nbsp;
          </span>
          {logo.name}
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
        collectionName: 'ImagesData',
        types: ['Logo'],
      },
    }),
  }),
  withApollo,
)(LogosSelect)
