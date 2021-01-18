import React, { useEffect } from 'react'
import {
    Button, Form, Modal,
} from 'antd'
import OZMap from '../../.shared/Map'
import './MapModal.scss'

const MyForm = ({
    comp, onCancel, onUpdate, visible, title, currentKey, form,
}) => {
    useEffect(() => {
        form.resetFields()
    }, [currentKey])

    form.getFieldDecorator('comp', { initialValue: comp || {} })

    return (
        <Modal
            visible={visible}
            title={title}
            onOk={e => onUpdate(e, form)}
            onCancel={onCancel}
            width="90%"
            className="oz-map-modal"
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={e => onUpdate(e, form)}>
                    Update
                </Button>,
            ]}
        >
            <OZMap {...form.getFieldValue('comp')} onChange={values => { form.setFieldsValue({ comp: values }) }} />
        </Modal>
    )
}

const MapModal = Form.create()(MyForm)
export default MapModal
