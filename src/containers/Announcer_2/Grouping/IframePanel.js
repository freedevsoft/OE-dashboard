import React, { useState } from 'react'
import { Input, Button } from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import Iframe from 'react-iframe'

const IframePanel = ({ width, minWidth, maxWidth, options, url, setUrl }) => {
  const foreground = localStorage.getItem('fgcolorcode') || '#FFF'
  const highlight = localStorage.getItem('hlcolorcode') || '#f8e71c'
  const [input, setInput] = useState(url)
  const more = {
    width,
    minWidth,
    maxWidth,
    options,
    panelIndex: 7,
  }

  return (
    <GrayPanel
      title="Menu"
      // bgcolor='white'
      fgcolor={foreground}
      // bgcolor_selected={background}
      fgcolor_selected="#FFD25B"
      // border_right={null}
      hlcolor={highlight ? highlight : '#FFFF00'}
      {...more}
    >
      <ControlBtnsGroup style={{ width: '100%', display: 'flex', alignItems: 'center' }} hlcolor="#FFFF00">
        <Input
          style={{ width: 'unset', flexGrow: '1' }}
          value={input}
          onChange={e => {
            setInput(e.target.value)
          }}
          onKeyDown={e => {
            if (e.keyCode === 13) setUrl(e.target.value)
          }}
        />
        {/* <Button style={{ width: 'unset' }}>Launch</Button> */}
      </ControlBtnsGroup>
      <Iframe width="100%" height="100%" id="group-iframe" display="initial" position="relative" url={url} />
    </GrayPanel>
  )
}

export default IframePanel
