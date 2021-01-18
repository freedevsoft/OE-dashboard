import React from 'react'
import { Form, Radio, Checkbox, InputNumber, Input } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { getDepthValue } from 'utils'
import BackgroundsSelect from 'containers/Selects/BackgroundsSelect'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import './index.scss'

const GroupStyle = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  disabled,
  initialValue = {
    title: {
      bg_type: 'color',
      bg_image: null,
      bg_color: 'white',
      fg_type: 'color',
      fg_color: 'black',
    },
    bg_type: 'color',
    bg_image: null,
    bg_color: 'white',
    fg_type: 'color',
    fg_color: 'black',
    hl_type: 'color',
    hl_color: 'yello',
    b_shadow: false,
    shadow: {
      color: 'black',
    },
    b_outline: false,
    outline: {
      color: 'black',
      width: 0,
      radius: 0,
    },
    canvas: {
      height: 1920,
      width: 1080,
    },
    mediabox: {
      height: 720,
      width: 1280,
      count: 4,
      ratio: '16:9',
      location: 'left',
    },
    b_timestamp: false,
    b_show_highlight_bar: false,
    b_show_articles_count: false,
    text_articles_count: '',
    b_show_short_descr: false,
    b_divide_major: false,
    b_divide_minor: false,
    divider_major: 'white',
    divider_minor: 'white',
    h_align: 'left',
    v_align: 'left',
    b_icon: false,
    tooltip: {
      text: '',
    },
  },
}) => {
  const changeHandler = (field, value) => {
    const key = field
    setFieldsValue({ [key]: value })
  }

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('title.bg_type')
  register('title.bg_image')
  register('title.bg_color')
  register('title.fg_type')
  register('title.fg_color')

  register('bg_type')
  register('bg_image')
  register('bg_color')
  register('fg_type')
  register('fg_color')
  register('hl_type')
  register('hl_color')
  register('b_shadow')
  register('shadow.color')
  register('b_outline')
  register('outline.color')
  register('outline.width')
  register('outline.radius')
  register('canvas.height')
  register('canvas.width')
  register('mediabox.height')
  register('mediabox.width')
  register('mediabox.count')
  register('mediabox.ratio')
  register('mediabox.location')
  register('b_timestamp')
  register('b_show_highlight_bar')
  register('b_show_articles_count')
  register('text_articles_count')
  register('b_show_short_descr')
  register('b_divide_major')
  register('b_divider_minor')
  register('divider_major')
  register('divider_minor')
  register('h_align')
  register('v_align')
  register('b_icon')
  register('tooltip.text')

  let bChanged = false

  Object.keys(initialValue).forEach(key => {
    if (getFieldValue(`${field}.${key}`) !== initialValue[key]) bChanged = true
  })

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '40px',
  }

  function onRepopulate() {
    Object.keys(initialValue).forEach(key => {
      setFieldsValue({ [`${field}.${key}`]: initialValue[key] })
    })
  }

  return (
    <div className="bits-form-style-v2">
      <Form.Item label="Title Background" className="primary-label">
        {getFieldDecorator(`${field}.title.bg_type`, { initialValue: initial('title.bg_type') })(
          <Radio.Group style={{ paddingLeft: '30px' }}>
            <Radio style={radioStyle} value="image" disabled={disabled}>
              Image
              {getFieldValue(`${field}.title.bg_type`) === 'image' &&
                getFieldDecorator(`${field}.title.bg_image`, { initialValue: initial('title.bg_image') })(
                  <BackgroundsSelect style={{ marginLeft: '10px', width: '300px' }} />,
                )}
            </Radio>
            <Radio style={radioStyle} value="color" disabled={disabled}>
              Color &nbsp;&nbsp;
              {getFieldValue(`${field}.title.bg_type`) === 'color' && (
                <ColorPicker
                  color={getFieldValue(`${field}.title.bg_color`)}
                  onValueChange={changeHandler}
                  field={`${field}.title.bg_color`}
                  wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
                  disabled={disabled}
                />
              )}
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="Title Foreground" className="primary-label">
        {getFieldDecorator(`${field}.title.fg_type`, { initialValue: initial('title.fg_type') })(
          <Radio.Group style={{ paddingLeft: '30px' }} disabled={disabled}>
            <Radio style={radioStyle} value="color">
              Color &nbsp;&nbsp;
              {getFieldValue(`${field}.title.fg_type`) === 'color' && (
                <ColorPicker
                  color={getFieldValue(`${field}.title.fg_color`)}
                  onValueChange={changeHandler}
                  field={`${field}.title.fg_color`}
                  wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
                  disabled={disabled}
                />
              )}
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="Body Background" className="primary-label">
        {getFieldDecorator(`${field}.bg_type`, { initialValue: initial('bg_type') })(
          <Radio.Group style={{ paddingLeft: '30px' }} disabled={disabled}>
            <Radio style={radioStyle} value="image">
              Image
              {getFieldValue(`${field}.bg_type`) === 'image' &&
                getFieldDecorator(`${field}.bg_image`, { initialValue: initial('bg_image') })(
                  <BackgroundsSelect style={{ marginLeft: '10px', width: '300px' }} disabled={disabled} />,
                )}
            </Radio>
            <Radio style={radioStyle} value="color">
              Color &nbsp;&nbsp;
              {getFieldValue(`${field}.bg_type`) === 'color' && (
                <ColorPicker
                  color={getFieldValue(`${field}.bg_color`)}
                  onValueChange={changeHandler}
                  field={`${field}.bg_color`}
                  wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
                  disabled={disabled}
                />
              )}
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="Body Foreground" className="primary-label">
        {getFieldDecorator(`${field}.fg_type`, { initialValue: initial('fg_type') })(
          <Radio.Group style={{ paddingLeft: '30px' }} disabled={disabled}>
            <Radio style={radioStyle} value="color">
              Color &nbsp;&nbsp;
              {getFieldValue(`${field}.fg_type`) === 'color' && (
                <ColorPicker
                  color={getFieldValue(`${field}.fg_color`)}
                  onValueChange={changeHandler}
                  field={`${field}.fg_color`}
                  wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
                  disabled={disabled}
                />
              )}
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="Highlight" className="primary-label">
        {getFieldDecorator(`${field}.hl_type`, { initialValue: initial('hl_type') })(
          <Radio.Group style={{ paddingLeft: '30px' }} disabled={disabled}>
            <Radio style={radioStyle} value="color">
              Color &nbsp;&nbsp;
              {getFieldValue(`${field}.hl_type`) === 'color' && (
                <ColorPicker
                  color={getFieldValue(`${field}.hl_color`)}
                  onValueChange={changeHandler}
                  field={`${field}.hl_color`}
                  wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
                  disabled={disabled}
                />
              )}
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="Outer" className="primary-label">
        <div>
          {getFieldDecorator(`${field}.b_shadow`, {
            initialValue: initial('b_shadow'),
            valuePropName: 'checked',
            rules: [
              {
                transform: value => value || undefined, // Those two lines
                type: 'boolean',
              },
            ],
          })(
            <Checkbox
              style={{
                display: 'inline-block',
                marginLeft: '30px',
                marginRight: '10px',
                lineHeight: '40px',
                width: '100px',
              }}
              disabled={disabled}
            >
              Shadow
            </Checkbox>,
          )}
          {getFieldValue(`${field}.b_shadow`) && (
            <ColorPicker
              color={getFieldValue(`${field}.shadow.color`)}
              onValueChange={changeHandler}
              field={`${field}.shadow.color`}
              wrapperStyle={{ display: 'inline-block', marginBottom: '-9px', marginLeft: '1rem' }}
              disabled={disabled}
            />
          )}
        </div>
        {getFieldDecorator(`${field}.b_outline`, {
          initialValue: initial('b_outline'),
          valuePropName: 'checked',
          rules: [
            {
              transform: value => value || undefined, // Those two lines
              type: 'boolean',
            },
          ],
        })(
          <Checkbox
            style={{
              display: 'inline-block',
              marginLeft: '30px',
              marginRight: '10px',
              lineHeight: '40px',
              width: '100px',
            }}
            disabled={disabled}
          >
            Outline
          </Checkbox>,
        )}
      </Form.Item>

      {getFieldValue(`${field}.b_outline`) && (
        <>
          <Form.Item style={{ paddingLeft: '4rem' }}>
            <span style={{ width: '4rem', display: 'inline-block' }}>Width:</span>
            {getFieldDecorator(`${field}.outline.width`, {
              initialValue: initial('outline.width'),
            })(<InputNumber min={0} max={100} placeholder="0" disabled={disabled} />)}
            {getFieldValue(`${field}.outline.width`) > 0 && (
              <ColorPicker
                color={getFieldValue(`${field}.outline.color`)}
                onValueChange={changeHandler}
                field={`${field}.outline.color`}
                wrapperStyle={{ display: 'inline-block', marginBottom: '-9px', marginLeft: '1rem' }}
                disabled={disabled}
              />
            )}
          </Form.Item>

          <Form.Item style={{ paddingLeft: '4rem' }}>
            <span style={{ width: '4rem', display: 'inline-block' }}>Corner:</span>
            {getFieldDecorator(`${field}.outline.radius`, {
              initialValue: initial('outline.radius'),
            })(<InputNumber min={0} max={100} placeholder="0" disabled={disabled} />)}
          </Form.Item>
        </>
      )}
      <Form.Item label="Cavas" className="primary-label">
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Height:</span>
          {getFieldDecorator(`${field}.canvas.height`, {
            initialValue: initial('canvas.height'),
          })(<InputNumber min={1} max={10000} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Width:</span>
          {getFieldDecorator(`${field}.canvas.width`, {
            initialValue: initial('canvas.width'),
          })(<InputNumber min={0} max={10000} disabled={disabled} />)}
        </div>
      </Form.Item>
      <Form.Item label="MediaBox" className="primary-label">
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Height:</span>
          {getFieldDecorator(`${field}.mediabox.height`, {
            initialValue: initial('mediabox.height'),
          })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Width:</span>
          {getFieldDecorator(`${field}.mediabox.width`, {
            initialValue: initial('mediabox.width'),
          })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Article Count:</span>
          {getFieldDecorator(`${field}.mediabox.count`, {
            initialValue: initial('mediabox.count'),
          })(<InputNumber min={0} max={10} placeholder="0" disabled={disabled} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Aspect ratio:</span>
          <OZSelectItem
            field={`${field}.mediabox.ratio`}
            initialValue={initial('mediabox.ratio')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: '16:9 (landscape)', value: '16:9' },
              { label: '9:16 (portrait)', value: '9:16' },
              { label: 'TBD', value: 'TBD' },
            ]}
            style={{
              width: '225px',
              display: 'inline-block',
              lineHeight: '40px',
              marginBottom: '0px',
            }}
            disabled={disabled}
          />
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Location:</span>
          <OZSelectItem
            field={`${field}.mediabox.location`}
            initialValue={initial('mediabox.location')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Alternate', value: 'alternate' },
            ]}
            style={{
              width: '225px',
              display: 'inline-block',
              lineHeight: '40px',
              marginBottom: '0px',
            }}
            disabled={disabled}
          />
        </div>
      </Form.Item>
      <Form.Item label="Timestamp" className="primary-label">
        <div>
          {getFieldDecorator(`${field}.b_timestamp`, {
            initialValue: initial('b_timestamp'),
            valuePropName: 'checked',
            rules: [
              {
                transform: value => value || undefined, // Those two lines
                type: 'boolean',
              },
            ],
          })(
            <Checkbox
              style={{
                display: 'inline-block',
                marginLeft: '30px',
                lineHeight: '40px',
                width: '90px',
              }}
              disabled={disabled}
            >
              On/Off
            </Checkbox>,
          )}
        </div>
      </Form.Item>
      <Form.Item label="Show Highlight Bar" className="primary-label">
        {getFieldDecorator(`${field}.b_show_highlight_bar`, {
          initialValue: initial('b_show_highlight_bar'),
          valuePropName: 'checked',
          rules: [
            {
              transform: value => value || undefined, // Those two lines
              type: 'boolean',
            },
          ],
        })(
          <Checkbox
            style={{
              display: 'inline-block',
              marginLeft: '30px',
              lineHeight: '40px',
              width: '90px',
            }}
            disabled={disabled}
          >
            Yes/No
          </Checkbox>,
        )}
      </Form.Item>
      <Form.Item label="Show Articles Count" className="primary-label">
        <div>
          {getFieldDecorator(`${field}.b_show_articles_count`, {
            initialValue: initial('b_show_articles_count'),
            valuePropName: 'checked',
            rules: [
              {
                transform: value => value || undefined, // Those two lines
                type: 'boolean',
              },
            ],
          })(
            <Checkbox
              style={{
                display: 'inline-block',
                marginLeft: '30px',
                lineHeight: '40px',
                width: '90px',
              }}
              disabled={disabled}
            >
              Yes/No
            </Checkbox>,
          )}
          {getFieldValue(`${field}.b_show_articles_count`) &&
            getFieldDecorator(`${field}.text_articles_count`, {
              initialValue: initial('text_articles_count'),
            })(<Input autoComplete="off" style={{ width: '330px' }} disabled={disabled} />)}
        </div>
      </Form.Item>
      <Form.Item label="Show Short Description" className="primary-label">
        <div>
          {getFieldDecorator(`${field}.b_show_short_descr`, {
            initialValue: initial('b_show_short_descr'),
            valuePropName: 'checked',
            rules: [
              {
                transform: value => value || undefined, // Those two lines
                type: 'boolean',
              },
            ],
          })(
            <Checkbox
              style={{
                display: 'inline-block',
                marginLeft: '30px',
                lineHeight: '40px',
                width: '90px',
              }}
              disabled={disabled}
            >
              On/Off
            </Checkbox>,
          )}
        </div>
      </Form.Item>
      <Form.Item label="Divider" className="primary-label">
        <div>
          {getFieldDecorator(`${field}.b_divide_major`, {
            initialValue: initial('b_divide_major'),
            valuePropName: 'checked',
            rules: [
              {
                transform: value => value || undefined, // Those two lines
                type: 'boolean',
              },
            ],
          })(
            <Checkbox
              style={{
                display: 'inline-block',
                marginLeft: '30px',
                lineHeight: '40px',
                width: '100px',
              }}
              disabled={disabled}
            >
              Major
            </Checkbox>,
          )}
          {getFieldValue(`${field}.b_divide_major`) && (
            <ColorPicker
              color={getFieldValue(`${field}.divider_major`)}
              onValueChange={changeHandler}
              field={`${field}.divider_major`}
              wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
              disabled={disabled}
            />
          )}
        </div>
        <div>
          {getFieldDecorator(`${field}.b_divide_minor`, {
            initialValue: initial('b_divide_minor'),
            valuePropName: 'checked',
            rules: [
              {
                transform: value => value || undefined, // Those two lines
                type: 'boolean',
              },
            ],
          })(
            <Checkbox
              style={{
                display: 'inline-block',
                marginLeft: '30px',
                lineHeight: '40px',
                width: '100px',
              }}
              disabled={disabled}
            >
              Minor
            </Checkbox>,
          )}
          {getFieldValue(`${field}.b_divide_minor`) && (
            <ColorPicker
              color={getFieldValue(`${field}.divider_minor`)}
              onValueChange={changeHandler}
              field={`${field}.divider_minor`}
              wrapperStyle={{ display: 'inline-block', marginBottom: '-10px' }}
              disabled={disabled}
            />
          )}
        </div>
      </Form.Item>
      <Form.Item label="Alignment" className="primary-label">
        <Form.Item style={{ paddingLeft: '2rem' }}>
          <span style={{ width: '5rem', display: 'inline-block', textAlign: 'right', paddingRight: '1rem' }}>Horizontal:</span>
          <OZSelectItem
            field={`${field}.h_align`}
            initialValue={initial('h_align')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
            style={{
              width: 'calc(100% - 5rem)',
              display: 'inline-block',
              lineHeight: '40px',
              marginBottom: '0px',
            }}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item style={{ paddingLeft: '2rem' }}>
          <span style={{ width: '5rem', display: 'inline-block', textAlign: 'right', paddingRight: '1rem' }}>Vertical:</span>
          <OZSelectItem
            field={`${field}.v_align`}
            initialValue={initial('v_align')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Top', value: 'top' },
              { label: 'Middle', value: 'middle' },
              { label: 'Bottom', value: 'bottom' },
            ]}
            style={{
              width: 'calc(100% - 5rem)',
              display: 'inline-block',
              lineHeight: '40px',
              marginBottom: '0px',
            }}
            disabled={disabled}
          />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Tooltip" className="primary-label">
        <span style={{ width: '7rem', display: 'inline-block', textAlign: 'right', paddingRight: '1rem' }}>Text:</span>
        {getFieldDecorator(`${field}.tooltip.text`, {
          initialValue: initial('tooltip.text'),
        })(<Input autoComplete="off" style={{ width: 'calc(100% - 7rem)' }} disabled={disabled} />)}
      </Form.Item>
      <Form.Item label="Layout" className="primary-label">
        <span style={{ width: '7rem', display: 'inline-block', textAlign: 'right', paddingRight: '1rem' }}>Text:</span>
        {getFieldDecorator(`${field}.layout.text`, {
          initialValue: initial('layout.text'),
        })(<Input autoComplete="off" style={{ width: 'calc(100% - 7rem)' }} disabled={disabled} />)}
      </Form.Item>
      {/* <Form.Item label="Repopulated from Menu Style" className="primary-label">
        <Button style={{ marginLeft: '30px' }} disabled={bChanged === false} onClick={onRepopulate}>
          Repopulate
        </Button>
      </Form.Item> */}
    </div>
  )
}

export default GroupStyle
