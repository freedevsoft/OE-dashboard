import React from 'react'
import PropTypes from 'prop-types'
import {
    faPlus, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import GrayPanel from '../../GrayPanel/GrayPanel'
import ControlBtnsGroup from '../../ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from '../../ControlButton/ControlButton'
import AccordionList from '../../AccordionList/AccordionList'

const ZipCodePanel = ({
    loading, dataList, style, selectedIndex, selectItem, onItemEditFunc, onItemDeleteFunc, onItemAddFunc,
}) => {
    if (loading) {
        return (
            <GrayPanel title="ZipCodes" {...style}>
                <ControlBtnsGroup disabled>
                    <ControlButton Icon={faTrashAlt} />
                    <ControlButton Icon={faPlus} />
                </ControlBtnsGroup>
                <AccordionList loading />
            </GrayPanel>
        )
    }

    return (
        <GrayPanel title="ZipCodes" {...style} bgcolor_selected="#65605F" fgcolor_selected="#FFD25B" border_right={null}>
            <ControlBtnsGroup>
                <ControlButton Icon={faTrashAlt} onClick={onItemDeleteFunc} disabled={!dataList || !dataList.length} />
                <ControlButton Icon={faPlus} onClick={onItemAddFunc} />
            </ControlBtnsGroup>
            <AccordionList
                dataList={dataList}
                selectedIndex={selectedIndex}
                selectItem={selectItem}
                itemEditable={dataList}
                itemThumb="none"
                titleChanged={onItemEditFunc}
                border_left="#FFD25B"
            />
        </GrayPanel>
    )
}

ZipCodePanel.propTypes = {
    loading: PropTypes.bool,
    dataList: PropTypes.array,
    style: PropTypes.object,
}

ZipCodePanel.defaultProps = {
    loading: false,
    dataList: [],
    style: {
        width: 200,
        minWidth: 200,
        bgcolor: '#65605F',
        fgcolor: 'white',
    },
}

export default ZipCodePanel
