import React from 'react'
import { Row, Col, Form } from 'antd'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZInput from 'components/FormItems/OZInput'
import TypesSelect from 'containers/Selects/TypesSelect'
import { getDepthValue } from 'utils'

const PresentationForm = ({ data, form: { getFieldDecorator, getFieldValue }, field }) => {
  getFieldDecorator(`${field}.firstViewMode`, { initialValue: getDepthValue(data, 'firstViewMode') })
  getFieldDecorator(`${field}.firstViewModeValue`, { initialValue: getDepthValue(data, 'firstViewModeValue') })
  getFieldDecorator(`${field}.majorUpdateMode`, { initialValue: getDepthValue(data, 'majorUpdateMode') })
  getFieldDecorator(`${field}.majorUpdateModeValue`, { initialValue: getDepthValue(data, 'majorUpdateModeValue') })
  getFieldDecorator(`${field}.minorUpdateMode`, { initialValue: getDepthValue(data, 'minorUpdateMode') })
  getFieldDecorator(`${field}.minorUpdateModeValue`, { initialValue: getDepthValue(data, 'minorUpdateModeValue') })
  getFieldDecorator(`${field}.recallMode`, { initialValue: getDepthValue(data, 'recallMode') })
  getFieldDecorator(`${field}.recallModeValue`, { initialValue: getDepthValue(data, 'recallModeValue') })

  const valueStyle = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: {
      width: '500px', marginLeft: '50px', marginTop: '2px', display: 'inline-block',
    },
  }

  const presentation = (modeLabel, modeField, valueLabel, valueField) => {
    const mode = getFieldValue(`${field}.${modeField}`)

    return (
      <Row>
        <Col md={24}>
          <OZSelectItem
            label={modeLabel}
            field={`${field}.${modeField}`}
            initialValue={getDepthValue(data, modeField)}
            getFieldDecorator={getFieldDecorator}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            required={false}
            combines={[
              { value: 'icon', label: 'Icon' },
              { value: 'title', label: 'Title Notification' },
              { value: 'short', label: 'Short Description Notification' },
              { value: 'banner', label: 'Banner' },
              { value: 'summary', label: 'Summary' },
              { value: 'detailed', label: 'Detailed' },
            ]}
            style={{ width: '400px', display: 'inline-block' }}
          />
          {mode === 'icon' && (
            <Form.Item label="Icon URL:" {...valueStyle}>
              {getFieldDecorator(`${field}.${valueField}`, { initialValue: getDepthValue(data, valueField) })(
                <TypesSelect collectionName="ImagesData" type="AnnouncerIcon" />,
              )}
            </Form.Item>
          )}
          {(mode === 'title' || mode === 'short') && (
            <OZInput
              field={`${field}.${valueField}`}
              initialValue={getDepthValue(data, valueField, '')}
              getFieldDecorator={getFieldDecorator}
              required={false}
              label="Notification Text"
              {...valueStyle}
            />
          )}
          {mode === 'banner' && (
            <OZSelectItem
              field={`${field}.${valueField}`}
              initialValue={getDepthValue(data, valueField)}
              getFieldDecorator={getFieldDecorator}
              required={false}
              label="Position:"
              combines={[
                { value: 'top', label: 'Top' },
                { value: 'middle', label: 'Middle' },
                { value: 'bottom', label: 'Bottom' },
              ]}
              {...valueStyle}
            />
          )}
          {(mode === 'summary' || mode === 'detailed') && (
            <OZSelectItem
              field={`${field}.${valueField}`}
              initialValue={getDepthValue(data, valueField)}
              getFieldDecorator={getFieldDecorator}
              required={false}
              label="Orientation:"
              combines={[
                { value: 'top-left', label: 'Top Left' },
                { value: 'top-right', label: 'Top Right' },
                { value: 'bottom-left', label: 'Bottom Left' },
                { value: 'bottom-right', label: 'Bottom Right' },
              ]}
              {...valueStyle}
            />
          )}
        </Col>
      </Row>
    )
  }

  return (
    <>
      {presentation('FirstViewMode', 'firstViewMode', 'Value', 'firstViewModeValue')}
      {presentation('MajorUpdateMode', 'majorUpdateMode', 'Value', 'majorUpdateModeValue')}
      {presentation('MinorUpdateMode', 'minorUpdateMode', 'Value', 'minorUpdateModeValue')}
      {presentation('RecallMode', 'recallMode', 'Value', 'recallModeValue')}
    </>
  )
}

export default PresentationForm
