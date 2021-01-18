/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import ItemsCarousel from 'react-items-carousel'
import Left from 'assets/images/left.png'
import Right from 'assets/images/right.png'
import Article from './Article'
import './Bar.scss'

const MediaViewGroupContentNormalBar = ({ myGeo, group }) => {
  const { articles } = group
  const [activeItemIndex, changeActiveItem] = useState(0)

  if (articles.length === 0) return ''

  return (
    <div className="oe-featured-layout-group-body-articles-bar">
      <ItemsCarousel
        // Placeholder configurations
        enablePlaceholder
        numberOfPlaceholderItems={5}
        minimumPlaceholderTime={1000}
        placeholderItem={<div style={{ height: 200, background: '#900' }}>Placeholder</div>}
        // Carousel configurations
        numberOfCards={4}
        gutter={0}
        showSlither
        firstAndLastGutter={false}
        freeScrolling={false}
        // Active item configurations
        requestToChangeActive={changeActiveItem}
        activeItemIndex={activeItemIndex}
        activePosition="center"
        chevronWidth={0}
        rightChevron={<img src={Right} alt="right" />}
        leftChevron={<img src={Left} alt="left" />}
        outsideChevron
        classes={{ wrapper: 'oe-featured-layout-group-body-articles-bar-carousel' }}
      >
        {articles && articles.map((article, index) => <Article key={index} article={article} myGeo={myGeo} groupStyle={group.style} />)}
      </ItemsCarousel>
    </div>
  )
}

export default MediaViewGroupContentNormalBar
