import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'

class BackgroundsSelect extends React.Component {
  render() {
    const {
      dataQuery: { loading, data, error },
      ...rest
    } = this.props

    if (loading) {
      return <Select placeholder="Please select a background image" loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder="Please select a background image" loading {...rest} />
    }

    return (
      <Select placeholder="Please select a background image" showSearch optionFilterProp="children" {...rest}>
        <Select.Option value={null} label="No Background" key="-1">
          No Background
        </Select.Option>
        {data.map((logo, index) => (
          <Select.Option value={logo.data.url} label={logo.name} key={index}>
            <span role="img" aria-label={logo.name}>
              <img style={{ width: '30px' }} src={logo.data.url} />{' '}
            </span>
            {logo.name}
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
        collectionName: 'ImagesData',
        types: ['BackgroundImage'],
      },
    }),
  }),
  withApollo,
)(BackgroundsSelect)
