import React from 'react'
import _ from 'lodash'

const FilterGroups = ({ groups, children }) => {
  const validGroups = []

  for (const group of groups) {
    if (!group || !group.list) {
      // console.log('Group is invalid or there is no active article in the Group')
      continue
    }

    const bAvailability = _.get(group, 'availability.state') === 'on'
    const bSchedule = !_.get(group, 'schedule.bActive') || _.get(group, 'schedule.status') === 'active'

    if (!bAvailability || !bSchedule) {
      // console.log('Group is invalid', bAvailability, bSchedule, bGroupLocation)
      continue
    }

    const articles = []

    Object.values(group.list).forEach(item => {
      if (item.active === 'true') {
        const findArticleIndex = group.articles.findIndex(article => article._id === item.id)
        if (findArticleIndex >= 0) {
          articles.push(group.articles[findArticleIndex])
        }
      }
    })

    validGroups.push({ ...group, articles })
  }

  return React.Children.map(children, child => {
    if (child) {
      return React.cloneElement(child, {
        ...child.props,
        groups: validGroups,
      })
    }

    return ''
  })
}
export default FilterGroups
