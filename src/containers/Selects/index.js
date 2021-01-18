import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'

class DocumentsSelect extends React.Component {
  render() {
    const {
      dataQuery: { loading, data, error },
      ...rest
    } = this.props

    if (loading) {
      return <Select placeholder="Please select an Option" loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder="Please select an Option" loading {...rest} />
    }

    return (
      <Select placeholder="Please select an Option" showSearch optionFilterProp="children" {...rest}>
        <Select.Option value={null} label="None" key={-1}>
          None
        </Select.Option>
        {data.map((item, index) => (
          <Select.Option value={item._id} label={item.name} key={index}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'dataQuery',
    options: props => ({
      variables: {
        collectionName: props.collectionName,
      },
    }),
  }),
  withApollo,
)(DocumentsSelect)
