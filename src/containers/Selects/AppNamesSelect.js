import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'

class AppNamesSelect extends React.Component {
  static defaultProps = {
    placeholder: 'Select an Application',
  }

  componentDidMount() {}

  render() {
    const {
      dataQuery: { loading, data, error },
      placeholder,
      ...rest
    } = this.props

    if (loading) {
      return <Select placeholder={placeholder} loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder={placeholder} loading {...rest} />
    }

    return (
      <Select placeholder={placeholder} showSearch optionFilterProp="children" {...rest}>
        <Select.Option value={null} label="All" key={-1}>
          All
        </Select.Option>
        {data.map((item, index) => (
          <Select.Option value={item.name} label={item.name} key={index}>
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
        types: [props.type],
      },
    }),
  }),
  withApollo,
)(AppNamesSelect)
