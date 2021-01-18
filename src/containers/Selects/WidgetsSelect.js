import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

class WidgetsSelect extends React.Component {
  onChange = (value, event) => {
    const {
      dataQuery: { loading, data, error },
      onChange,
    } = this.props

    if (loading || error || !data) return

    const index = parseInt(event.key, 10)
    onChange({ _id: value, type: data[index].type })
  }

  render() {
    const {
      dataQuery: { loading, data, error },
      onChange,
      value,
      ...rest
    } = this.props

    if (loading) {
      return <Select placeholder="Widget Type" loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder="Widget Type" loading {...rest} />
    }

    return (
      <Select placeholder="Widget Type" showSearch optionFilterProp="children" onChange={this.onChange} value={_.get(value, '_id')} {...rest}>
        {/* <Select.Option value={null} label="No Type" key={-1}>
          No Widget
        </Select.Option> */}
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
    options: () => ({
      variables: {
        collectionName: 'WidgetsData',
        types: null,
      },
    }),
  }),
  withApollo,
)(WidgetsSelect)
