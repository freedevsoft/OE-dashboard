import React from 'react'
import { DatePicker, TimePicker, Radio, Select, InputNumber, Checkbox, Input } from 'antd'
import moment from 'moment'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import _ from 'lodash'
import { getDepthValue } from 'utils/index'
import OZCheckbox from 'components/FormItems/OZCheckbox'
import './index.scss'

class ScheduleForm extends React.Component {
  onChange = (date, dateString, prop) => {
    const {
      form: { setFieldsValue },
      field,
    } = this.props
    if (prop == 'endAt') {
      setFieldsValue({ [`${field}.endOn`]: date.utc().format() })
    }
    setFieldsValue({ [`${field}.${prop}`]: date.utc().format() })
  }

  render() {
    const {
      data,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      field,
      config,
    } = this.props
    const radioStyle = {
      display: 'block',
      height: '24px',
      lineHeight: '24px',
      // marginTop: '5px',
    }

    const whitelist = _.get(config, 'options')

    getFieldDecorator(`${field}.startAt`, { initialValue: data && data.startAt ? moment.utc(data.startAt).format() : moment.utc().format() })
    getFieldDecorator(`${field}.endAt`, { initialValue: data && data.endAt ? moment.utc(data.endAt).format() : moment.utc().format() })
    getFieldDecorator(`${field}.endOn`, { initialValue: data && data.endOn ? moment.utc(data.endOn).format() : moment.utc().format() })
    getFieldDecorator(`${field}.recurrenceType`, { initialValue: getDepthValue(data, 'recurrenceType', 'none') })
    getFieldDecorator(`${field}.repeatsEvery`, { initialValue: getDepthValue(data, 'repeatsEvery', 1) })
    getFieldDecorator(`${field}.bFilter`, { initialValue: _.get(data, 'bFilter') || false })
    getFieldDecorator(`${field}.endType`, { initialValue: getDepthValue(data, 'endType', 'never') })
    getFieldDecorator(`${field}.bActive`, { initialValue: _.get(data, 'bActive') || false })
    getFieldDecorator(`${field}.status`, { initialValue: data && data.status })

    const startAt = getFieldValue(`${field}.startAt`)
    const endAt = getFieldValue(`${field}.endAt`)
    const endOn = getFieldValue(`${field}.endOn`)
    const recurrenceType = getFieldValue(`${field}.recurrenceType`)
    const repeatsEvery = getFieldValue(`${field}.repeatsEvery`)
    const endType = getFieldValue(`${field}.endType`)
    const status = getFieldValue(`${field}.status`)

    let endTypeRender = ''
    switch (endType) {
      case 'never':
        break
      case 'on':
        endTypeRender = getFieldDecorator(`${field}.endOn`, {
          initialValue: endOn ? moment.utc(endOn).local() : moment(),
        })(<DatePicker style={{ marginLeft: '35px' }} />)
        break
      case 'after':
        endTypeRender = (
          <>
            {getFieldDecorator(`${field}.endAfter`, {
              initialValue: getDepthValue(data, 'endAfter', 1),
            })(<InputNumber min={1} max={100} tyle={{ maxWidth: '60px', marginLeft: '20px' }} />)}{' '}
            occurrences
          </>
        )
        break
      default:
        break
    }

    const weekdayOptions = [
      { label: 'Sun', value: 0 },
      { label: 'Mon', value: 1 },
      { label: 'Tue', value: 2 },
      { label: 'Wed', value: 3 },
      { label: 'Thu', value: 4 },
      { label: 'Fri', value: 5 },
      { label: 'Sat', value: 6 },
    ]

    const recurrenceTypeOptions = [
      { value: 'disabled', label: 'Disabled' },
      { value: 'none', label: 'Does not repeat' },
      { value: 'day', label: 'Daily' },
      { value: 'week', label: 'Weekly' },
      { value: 'month', label: 'Monthly' },
      { value: 'year', label: 'Annually' },
      { value: 'custom', label: 'Custom...' },
    ]

    return (
      <div className="oe-schedule-form">
        <OZSelectItem
          field={`${field}.recurrenceType`}
          initialValue={!_.get(data, 'bActive') ? 'disabled' : getDepthValue(data, 'recurrenceType', 'none')}
          getFieldDecorator={getFieldDecorator}
          required={false}
          combines={recurrenceTypeOptions.filter(item => !whitelist || whitelist.includes(item.value))}
          onChange={value => {
            if (value === 'disabled') {
              setFieldsValue({ [`${field}.bActive`]: false })
            } else {
              setFieldsValue({
                [`${field}.bActive`]: true,
                [`${field}.startAt`]: moment.utc().format(),
                [`${field}.endAt`]: moment
                  .utc()
                  .add(1, 'hours')
                  .format(),
              })
            }
          }}
        />
        {getFieldValue(`${field}.bActive`) && (
          <>
            <div className="oe-location-form-item">
              <span className="oe-location-form-item-label">Filter:</span>
              <div className="oe-location-form-item-pickers">
                <OZCheckbox field={`${field}.bFilter`} initialValue={_.get(data, 'bFilter') || false} getFieldDecorator={getFieldDecorator} style={{ maxWidth: '300px' }} />
              </div>
            </div>
            <div className="oe-schedule-form-datetime">
              <span className="oe-schedule-form-datetime-label">From:</span>
              <div className="oe-schedule-form-datetime-pickers">
                <DatePicker id="date-picker-from" value={startAt ? moment.utc(startAt).local() : moment()} onChange={(...e) => this.onChange(...e, 'startAt')} />
                <TimePicker id="time-picker-from" value={startAt ? moment.utc(startAt).local() : moment()} onChange={(...e) => this.onChange(...e, 'startAt')} format="HH:mm" />
              </div>
            </div>
            <div className="oe-schedule-form-datetime">
              <span className="oe-schedule-form-datetime-label">To:</span>
              <div className="oe-schedule-form-datetime-pickers">
                <DatePicker id="date-picker-to" value={endOn ? moment.utc(endOn).local() : moment()} onChange={(...e) => this.onChange(...e, 'endOn')} />
                <TimePicker id="time-picker-to" value={endOn ? moment.utc(endOn).local() : moment()} onChange={(...e) => this.onChange(...e, 'endOn')} format="HH:mm" />
              </div>
            </div>
            <div className="oe-location-form-item">
              <span className="oe-location-form-item-label">Status:</span>
              <div>
                <Input disabled={true} value={getFieldValue(`${field}.status`)} />
              </div>
            </div>

            {recurrenceType === 'custom' && (
              <>
                <div className="oe-schedule-form-repeatsevery">
                  <div className="oe-schedule-form-repeatsevery-label">Repeat every:</div>
                  <div className="oe-schedule-form-repeatsevery-pickers">
                    {getFieldDecorator(`${field}.repeatsEvery`, {
                      initialValue: getDepthValue(data, 'repeatsEvery', 1),
                    })(<InputNumber min={1} max={30} />)}
                    {getFieldDecorator(`${field}.repeatsType`, {
                      initialValue: getDepthValue(data, 'repeatsType', 'day'),
                    })(
                      <Select placeholder="Select">
                        <Select.Option value="day">
                          day
                          {repeatsEvery > 1 && 's'}
                        </Select.Option>
                        <Select.Option value="week">
                          week
                          {repeatsEvery > 1 && 's'}
                        </Select.Option>
                        <Select.Option value="month">
                          month
                          {repeatsEvery > 1 && 's'}
                        </Select.Option>
                        <Select.Option value="year">
                          year
                          {repeatsEvery > 1 && 's'}
                        </Select.Option>
                      </Select>,
                    )}
                  </div>
                </div>
                <div className="oe-schedule-form-repeatsevery">
                  <div className="oe-schedule-form-repeatsevery-label">Repeat On:</div>
                  <div className="oe-schedule-form-repeatsevery-pickers">
                    {getFieldDecorator(`${field}.repeatsOn`, {
                      initialValue: getDepthValue(data, 'repeatsOn', []),
                    })(<Checkbox.Group options={weekdayOptions} />)}
                  </div>
                </div>
                <div className="oe-schedule-form-ends">
                  <div className="oe-schedule-form-ends-label">Ends:</div>
                  <div className="oe-schedule-form-ends-pickers">
                    {getFieldDecorator(`${field}.endType`, {
                      initialValue: getDepthValue(data, 'endType', 'never'),
                    })(
                      <Radio.Group>
                        <Radio style={radioStyle} value="never">
                          Never
                        </Radio>
                        <Radio style={radioStyle} value="on">
                          On {endType === 'on' && endTypeRender}
                        </Radio>
                        <Radio style={radioStyle} value="after">
                          After {endType === 'after' && endTypeRender}
                        </Radio>
                      </Radio.Group>,
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    )
  }
}
export default ScheduleForm
