import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import { Spin } from 'antd'

class GroupWrapper extends Component {
  render() {
    const {
      groupingQuery: { loading, error, grouping }, children,
    } = this.props

    if (loading) {
      return (
        <div className="article-tracking-chart-loading">
          <Spin />
        </div>
      )
    }

    if (error || !grouping) {
      return (
        <div className="article-tracking-chart-error">
          Load failed
        </div>
      )
    }

    const group = grouping[0]

    if (!group || !group.list || !group.list.length) {
      return (
        <div className="article-tracking-chart-error">
          No Articles in this group
        </div>
      )
    }

    const articles = []

    Object.values(group.list).forEach(item => {
      const findArticleIndex = group.articles.findIndex(article => article._id === item.id)
      if (findArticleIndex >= 0) {
        articles.push(group.articles[findArticleIndex])
      }
    })

    const childrenWithProps = React.Children.map(children, child => {
      if (!child) return ''

      return React.cloneElement(child, {
        ...child.props,
        articles,
      })
    })

    return (
      childrenWithProps
    )
  }
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: props => {
      const { _id } = props

      return {
        variables: {
          ids: [_id],
        },
      }
    },
  }),
)(GroupWrapper)
