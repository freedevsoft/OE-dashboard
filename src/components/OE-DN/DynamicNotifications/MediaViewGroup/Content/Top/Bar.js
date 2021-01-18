/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import Carousel from 're-carousel'

import IndicatorDots from 'components/carousel/indicatorDots'
import Buttons from 'components/carousel/buttons'
import Article from './Article'

import './Bar.scss'

const MediaViewGroupContentTopBar = ({ myGeo, group }) => {
  const { articles } = group

  if (articles.length > 1) {
    return (
      <div className="oe-featured-layout-group-body-featured-bar">
        <Carousel
          loop
          auto
          interval={5000}
          widgets={[IndicatorDots, Buttons]}
          frames={articles.map((article, index) => (
            <Article key={index} article={article} myGeo={myGeo} />
          ))}
        />
      </div>
    )
  }

  return (
    <div className="oe-featured-layout-group-body-featured-bar" style={{ height: '320px' }}>
      <Article article={articles[0]} myGeo={myGeo} groupStyle={group.style} />
    </div>
  )
}

export default MediaViewGroupContentTopBar
