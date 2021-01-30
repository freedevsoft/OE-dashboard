import React from 'react'
import { Dropdown } from 'antd'
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'
import ControlButton from 'components/ControlButton/ControlButton'
import SubMenu from './menu'

const DropDownMenu = ({
  resources,
  font,
  background,
  foreground,
  onClickingMenu,
}) => (
  <Dropdown
    overlay={
      <SubMenu
        resources={resources}
        onClickingMenu={onClickingMenu}
      />
    }
    trigger={['click']}
  >
    <ControlButton
      Icon={faCaretSquareDown}
      font={font}
      bgcolor={background}
      fgcolor={foreground}
      onClick={(e) => e.preventDefault()}
      className="ant-dropdown-link"
      wrapperStyle={{ marginLeft: 'auto' }}
    />
  </Dropdown>
)

export default DropDownMenu
