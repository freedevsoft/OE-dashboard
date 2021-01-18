import React from 'react'
import _ from 'lodash'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import {
  faSave, faCog, faPlus, faTrashAlt, faCalendarAlt,
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
      loading, dataList, style, selectedIndex, selectItem, onItemEditFunc, onItemDeleteFunc, onItemAddFunc, onSettingsFunc, onCalendarFunc,
    } = this.props

    if (loading) {
      return (
        <GrayPanel title="DataDocuments" {...style}>
          <ControlBtnsGroup disabled>
            <ControlButton Icon={faTrashAlt} />
            <ControlButton Icon={faPlus} />
            <ControlButton Icon={faCalendarAlt} />
            <ControlButton Icon={faCog} />
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title="DataDocuments" {...style} border_right={null}>
        <ControlBtnsGroup>
          <ControlButton Icon={faTrashAlt} onClick={onItemDeleteFunc} disabled={!dataList || !dataList.length} />
          <ControlButton Icon={faPlus} onClick={onItemAddFunc} />
          <ControlButton Icon={faCalendarAlt} onClick={onCalendarFunc} disabled={!dataList || !dataList.length} />
          <ControlButton Icon={faCog} onClick={onSettingsFunc} />
        </ControlBtnsGroup>
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
    width: 240,
    minWidth: 240,
    bgcolor: '#242D3C',
    fgcolor: 'white',
    bgcolor: '#65605F',
    fgcolor: 'white',
    bgcolor_selected: '#65605F',
    fgcolor_selected: '#FFD25B',
    border_left: '#FFD25B',
  },
}

export default AppsPanel
