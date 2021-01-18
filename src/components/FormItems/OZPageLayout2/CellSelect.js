import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'
import { CellType, CellComponentType } from './utils'

const CellSelect = ({ groupingQuery: { loading, grouping, error }, value, onChange, type, ...rest }) => {
  if (loading) {
    return <Select placeholder="Loading..." loading {...rest} />
  }
  if (error || !grouping) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }

  const optionValue = value.cellType === CellType.Group ? _.get(value, `${value.cellType}._id`) : _.get(value, `${value.cellType}.name`)

  return (
    <Select
      value={optionValue}
      onChange={value => {
        onChange(CellType.Component, { name: value })
      }}
      {...rest}
    >
      {Object.keys(CellComponentType).map((key, index) => (
        <Select.Option value={key} key={index}>
          {CellComponentType[key]}
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
        ids: null,
        type,
        clientId: _.get(header, 'client._id') || undefined,
      },
    }),
  }),
  withApollo,
)(CellSelect)
