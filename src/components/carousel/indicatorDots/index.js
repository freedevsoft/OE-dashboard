import React from 'react'
import PropTypes from 'prop-types'

function Dot({ selected }) {
  return (
    <span
      style={{
        display: 'inline-block',
        height: '5px',
        width: '30px',
        backgroundColor: 'white',
        margin: '7px 5px',
        borderRadius: '2px',
        opacity: selected ? '1' : '0.3',
        transitionDuration: '300ms',
      }}
    />
  )
}

export default function IndicatorDots({ total, index }) {
  const wrapperStyle = {
    position: 'absolute',
    width: '100%',
    zIndex: '100',
    bottom: '0px',
    textAlign: 'center',
  }

  if (total < 2) {
    // Hide dots when there is only one dot.
    return <div style={wrapperStyle} />
  }

  return (
    <div style={wrapperStyle}>
      {Array.apply(null, Array(total)).map((x, i) => {
        return <Dot key={i} selected={index === i} />
      })}
    </div>
  )
}

IndicatorDots.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}
