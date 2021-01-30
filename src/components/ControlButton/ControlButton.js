import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as constants from 'utils/constants'
import { Tooltip } from 'antd'
import './index.scss'
const text = <span>prompt text</span>
export default class ControlButton extends React.Component {
  static defaultProps = {
    toggled: false,
    text: null,
    style: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      mouseHover: false,
    }
  }

  setMouseHover = mouseHover => {
    this.setState({ mouseHover })
  }

  render() {
    let { bgcolor, fgcolor } = this.props
    const { theme, text, style, Icon, Svg, onClick, disabled, hlcolor, wrapperStyle, toggled, onDrag, subIcon, font, tooltip, placement, bluenavy } = this.props
    const { mouseHover } = this.state
    if (theme) {
      bgcolor = constants.getBackground(theme)
      fgcolor = constants.getColor(theme)
    } else if (!bgcolor && !fgcolor) {
      bgcolor = 'white'
      fgcolor = 'black'
    }

    const className = 'btn'
    const inlineStyle = {
      width: font == '11px' && '26px',
      padding: font == '11px' ? '0px 5px' : '5px 7px',
      color: disabled ? 'gray' : fgcolor,
      backgroundColor: bgcolor,
      border: `1px solid ${disabled ? 'gray' : fgcolor}`,
      pointerEvents: disabled ? 'none' : 'inherit',
      ...style
    }

    if (!toggled) {
      if (!disabled && mouseHover) {
        inlineStyle.backgroundColor = hlcolor || constants.getHoverColor(bgcolor)
      }
    } else {
      inlineStyle.color = fgcolor
      if (bluenavy) {
        inlineStyle.backgroundColor = hlcolor
      } else {
        inlineStyle.backgroundColor = fgcolor
      }
      inlineStyle.border = `1px solid ${fgcolor}`
    }

    return (
      <div
        className="control-button"
        style={{ cursor: 'pointer', backgroundColor: bgcolor, ...wrapperStyle }}
        onMouseEnter={() => this.setMouseHover(true)}
        onMouseLeave={() => this.setMouseHover(false)}
        draggable
        onDragStart={e => {
          if (onDrag) onDrag(e)
        }}
      >
        <button type="button" className={className} style={inlineStyle} onClick={onClick} disabled={disabled}>
          {text && <span>{text}</span>}
          {Icon && subIcon ? (
            <div style={{ display: 'inline-flex', marginLeft: '-4px' }}>
              <Tooltip placement={placement} title={tooltip}>
                <FontAwesomeIcon icon={Icon} style={{ width: '10px', fontSize: font }} />
              </Tooltip>
              <div style={{ marginTop: '-10px' }}>
                <Tooltip placement={placement} title={tooltip}>
                  <FontAwesomeIcon icon={subIcon} style={{ fontSize: font }} />
                </Tooltip>
              </div>
            </div>
          ) : (
              <Tooltip placement={placement} title={tooltip}>
                <div>
                  {Icon && <FontAwesomeIcon icon={Icon} style={{ fontSize: font }} />}
                  {Svg && <img src={Svg} className="svg" />}
                </div>
              </Tooltip>
            )}
        </button>
      </div>
    )
  }
}
