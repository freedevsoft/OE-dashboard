import React from 'react'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import {
  faSave, faCog, faPlus, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from 'components/ControlButton/ControlButton'
import AccordionList from 'components/AccordionList/AccordionList'

class AppsPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() { }

  render() {
    const {
      loading, dataList, style, selectedIndex, selectItem, onItemEditFunc, onItemDeleteFunc, onItemAddFunc, onDragItemFunc,
    } = this.props

    if (loading) {
      return (
        <GrayPanel title="Resources" {...style}>
          <ControlBtnsGroup disabled />
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title="Resources" {...style} bgcolor_selected="#65605F" fgcolor_selected="#FFD25B" border_right={null}>
        <ControlBtnsGroup />
        <AccordionList
          dataList={dataList}
          selectedIndex={selectedIndex}
          selectItem={selectItem}
          itemEditable={dataList}
          itemThumb="none"
          titleChanged={onItemEditFunc}
          border_left="#FFD25B"
          draggable
          onDragItem={onDragItemFunc}
        />
      </GrayPanel>
    )
  }
}

AppsPanel.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  style: PropTypes.object,
  onItemEditFunc: PropTypes.func,
}

AppsPanel.defaultProps = {
  loading: false,
  dataList: [],
  style: {
    width: 200,
    minWidth: 200,
    // theme: "darkgreen"

    bgcolor: '#65605F',
    fgcolor: 'white',

  },
}

export default AppsPanel
