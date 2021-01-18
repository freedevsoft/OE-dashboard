import React from 'react'
import './GrayPanel.scss'
import * as constants from 'utils/constants'
import { ResizableBox } from 'react-resizable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import CollapseButton from '../CollapseButton/CollapseButton'
import CollapsedBarContent from '../CollapsedBarContent/CollapsedBarContent'

export default class GrayPanel extends React.Component {
  // static defaultProps = {
  //   ...constants.defaultPanelStyle,
  // }

  constructor(props) {
    super(props)
    this.panelCollapse = this.panelCollapse.bind(this)
  }

  state = {
    panelCollapsed: false,
  }

  onResize = (event, { size }) => {
    const { options, panelIndex } = this.props
    console.log(size.width)
    if (options && options.resizePanel) options.resizePanel(panelIndex, size.width)
  }

  panelCollapse = () => {
    const { panelCollapsed } = this.state
    this.setState({ panelCollapsed: !panelCollapsed })
  }

  onDismiss = () => {
    const { options, panelIndex } = this.props
    options.togglePanel(panelIndex)
  }

  render() {
    let { bgcolor, fgcolor, hlcolor, bgcolor_selected, } = this.props
    const {
      override = true,
      children,
      theme,
      fgcolor_selected,
      border_right,
      bCollapsable,
      title,
      minWidth,
      maxWidth,
      width,
      show = true,
    } = this.props

    const { panelCollapsed } = this.state
    if (theme) {
      bgcolor = constants.getBackground(theme)
      fgcolor = constants.getColor(theme)
    }

    if ((!bgcolor && !fgcolor) || title == 'Resources') {
      bgcolor = '#242D3C'
      fgcolor = 'black'
      bgcolor_selected = '#242D3C'
      hlcolor = '#f8e71c'
    }

    const collapsed = panelCollapsed
    const divStyle = {
      width: collapsed ? 50 : width,
      color: fgcolor,
      backgroundColor: bgcolor ? bgcolor : '#242D3C',
      border: `0.5px solid ${hlcolor ? hlcolor : '#f8e71c'}`,
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '1',
    }

    const childrenWithProps = React.Children.map(children, (child, e) => {
      if (child) {
        return React.cloneElement(child, {
          theme,
          bgcolor,
          fgcolor,
          bgcolor_selected,
          fgcolor_selected,
          ...child.props,
        })
      }
    })

    return (
      <ResizableBox
        className="Oe-Gray-Panel"
        minConstraints={[minWidth]}
        maxConstraints={[maxWidth]}
        width={width}
        // height={0}
        axis={collapsed ? 'none' : 'x'}
        onResize={this.onResize}
        style={{
          display: show ? 'flex' : 'none',
          borderLeft: collapsed && fgcolor_selected ? `4px solid ${fgcolor_selected}` : '',
          borderRight: border_right ? `1px solid ${border_right}` : 'none',
        }}
      >
        <div className="myPanel" style={divStyle}>
          {bCollapsable && <CollapseButton collapsed={collapsed} onClick={this.panelCollapse} bgcolor={bgcolor ? bgcolor : '#242D3C'} hlcolor={hlcolor ? hlcolor : '#f8e71c'} fgcolor={fgcolor} />}
          {collapsed ? (
            <CollapsedBarContent bgcolor={bgcolor} fgcolor={fgcolor_selected || fgcolor}>
              {title}
            </CollapsedBarContent>
          ) : (
              childrenWithProps
            )}
        </div>
        <FontAwesomeIcon className="btn-dismiss" icon={faTimesCircle} color={fgcolor} size="1x" onClick={this.onDismiss} />
      </ResizableBox>
    )
  }
}
