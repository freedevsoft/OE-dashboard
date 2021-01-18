import React from 'react'
import { Chart, Geom, Tooltip, Axis, Legend } from 'bizcharts'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import DataSet from '@antv/data-set'
import { Spin } from 'antd'

const actionList = {
  Viewed: ['Viewed'],
  Heart: ['Liked', 'Disliked', 'Neutral'],
  'Article Active': ['Article Active'],
  'Article Inactive': ['Article Inactive'],
}

const ArticlesTrackingChart = ({ accessedQuery, articles, selectedAction }) => {
  const { accessed: accessedArray, loading, error } = accessedQuery

  if (loading) {
    return (
      <div className="article-tracking-chart-loading">
        <Spin />
      </div>
    )
  }

  if (error || !accessedArray) {
    return <div className="article-tracking-chart-error">Load failed</div>
  }

  const data = []
  const fields = []
  const directory = {}

  articles.forEach(article => {
    directory[article._id] = article.name
    fields.push(article.name)
  })

  accessedArray.forEach(item => {
    if (item.accessed) {
      item.accessed.forEach(access => {
        const { action, counter } = access

        if (!selectedAction || (actionList[selectedAction] && actionList[selectedAction].includes(action))) {
          const index = data.findIndex(col => col.name === action)
          const articleName = directory[item._id]
          if (index >= 0) {
            data[index][articleName] = counter
          } else {
            data.push({ name: action, [articleName]: counter })
          }
        }
      })
    }
  })

  // if (tracking) {
  //   for (let i = 0; i < tracking.length; i += 1) {
  //     const { timestamp, action, comment } = tracking[i]
  //     console.log(tracking[i])
  //     const index = data.findIndex(item => item.name.toLowerCase() === action.toLowerCase())
  //     if (index >= 0) {
  //       if (moment(timestamp).isSame(date, 'day')) {
  //         const hour = moment(timestamp).hour()
  //         data[index][`${hour}:00`] += 1
  //       }
  //     }
  //   }
  // }

  const cols = {
    count: {
      type: 'linear',
      // tickInterval: 1,
      alias: 'Track Count',
    },
  }

  const ds = new DataSet()
  const dv = ds.createView().source(data)
  dv.transform({
    type: 'fold',
    fields,
    key: 'article',
    value: 'count',
  })

  return (
    <>
      <Chart height={400} data={dv} scale={cols} forceFit>
        <Axis name="article" />
        <Axis name="count" />
        <Legend position="bottom" />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
        />
        <Geom type="interval" position="article*count" size={30} color="name" adjust={[{ type: 'dodge', marginRatio: 0.1 / 32 }]} />
      </Chart>
    </>
  )
}

export default compose(
  graphql(queries.accessedQuery, {
    name: 'accessedQuery',
    options: props => {
      const { articles } = props

      return {
        variables: {
          ids: articles && articles.map(article => article._id),
          collectionName: 'Articles',
        },
      }
    },
  }),
  withApollo,
)(ArticlesTrackingChart)
