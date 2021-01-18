/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import _ from 'lodash'
import MediaViewGroupHeader from '../Header'

import './index.scss'

const MediaViewGroupContainer = ({ group, children }) => {
  if (!group) return ''

  const { style } = group

  const containerStyle = {
    backgroundColor: _.get(style, 'bg_color') || 'black',
    padding: group.articles && group.articles.length ? undefined : '0',
  }

  return (
    <div className="oe-mediaview-group-container">
      <MediaViewGroupHeader group={group} />
      {_.get(group, 'availability.state') === 'on' && (
        <div className="oe-featured-layout" style={containerStyle}>
          <div className="oe-featured-layout-group">
            <div className="oe-featured-layout-group-body">{children}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaViewGroupContainer
