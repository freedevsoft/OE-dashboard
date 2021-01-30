import React from 'react'
import { Menu } from 'antd'

const menu = ({ resources, onClickingMenu }) => {
  const handleClicked = (value) => {
    const { key } = value
    onClickingMenu(key)
  }

  return (
    <Menu onClick={handleClicked}>
      {resources.map((el) => (
        <Menu.Item key={el.value}>
          {el.label}
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default menu
