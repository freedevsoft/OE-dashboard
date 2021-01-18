import React, { useState } from 'react'
import { Form, Radio, Checkbox, InputNumber, Divider, Input } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { inlineStyle, getDepthValue } from 'utils'

import './index.scss'

const SettingForm = (props) => {
  const [icon, setIcon] = useState(localStorage.getItem('icon') || 'false')
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || 'false')
  const [map, setMap] = useState(localStorage.getItem('map') || 'false')
  const [schedule, setSchedule] = useState(localStorage.getItem('schedule') || 'false')
  const [availability, setAvailability] = useState(localStorage.getItem('availability') || 'false')
  const [timestamp, setTimestamp] = useState(localStorage.getItem('timestamp') || 'false')
  const [bgcolorcode, setBgColorcode] = useState(localStorage.getItem('bgcolorcode') || '#242D3C')
  const [fgcolorcode, setFgColorcode] = useState(localStorage.getItem('fgcolorcode') || '#FFF')
  const [hlcolorcode, setHlColorcode] = useState(localStorage.getItem('hlcolorcode') || '#f8e71c')
  const [hlcolorcheck, setHlcolorcheck] = useState(localStorage.getItem('hlcolorcheck') || 'false')
  const checkboxStyle = {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '20px',
    width: '60%'
  }

  const changeBGHandler = (field, value) => {
    setBgColorcode(value)
    props.onChangeBGColorcode(value)
    setBgColorcode(value)
    localStorage.setItem('bgcolorcode', value);
  }

  const changeFGHandler = (field, value) => {
    setFgColorcode(value);
    props.onChangeFGColorcode(value)
    localStorage.setItem('fgcolorcode', value);
  }

  const changeHLHandler = (field, value) => {
    setHlColorcode(value);
    props.onChangeHLColorcode(value)
    localStorage.setItem('hlcolorcode', value);
  }
  setInterval(() => {
    setBgColorcode(localStorage.getItem('bgcolorcode') || '#242D3C')
    setFgColorcode(localStorage.getItem('fgcolorcode') || '#FFF')
    setHlColorcode(localStorage.getItem('hlcolorcode') || '#f8e71c')
    setHlcolorcheck(localStorage.getItem('hlcolorcheck') || 'false')
  }, 200)

  const onChange = (name, e) => {
    switch (name) {
      case 'hlcolorcheck':
        localStorage.setItem('hlcolorcheck', e.target.checked);
        props.onChangeHLColorCheck(e.target.checked)
        setHlcolorcheck(`${e.target.checked}`);
        break;
      case 'icon':
        localStorage.setItem('icon', e.target.checked);
        setIcon(`${e.target.checked}`);
        break;
      case 'avatar':
        localStorage.setItem('avatar', e.target.checked);
        setAvatar(`${e.target.checked}`);
        break;
      case 'map':
        setMap(`${e.target.checked}`);
        localStorage.setItem('map', e.target.checked);
        break;
      case 'schedule':
        setSchedule(`${e.target.checked}`);
        localStorage.setItem('schedule', e.target.checked);
        break;
      case 'availability':
        setAvailability(`${e.target.checked}`);
        localStorage.setItem('availability', e.target.checked);
        break;
      case 'timestamp':
        setTimestamp(`${e.target.checked}`);
        localStorage.setItem('timestamp', e.target.checked);
        break;
      case 'bgcolorcode':
        setBgColorcode(`${e.target.checked}`);
        localStorage.setItem('bgcolorcode', e.target.checked);
        break;
      case 'fgcolorcode':
        setFgColorcode(`${e.target.checked}`);
        localStorage.setItem('fgcolorcode', e.target.checked);
        break;
      case 'hlcolorcode':
        setHlColorcode(`${e.target.checked}`);
        localStorage.setItem('hlcolorcode', e.target.checked);
        break;
    }
  }

  return (
    <div className="bits-checkbox">
      <div className="bits-checkbox-label-item">
        <div className="bits-checkbox-label-colorpicker">
          <p>
            bgcolor
          </p>
          <ColorPicker
            color={bgcolorcode}
            onValueChange={changeBGHandler}
            wrapperStyle={{ display: 'inline-block' }}
          />
        </div>
        <div className="bits-checkbox-label-colorpicker">
          <p>
            fgcolor
          </p>
          <ColorPicker
            color={fgcolorcode}
            onValueChange={changeFGHandler}
            wrapperStyle={{ display: 'inline-block' }}
          />
        </div>
        <div className="bits-checkbox-label-colorpicker">
          <p>
            hightlight
          </p>
          <ColorPicker
            color={props.hlcolorcode ? props.hlcolorcode : hlcolorcode}
            onValueChange={changeHLHandler}
            wrapperStyle={{ display: 'inline-block' }}
          />
        </div>
        <Checkbox style={checkboxStyle} checked={hlcolorcheck == 'true' ? true : false} onChange={(e) => onChange('hlcolorcheck', e)}><span className="bits-checkbox-label-item-text">highlight row</span></Checkbox>
        <Checkbox style={checkboxStyle} checked={icon == 'true' ? true : false} onChange={(e) => onChange('icon', e)}><span className="bits-checkbox-label-item-text">icon</span></Checkbox>
        <Checkbox style={checkboxStyle} checked={avatar == 'true' ? true : false} onChange={(e) => onChange('avatar', e)}><span className="bits-checkbox-label-item-text">avatar</span></Checkbox>
        <Checkbox style={checkboxStyle} checked={map == 'true' ? true : false} onChange={(e) => onChange('map', e)}><span className="bits-checkbox-label-item-text">map filter</span></Checkbox>
        <Checkbox style={checkboxStyle} checked={schedule == 'true' ? true : false} onChange={(e) => onChange('schedule', e)}><span className="bits-checkbox-label-item-text">schedule filter</span></Checkbox>
        <Checkbox style={checkboxStyle} checked={availability == 'true' ? true : false} onChange={(e) => onChange('availability', e)}><span className="bits-checkbox-label-item-text">availability</span></Checkbox>
        <Checkbox style={checkboxStyle} checked={timestamp == 'true' ? true : false} onChange={(e) => onChange('timestamp', e)}><span className="bits-checkbox-label-item-text">update timestamp</span></Checkbox>
      </div>
    </div>
  )
}

export default SettingForm