import React from 'react'
import {
  Col, Row,
} from 'antd'
import OZInput from 'components/FormItems/OZInput'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZInputNumber from 'components/FormItems/OZInputNumber'

const ComponentDataItem = ({
  data, form: { getFieldDecorator, getFieldValue }, field,
}) => {
  getFieldDecorator(`${field}.type`, { initialValue: data && data.type ? data.type : undefined })

  const inlineComparisonStyle = {
    labelCol: { md: { span: 8 }, sm: { span: 12 } },
    wrapperCol: { md: { span: 16 }, sm: { span: 12 } },
  }

  const renderRule = (label, type, combines, bNumberFormat = false) => (
    <Row>
      <Col md={{ span: 12 }}>
        <OZSelectItem
          label={label}
          field={`${field}.${type}.comparison`}
          initialValue={data && data[type] && data[type].comparison ? data[type].comparison : undefined}
          getFieldDecorator={getFieldDecorator}
          combines={combines}
          {...inlineComparisonStyle}
          required={false}
        />
      </Col>
      <Col md={{ span: 12 }}>
        {bNumberFormat === false
          ? (
            <OZInput
              field={`${field}.${type}.value`}
              initialValue={data && data[type] && data[type].value ? data[type].value : ''}
              getFieldDecorator={getFieldDecorator}
              required={false}
            />
          ) : (
            <OZInputNumber
              field={`${field}.${type}.value`}
              initialValue={data && data[type] && data[type].value ? data[type].value : 0}
              min={0}
              max={1000000}
              getFieldDecorator={getFieldDecorator}
              required={false}
            />
          )}
      </Col>
    </Row>
  )

  const type = getFieldValue(`${field}.type`)

  return (
    <>
      {type === 'zip_code' && renderRule('Zip Code:', 'zip_code', [
        { value: '=', label: 'is' },
        { value: '<>', label: 'is not' },
      ])}
      {type === 'device_type' && renderRule('Device Type:', 'device_type', [
        { value: '=', label: 'is' },
        { value: '<>', label: 'is not' },
      ])}
      {type === 'age' && renderRule('Age:', 'age', [
        { value: '=', label: 'is equal' },
        { value: '<', label: 'is less than' },
        { value: '>', label: 'is greater than' },
      ], true)}
      {type === 'income' && renderRule('Income:', 'income', [
        { value: '=', label: 'is equal' },
        { value: '<', label: 'is less than' },
        { value: '>', label: 'is greater than' },
      ], true)}
      {type === 'gender' && renderRule('Gender:', 'gender', [
        { value: '=', label: 'contains' },
        { value: '<>', label: "doesn't contain" },
      ])}
      {type === 'interests' && renderRule('Interests:', 'interests', [
        { value: '=', label: 'contains' },
        { value: '<>', label: "doesn't contain" },
      ])}
      {type === 'affiliation' && renderRule('Affiliations:', 'affiliation', [
        { value: '=', label: 'contains' },
        { value: '<>', label: "doesn't contain" },
      ])}
      {type === 'subscription' && renderRule('Subscriptions:', 'subscription', [
        { value: '=', label: 'contains' },
        { value: '<>', label: "doesn't contain" },
      ])}
    </>
  )
}

export default ComponentDataItem
