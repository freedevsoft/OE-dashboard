/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import _ from 'lodash'
import moment from 'moment'

import './index.scss'

const MediaViewGroupHeader = ({ group }) => {
  if (!group) return ''

  const { data, style } = group

  const titleFgColor = _.get(style, 'title.fg_color') || 'white'
  const titleBgColor = _.get(style, 'title.bg_color') || 'gray'

  const outline = {
    backgroundColor: titleBgColor,
  }

  if (style?.b_outline === true) {
    outline.borderWidth = style?.outline?.width || 0
    outline.borderStyle = 'solid'
    outline.borderColor = style?.outline?.color || 'white'
    outline.borderRadius = style?.outline?.radius || 0
  }

  if (style?.b_shadow === true) {
    outline.boxShadow = `3px 3px 3px${style?.shadow?.color || 'gray'}`
  }

  const groupBarStyle = {
    color: titleFgColor,
    backgroundColor: titleBgColor,
  }

  const groupImage = _.get(data, 'desc.image') || null
  const groupShortDescr = _.get(data, 'desc.shortDescr') || null
  const groupLongDescr = _.get(data, 'desc.longDescr') || null
  const groupUpdatedAt = _.get(group, 'updatedAt')
  const groupIcon = _.get(data, 'desc.icon') || null
  const groupTitle = _.get(data, 'desc.title') || null

  return (
    <div>
      {(groupIcon || groupTitle || groupImage) && (
        <div className="oe-featured-layout-group-header" style={{ ...groupBarStyle, ...outline }}>
          <div className="oe-featured-layout-group-header-title-bar">
            {groupImage && <img src={groupImage} alt="desc.im" />}
            {groupIcon && <img src={groupIcon} alt="desc.icon" />}
            <span>{groupTitle}</span>
          </div>
          {(groupIcon || groupTitle || groupImage || groupShortDescr || groupLongDescr) && (
            <div className="oe-featured-layout-group-header-time-bar">{`Updated: ${moment(groupUpdatedAt).format('MMM DD, hh:mm A')}`}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default MediaViewGroupHeader
