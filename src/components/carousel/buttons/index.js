import React from 'react'
import propTypes from 'prop-types'

import Left from 'assets/images/left.png'
import Right from 'assets/images/right.png'

const styles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: '100',
    bottom: '0',
    textAlign: 'center',
  },
  btn: {
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'absolute',
    bottom: '0',
    font: 'bold 16px/30px sans-serif',
    color: 'rgba(255,255,255,0.8)',
  },
  left: {
    left: '0',
  },
  right: {
    right: '0',
  },
}

export default function Buttons(props) {
  const prevBtnStyle = Object.assign({}, styles.btn, styles.left)
  const nextBtnStyle = Object.assign({}, styles.btn, styles.right)
  const { index, total, loop, prevHandler, nextHandler } = props

  return (
    <div style={styles.wrapper}>
      {(loop || index !== 0) && (
        <div style={prevBtnStyle} onClick={prevHandler}>
          <img src={Left} />
        </div>
      )}
      {(loop || index !== total - 1) && (
        <div style={nextBtnStyle} onClick={nextHandler}>
          <img src={Right} />
        </div>
      )}
    </div>
  )
}

Buttons.propTypes = {
  index: propTypes.number.isRequired,
  total: propTypes.number.isRequired,
  prevHandler: propTypes.func,
  nextHandler: propTypes.func,
}
