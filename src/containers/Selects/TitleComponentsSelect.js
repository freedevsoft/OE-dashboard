import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'

class TitleComponentsSelect extends React.Component {
  onChange = (value, event) => {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    if (loading || error || !data) return

    const index = parseInt(event.key)
    this.props.onChange(value, index >= 0 ? data[index] : null)
  }

  render() {
    const {
      dataQuery: { loading, data, error },
      onChange,
      ...rest
    } = this.props

    if (loading) {
      return <Select placeholder="Please select a Component Name" loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder="Please select a Component Name" loading {...rest} />
    }

    return (
      <Select placeholder="Please select a Component Name" showSearch optionFilterProp="children" onChange={this.onChange} {...rest}>
        <Select.Option value={null} label="No Component" key={-1}>
          No Component
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
    options: () => ({
      variables: {
        collectionName: 'ComponentsData',
        types: ['Title'],
      },
    }),
  }),
  withApollo,
)(TitleComponentsSelect)
