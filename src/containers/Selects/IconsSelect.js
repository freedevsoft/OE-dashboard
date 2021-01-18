import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'

class IconsSelect extends React.Component {
  render() {
    const {
      dataQuery: { loading, data, error },
      ...rest
    } = this.props

    if (loading) {
      return <Select placeholder="Please select an icon" loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder="Please select an icon" loading {...rest} />
    }

    return (
      <Select placeholder="Please select an icon" showSearch optionFilterProp="children" {...rest}>
        <Select.Option value={null} label="No Icon" key={-1}>
          No Icon
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
    options: props => ({
      variables: {
        collectionName: 'ImagesData',
        types: ['Icon'],
      },
    }),
  }),
  withApollo,
)(IconsSelect)
