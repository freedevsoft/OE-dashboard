import React, { useState } from 'react'
import { Form, Icon, Upload, Spin } from 'antd'
import OZTextArea from 'components/FormItems/OZTextArea'
import TypesSelect from 'containers/Selects/TypesSelect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDepthValue, inlineStyle } from 'utils'
import { faFolder, faFileAlt, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import './index.scss'

const CabinetForm = () => {
    const [showFolder, setShowFolder] = useState(true)
    return (
        <div className="oe-cabinet-form">
            <div className="acc_item_line acc_item_line-bottom" style={{ height: '1px' }} />
            <div className="oe-cabinet-form-item">
                {showFolder ?
                    <span onClick={() => setShowFolder(!showFolder)} className="oe-cabinet-form-item-icons">
                        <FontAwesomeIcon icon={faFolder} color="#FFF" />
                    </span>
                    :
                    <span onClick={() => setShowFolder(!showFolder)} className="oe-cabinet-form-item-icons">
                        <FontAwesomeIcon icon={faFileAlt} color="#FFF" />
                    </span>
                }
                <span style={{ background: '#FFF', width: '50%', display: 'inline-block', marginRight: '5px', flexGrow: 1 }}>
                    <input
                        style={{ paddingTop: '6px', paddingBottom: '6px', marginRight: '5px', width: '100%' }}
                        type="text"
                        placeholder="Add new"
                    // value={inputValue}
                    // onChange={e => newFieldText(e.target.value)}
                    // onKeyDown={onAdd}
                    />
                </span>
                {/* <span className="oe-cabinet-form-item-icons">
                    <FontAwesomeIcon icon={faPencilAlt} color="#FFF" />
                </span>
                <span className="oe-cabinet-form-item-icons">
                    <FontAwesomeIcon icon={faTrashAlt} color="#FFF" />
                </span> */}
            </div>
        </div>
    )
}

export default CabinetForm
