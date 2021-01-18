import React from 'react'
import { Form } from 'antd'
import OZCheckboxGroup from 'components/FormItems/OZCheckboxGroup'
import './index.scss'

const ActionsForm = ({ data, form: { getFieldDecorator, getFieldValue, setFieldsValue }, field }) => {
  getFieldDecorator(field, { initialValue: data || [] })

  return (
    <div className="form-group-actions">
      <Form.Item label="Actions" className="primary-label">
        <OZCheckboxGroup
          field={field}
          initialValue={data || []}
          combines={[
            { label: 'Bookmark', value: 'Bookmark' },
            { label: 'Hide', value: 'Hide' },
            { label: 'Show', value: 'Show' },
            { label: 'Load', value: 'Load' },
            { label: 'Back', value: 'Back' },
          ]}
          getFieldDecorator={getFieldDecorator}
          required={false}
        />
      </Form.Item>
    </div>
  )
}

export default ActionsForm
