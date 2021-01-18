import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Cascader, Select } from 'antd'
import * as queries from 'utils/queries'
import { GroupTypes } from 'utils/index'
import _ from 'lodash'
import { CellType, CellComponentType } from './utils'

const CellSelect = ({ groupingQuery: { loading, grouping, error }, value, onChange, type, ...rest }) => {
  if (loading) {
    return <Select placeholder="Loading..." loading {...rest} />
  }
  if (error || !grouping) {
    return <Select placeholder="Please select an Option" loading {...rest} />
  }

  const handleChange = (values, selectedOptions) => {
    const [cellType] = values

    if (cellType === CellType.GroupType) {
      onChange(cellType, { name: selectedOptions[1].value, data: { layout: { type: 'List' } } })
    } else if (cellType === CellType.Group && selectedOptions[1]) {
      onChange(cellType, { name: selectedOptions[1].label, _id: selectedOptions[1].value })
    } else if (cellType === CellType.Component) {
      onChange(cellType, { name: selectedOptions[1].value })
    }
  }

  const options = [
    {
      value: CellType.GroupType,
      label: 'Set',
      children: GroupTypes.map(item => ({ value: item.type, label: item.name })),
    },
    {
      value: CellType.Group,
      label: 'Launch',
      children: grouping.map(item => ({ value: item._id, label: item.name })),
    },
    {
      value: CellType.Component,
      label: 'Component',
      children: Object.keys(CellComponentType).map(item => ({ value: item, label: item })),
    },
  ]

  const optionValue = value.cellType === CellType.Group ? _.get(value, `${value.cellType}._id`) : _.get(value, `${value.cellType}.name`)

  return <Cascader options={options} value={optionValue ? [value.cellType, optionValue] : undefined} onChange={handleChange} {...rest} />
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
