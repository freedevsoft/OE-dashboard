import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlButton from 'components/ControlButton/ControlButton'
import AccordionList from 'components/AccordionList/AccordionList'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import * as constants from 'utils/constants'

class StreamsPanel extends React.Component {
  componentDidMount() {}

  onChange = value => {
    const { onChangeType } = this.props
    onChangeType(value)
  }

  render() {
    const { loading, dataList, style, selectedIndex, selectItem, onDragItemFunc, more, onSyncFunc, onUploadFile, onItemDeleteFunc, type } = this.props
    const { streamTypeList } = constants
    if (loading) {
      return (
        <GrayPanel title="Resources" {...style} {...more}>
          <ControlBtnsGroup disabled style={{ width: '100%', display: 'flex', alignItems: 'center' }} hlcolor="#FFD25B">
            <ControlButton Icon={faSync} />
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title="Resources" {...style} bgcolor_selected="#242D3C" fgcolor_selected="#FFD25B" border_right={null} {...more}>
        <ControlBtnsGroup style={{ width: '100%', display: 'flex', alignItems: 'center' }} hlcolor="#FFD25B">
          <ControlButton Icon={faSync} onClick={onSyncFunc} />
        </ControlBtnsGroup>
        <div style={{ backgroundColor: 'rgb(36, 45, 60)', padding: '2px 5px' }}>
          <Select
            placeholder="Select a gallery"
            optionFilterProp="children"
            onChange={value => this.onChange(value)}
            style={{ width: '100%' }}
            value={type}
          >
            {streamTypeList?.map((item, index) => (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        <AccordionList
          dataList={dataList}
          selectedIndex={selectedIndex}
          selectItem={selectItem}
          itemEditable={dataList}
          openEditable
          itemThumb="none"
          border_left="#FFD25B"
          draggable
          droppable
          onDragItem={onDragItemFunc}
          onDropItem={this.dropArticle}
          onDragOverItem={this.dragOverArticle}
          spaceLabel="Drag and Drop MP4 file"
          uploadFile
          onUpload={onUploadFile}
          duplicateSelectable
          onItemDeleteFunc={onItemDeleteFunc}
          bottomArea
        />
      </GrayPanel>
    )
  }
}

StreamsPanel.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  style: PropTypes.object,
}

StreamsPanel.defaultProps = {
  loading: false,
  dataList: [],
  style: {
    bgcolor: '#242D3C',
    fgcolor: 'white',
  },
}

export default StreamsPanel
