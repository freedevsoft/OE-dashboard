import React from 'react'
import _ from 'lodash'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import {
  faSave, faCog, faPlus, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from 'components/ControlButton/ControlButton'
import AccordionList from 'components/AccordionList/AccordionList'
import {
  Icon, Button, Dropdown, Menu,
} from 'antd'

class MenusPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() { }

  render() {
    const {
      loading, dataList, style, selectedIndex, selectItem, onItemEditFunc, title, customerIdMenu, customerId, selectCustomer,
    } = this.props

    if (loading) {
      return (
        <GrayPanel title={title} {...style}>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title={title} {...style} border_right={null}>
        <AccordionList
          dataList={dataList}
          selectedIndex={selectedIndex}
          selectItem={selectItem}
          itemEditable={dataList}
          itemThumb="none"
          titleChanged={onItemEditFunc}
          border_left={style.border_left}
        />
      </GrayPanel>
    )
  }
}

MenusPanel.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  style: PropTypes.object,
  onItemEditFunc: PropTypes.func,
  selectCustomer: PropTypes.func,
}

MenusPanel.defaultProps = {
  loading: false,
  dataList: [],
  title: 'Menu',
  style: {
    width: 170,
    minWidth: 170,
    bgcolor: '#242D3C',
    fgcolor: 'white',
    bgcolor_selected: '#242D3C',
    fgcolor_selected: '#FF916E',
    border_left: '#FF916E',
    bCollapsable: false,
  },
  selectCustomer: () => { },
}

export default MenusPanel
