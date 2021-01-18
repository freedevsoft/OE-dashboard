import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import AccordionList from 'components/AccordionList/AccordionList'
import ControlButton from 'components/ControlButton/ControlButton'
import * as constants from 'utils/constants'

class AppsPanel extends React.Component {
  componentDidMount() {}

  onChange = value => {
    this.props.onChangeImageType(value)
  }

  render() {
    const {
      loading,
      dataList,
      style,
      selectedIndex,
      selectItem,
      onItemEditFunc,
      onDragItemFunc,
      more,
      type,
      onItemDeleteFunc,
      onItemAddFunc,
      onUploadFile,
      bottomArea,
      collectionName
    } = this.props
    const imageType = collectionName === 'ImagesData' ? constants.imageTypelist : collectionName === 'VideosData' ? constants.videoTypeList : constants.attachmentTypeList
    if (loading) {
      return (
        <GrayPanel title="Resources" {...style} {...more}>
          <ControlBtnsGroup disabled style={{ width: '100%', display: 'flex', alignItems: 'center' }} hlcolor="#FFD25B">
            {/* <ControlButton Icon={faPlus} /> */}
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title="Resources" bgcolor_selected="#242D3C" fgcolor_selected="#FFD25B" border_right={null} bgcolor="#F8F5F5" {...more}>
        <ControlBtnsGroup style={{ width: '100%', display: 'flex', alignItems: 'center' }} hlcolor="#FFD25B">
          {/* <ControlButton Icon={faPlus} onClick={onItemAddFunc} /> */}
          {/* <ControlButton Icon={faTrashAlt} onClick={onItemDeleteFunc} disabled={!dataList || !dataList.length} /> */}
          <div style={{ backgroundColor: 'rgb(36, 45, 60)', padding: '2px 5px', width: '100%' }}>
            <Select placeholder="Select the gallery" optionFilterProp="children" onChange={value => this.onChange(value)} style={{ width: '100%' }} value={type}>
              {imageType.map((item, index) => (
                <Select.Option value={item} key={index}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </div>
        </ControlBtnsGroup>
        <AccordionList
          dataList={dataList}
          selectedIndex={selectedIndex}
          selectItem={selectItem}
          itemEditable={dataList}
          openEditable
          itemThumb="none"
          titleChanged={onItemEditFunc}
          border_left="#FFD25B"
          draggable
          droppable
          onDragItem={onDragItemFunc}
          onItemDeleteFunc={onItemDeleteFunc}
          onDropItem={this.dropArticle}
          onDragOverItem={this.dragOverArticle}
          spaceLabel={`Drag & Drop ${type} HERE to Upload`}
          uploadFile
          bottomArea={bottomArea}
          onUpload={onUploadFile}
          duplicateSelectable
          imagePanel
          type={type}
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
    bgcolor: '#242D3C',
    fgcolor: 'white',
  },
}

export default AppsPanel
